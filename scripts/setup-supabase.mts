/**
 * Supabase şemasını kurar, fotoğraf bucket'ını oluşturur ve
 * (tablolar boşsa) menu.json + menu-terms.ts içeriğini aktarır.
 *
 * Kullanım: node --env-file=.env.local --experimental-strip-types scripts/setup-supabase.mts
 */
import { readFile } from "node:fs/promises";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import { menuTerms } from "../supabase/seed/menu-terms.ts";

type LegacyItem = { name: string; note?: string; price: number | null };
type LegacyMenu = {
  priceDate: string;
  categories: {
    id: string;
    name: string;
    icon: string;
    groups: { title?: string; items: LegacyItem[] }[];
  }[];
};

const root = new URL("../", import.meta.url);
const t = (text: string | undefined) => ({
  tr: text ?? null,
  en: text ? (menuTerms[text]?.en ?? null) : null,
  ar: text ? (menuTerms[text]?.ar ?? null) : null,
});

const connectionString = process.env.POSTGRES_URL_NON_POOLING?.replace(/[?&]sslmode=[^&]*/, "");
if (!connectionString) throw new Error("POSTGRES_URL_NON_POOLING tanımlı değil.");

const db = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
await db.connect();

try {
  await db.query(await readFile(new URL("supabase/schema.sql", root), "utf8"));
  console.log("✓ Şema hazır");

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error: bucketError } = await supabase.storage.createBucket("menu-images", {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });
  if (bucketError && !/already exists/i.test(bucketError.message)) throw bucketError;
  console.log("✓ menu-images bucket hazır");

  const { rows } = await db.query("select count(*)::int as n from categories");
  if (rows[0].n > 0) {
    console.log("• Kategoriler zaten dolu, veri aktarımı atlandı.");
  } else {
    const menu = JSON.parse(
      await readFile(new URL("supabase/seed/menu.json", root), "utf8"),
    ) as LegacyMenu;

    await db.query("begin");
    let itemCount = 0;
    for (const [c, category] of menu.categories.entries()) {
      const name = t(category.name);
      const { rows: [cat] } = await db.query(
        `insert into categories (slug, icon, name_tr, name_en, name_ar, sort_order)
         values ($1, $2, $3, $4, $5, $6) returning id`,
        [category.id, category.icon, name.tr, name.en, name.ar, c],
      );
      for (const [g, group] of category.groups.entries()) {
        const title = t(group.title);
        const { rows: [grp] } = await db.query(
          `insert into menu_groups (category_id, title_tr, title_en, title_ar, sort_order)
           values ($1, $2, $3, $4, $5) returning id`,
          [cat.id, title.tr, title.en, title.ar, g],
        );
        for (const [i, item] of group.items.entries()) {
          const n = t(item.name);
          const note = t(item.note);
          await db.query(
            `insert into menu_items (group_id, name_tr, name_en, name_ar, note_tr, note_en, note_ar, price, sort_order)
             values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [grp.id, n.tr, n.en, n.ar, note.tr, note.en, note.ar, item.price, i],
          );
          itemCount += 1;
        }
      }
    }
    await db.query(
      `insert into settings (key, value) values ('price_date', $1)
       on conflict (key) do update set value = excluded.value`,
      [menu.priceDate],
    );
    await db.query("commit");
    console.log(`✓ ${menu.categories.length} kategori, ${itemCount} ürün aktarıldı`);
  }
} catch (error) {
  await db.query("rollback").catch(() => {});
  throw error;
} finally {
  await db.end();
}
