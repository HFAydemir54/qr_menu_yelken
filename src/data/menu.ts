import type { Locale } from "@/i18n/config";

/** Üç dilli metin. Karşılığı olmayan dillerde Türkçe gösterilir. */
export type Localized = Record<Locale, string | null> & { tr: string };

export type MenuItem = {
  id: string;
  name: Localized;
  /** Parantez içi açıklama / içindekiler */
  note: Localized | null;
  /** TL cinsinden fiyat. null ise menüde fiyat gösterilmez. */
  price: number | null;
  imageUrl: string | null;
  available: boolean;
};

export type MenuGroup = {
  id: string;
  /** Kategori içindeki alt başlık (ör. "TOST", "KIR PİDESİ"). Yoksa doğrudan listelenir. */
  title: Localized | null;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: Localized;
  icon: string;
  active: boolean;
  groups: MenuGroup[];
};

export type MenuData = { priceDate: string; categories: MenuCategory[] };

/** Menü içeriği Supabase'de tutulur (bkz. src/lib/menu-repo.ts); burası sabit işletme bilgileri. */
export const cafe = {
  name: "Yelken Börek Cafe",
  tagline: "Börek · Pide · Kahvaltı",
  phone: "+90 536 767 82 11",
  phoneHref: "tel:+905367678211",
  address: "Kurtköy, Ankara Cd. Yelken Plaza D:289/19, 34912 Pendik/İstanbul",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Yelken+B%C3%B6rek+Pide+Cafe+Kurt%C3%B6y+Pendik",
  hours: "Her gün · Kapanış 22:30",
  rating: 4.1,
  reviewCount: 102,
};
