"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSession,
  destroySession,
  isLoggedIn,
} from "@/lib/admin-auth";
import { MENU_TAG } from "@/lib/menu-repo";
import { adminClient, IMAGE_BUCKET } from "@/lib/supabase";

export type ActionState = { error?: string; success?: string };

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Şifre girin." };

  try {
    if (!checkPassword(password)) return { error: "Şifre hatalı." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Giriş yapılamadı." };
  }

  await createSession();
  revalidatePath("/admin");
  return {};
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin");
}

// ——— Yardımcılar ———

class InputError extends Error {}

const tables = ["categories", "menu_groups", "menu_items"] as const;
type Table = (typeof tables)[number];

/** Server Action argümanları istemciden gelir; tablo adını doğrula. */
function assertTable(table: unknown): asserts table is Table {
  if (!tables.includes(table as Table)) throw new InputError("Geçersiz işlem.");
}

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value === "" ? null : value;
}

function required(formData: FormData, key: string, label: string) {
  const value = text(formData, key);
  if (!value) throw new InputError(`${label} boş olamaz.`);
  return value;
}

function localizedFields(formData: FormData, field: string, label?: string) {
  return {
    [`${field}_tr`]: label ? required(formData, `${field}_tr`, label) : text(formData, `${field}_tr`),
    [`${field}_en`]: text(formData, `${field}_en`),
    [`${field}_ar`]: text(formData, `${field}_ar`),
  };
}

function parsePrice(raw: string | null, name: string) {
  if (raw === null) return null;
  const value = Number(raw.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) {
    throw new InputError(`Geçersiz fiyat: ${name} → "${raw}"`);
  }
  return value;
}

