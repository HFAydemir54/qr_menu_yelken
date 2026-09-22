import "server-only";
import { unstable_cache } from "next/cache";
import type { Localized, MenuCategory, MenuData } from "@/data/menu";
import { publicClient } from "./supabase";

export const MENU_TAG = "menu";

type Row = Record<string, unknown>;

function localized(row: Row, field: string): Localized | null {
  const tr = row[`${field}_tr`] as string | null;
  if (!tr) return null;
  return {
    tr,
    en: (row[`${field}_en`] as string | null) || null,
    ar: (row[`${field}_ar`] as string | null) || null,
  };
}

/** Tüm menüyü (pasif kategoriler dahil) sıralı olarak okur. */
export async function fetchMenu(): Promise<MenuData> {
  const supabase = publicClient();
  const [categories, groups, items, settings] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("created_at"),
    supabase.from("menu_groups").select("*").order("sort_order").order("created_at"),
    supabase.from("menu_items").select("*").order("sort_order").order("created_at"),
    supabase.from("settings").select("*").eq("key", "price_date").maybeSingle(),
  ]);
  for (const result of [categories, groups, items, settings]) {
    if (result.error) throw new Error(`Menü okunamadı: ${result.error.message}`);
  }

  const byCategory = new Map<string, MenuCategory["groups"]>();
  const byGroup = new Map<string, MenuCategory["groups"][number]["items"]>();

  for (const row of groups.data as Row[]) {
    const group = { id: row.id as string, title: localized(row, "title"), items: [] };
    byGroup.set(group.id, group.items);
    const list = byCategory.get(row.category_id as string) ?? [];
    list.push(group);
    byCategory.set(row.category_id as string, list);
  }

  for (const row of items.data as Row[]) {
    byGroup.get(row.group_id as string)?.push({
      id: row.id as string,
      name: localized(row, "name")!,
      note: localized(row, "note"),
      price: row.price === null ? null : Number(row.price),
      imageUrl: (row.image_url as string | null) ?? null,
      available: row.is_available as boolean,
    });
  }

  return {
    priceDate: (settings.data?.value as string | undefined) ?? "",
    categories: (categories.data as Row[]).map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      icon: row.icon as string,
      name: localized(row, "name")!,
      active: row.is_active as boolean,
      groups: byCategory.get(row.id as string) ?? [],
    })),
  };
}

/** Müşteri menüsü: önbellekten sunulur, admin kaydettiğinde MENU_TAG ile yenilenir. */
export const getPublicMenu = unstable_cache(
  async (): Promise<MenuData> => {
    const menu = await fetchMenu();
    return {
      ...menu,
      categories: menu.categories
        .filter((category) => category.active)
        .map((category) => ({
          ...category,
          groups: category.groups.filter((group) => group.items.length > 0),
        }))
        .filter((category) => category.groups.length > 0),
    };
  },
  ["public-menu"],
  { tags: [MENU_TAG] },
);