function slugify(value: string) {
  const slug = value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "kategori"}-${randomUUID().slice(0, 4)}`;
}

function check<T extends { error: { message: string } | null }>(result: T) {
  if (result.error) throw new Error(result.error.message);
  return result;
}

/** Oturum kontrolü, hata yakalama ve önbellek yenilemeyi tek yerde toplar. */
async function run(
  work: () => Promise<string | void>,
): Promise<ActionState> {
  if (!(await isLoggedIn())) return { error: "Oturum sona erdi, tekrar giriş yapın." };
  try {
    const success = await work();
    updateTag(MENU_TAG);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: success ?? "Kaydedildi." };
  } catch (error) {
    if (error instanceof InputError) return { error: error.message };
    console.error(error);
    return { error: `Kaydedilemedi: ${error instanceof Error ? error.message : "bilinmeyen hata"}` };
  }
}

/** Yeni kayıt, bulunduğu listenin sonuna eklenir. */
async function nextSortOrder(table: Table, parentColumn?: string, parentId?: string) {
  let query = adminClient().from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (parentColumn && parentId) query = query.eq(parentColumn, parentId);
  const { data } = check(await query);
  return ((data?.[0]?.sort_order as number | undefined) ?? -1) + 1;
}

async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new InputError("Yalnızca fotoğraf yüklenebilir.");
  if (file.size > 5 * 1024 * 1024) throw new InputError("Fotoğraf en fazla 5 MB olabilir.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `items/${randomUUID()}.${extension}`;
  const storage = adminClient().storage.from(IMAGE_BUCKET);
  check(await storage.upload(path, file, { contentType: file.type, cacheControl: "31536000" }));
  return { image_path: path, image_url: storage.getPublicUrl(path).data.publicUrl };
}

async function removeImages(paths: (string | null | undefined)[]) {
  const existing = paths.filter((path): path is string => Boolean(path));
  if (existing.length > 0) {
    await adminClient().storage.from(IMAGE_BUCKET).remove(existing);
  }
}

// ——— Toplu fiyat ———

/** Alan adları `price:<ürünId>` biçimindedir. */
export async function savePricesAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return run(async () => {
    const supabase = adminClient();
    const { data: items } = check(await supabase.from("menu_items").select("id, name_tr, price"));
    const current = new Map(items!.map((item) => [item.id as string, item]));

    const updates: { id: string; price: number | null }[] = [];
    for (const key of formData.keys()) {
      if (!key.startsWith("price:")) continue;
      const item = current.get(key.slice("price:".length));
      if (!item) continue;
      const next = parsePrice(text(formData, key), item.name_tr as string);
      const previous = item.price === null ? null : Number(item.price);
      if (next !== previous) updates.push({ id: item.id as string, price: next });
    }

    for (const { id, price } of updates) {
      check(await supabase.from("menu_items").update({ price, updated_at: new Date().toISOString() }).eq("id", id));
    }

    const priceDate = text(formData, "priceDate");
    if (priceDate) {
      check(await supabase.from("settings").upsert({ key: "price_date", value: priceDate }));
    }

    return updates.length === 0
      ? "Fiyat değişikliği yok."
      : `${updates.length} ürünün fiyatı güncellendi.`;
  });
}

// ——— Kategori ———

export async function saveCategoryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return run(async () => {
    const id = text(formData, "id");
    const name = required(formData, "name_tr", "Kategori adı (TR)");
    const fields = {
      ...localizedFields(formData, "name", "Kategori adı (TR)"),
      icon: text(formData, "icon") ?? "🍽️",
      is_active: formData.get("is_active") === "on",
    };
    const table = adminClient().from("categories");

    if (id) {
      check(await table.update(fields).eq("id", id));
      return "Kategori güncellendi.";
    }
    check(
      await table.insert({
        ...fields,
        slug: slugify(name),
        sort_order: await nextSortOrder("categories"),
      }),
    );
    return "Kategori eklendi.";
  });
}

// ——— Alt başlık ———

export async function saveGroupAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return run(async () => {
    const id = text(formData, "id");
    const fields = localizedFields(formData, "title");
    const table = adminClient().from("menu_groups");

    if (id) {
      check(await table.update(fields).eq("id", id));
      return "Alt başlık güncellendi.";
    }
    const categoryId = required(formData, "category_id", "Kategori");
    check(
      await table.insert({
        ...fields,
        category_id: categoryId,
        sort_order: await nextSortOrder("menu_groups", "category_id", categoryId),
      }),
    );
    return "Alt başlık eklendi.";
  });
}

// ——— Ürün ———

export async function saveItemAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return run(async () => {
    const supabase = adminClient();
    const id = text(formData, "id");
    const name = required(formData, "name_tr", "Ürün adı (TR)");
    const fields: Record<string, unknown> = {
      ...localizedFields(formData, "name", "Ürün adı (TR)"),
      ...localizedFields(formData, "note"),
      price: parsePrice(text(formData, "price"), name),
      is_available: formData.get("is_available") === "on",
      updated_at: new Date().toISOString(),
    };

    const previous = id
      ? (check(await supabase.from("menu_items").select("image_path").eq("id", id).single()).data as {
          image_path: string | null;
        })
      : null;

    const image = formData.get("image");
    const replaceImage = image instanceof File && image.size > 0;
    const dropImage = formData.get("remove_image") === "on";
    if (replaceImage) Object.assign(fields, await uploadImage(image));
    else if (dropImage) Object.assign(fields, { image_path: null, image_url: null });

    if (id) {
      check(await supabase.from("menu_items").update(fields).eq("id", id));
      if (replaceImage || dropImage) await removeImages([previous?.image_path]);
      return "Ürün güncellendi.";
    }

    const groupId = required(formData, "group_id", "Alt başlık");
    check(
      await supabase.from("menu_items").insert({
        ...fields,
        group_id: groupId,
        sort_order: await nextSortOrder("menu_items", "group_id", groupId),
      }),
    );
    return "Ürün eklendi.";
  });
}

export async function toggleItemAvailableAction(id: string, available: boolean) {
  return run(async () => {
    check(await adminClient().from("menu_items").update({ is_available: available }).eq("id", id));
    return available ? "Ürün satışa açıldı." : "Ürün tükendi olarak işaretlendi.";
  });
}

// ——— Silme ve sıralama (ortak) ———

export async function deleteAction(table: Table, id: string) {
  return run(async () => {
    assertTable(table);
    const supabase = adminClient();

    // Silinen kayıtla birlikte cascade ile gidecek ürünlerin fotoğraflarını da temizle.
    let itemsQuery = supabase.from("menu_items").select("image_path");
    if (table === "menu_items") itemsQuery = itemsQuery.eq("id", id);
    else if (table === "menu_groups") itemsQuery = itemsQuery.eq("group_id", id);
    else {
      const { data: groups } = check(await supabase.from("menu_groups").select("id").eq("category_id", id));
      itemsQuery = itemsQuery.in("group_id", groups!.map((group) => group.id as string));
    }
    const { data: images } = check(await itemsQuery);

    check(await supabase.from(table).delete().eq("id", id));
    await removeImages(images!.map((row) => row.image_path as string | null));
    return "Silindi.";
  });
}

const parentColumn: Record<Table, string | null> = {
  categories: null,
  menu_groups: "category_id",
  menu_items: "group_id",
};

/**
 * Sürükle-bırak sonrası listenin yeni sırasını kaydeder.
 * `orderedIds` aynı üst kayda ait kardeşlerin tamamı olmalı.
 */
export async function reorderAction(table: Table, orderedIds: string[]) {
  return run(async () => {
    assertTable(table);
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) throw new InputError("Geçersiz işlem.");

    const supabase = adminClient();
    const parent = parentColumn[table];

    let siblingsQuery = supabase.from(table).select("id");
    if (parent) {
      const { data: first } = check(
        await supabase.from(table).select(parent).eq("id", orderedIds[0]).single(),
      );
      siblingsQuery = siblingsQuery.eq(parent, (first as unknown as Record<string, string>)[parent]);
    }
    const { data: siblings } = check(await siblingsQuery);

    // Liste bu arada değiştiyse (başka sekmede ekleme/silme) eski sırayı yazma.
    const current = new Set(siblings!.map((sibling) => sibling.id as string));
    if (current.size !== orderedIds.length || orderedIds.some((id) => !current.has(id))) {
      throw new InputError("Liste bu arada değişmiş, sayfa yenilendi. Tekrar deneyin.");
    }

    await Promise.all(
      orderedIds.map(async (id, index) =>
        check(await supabase.from(table).update({ sort_order: index }).eq("id", id)),
      ),
    );
    return "Sıralama kaydedildi.";
  });
}
