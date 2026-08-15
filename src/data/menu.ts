import menuData from "./menu.json";

export type MenuItem = {
  name: string;
  /** Parantez içi açıklama / içindekiler */
  note?: string;
  /** TL cinsinden fiyat. null ise menüde "—" gösterilir. */
  price: number | null;
};

export type MenuGroup = {
  /** Kategori içindeki alt başlık (ör. "TOST", "KIR PİDESİ"). Yoksa doğrudan listelenir. */
  title?: string;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  name: string;
  icon: string;
  groups: MenuGroup[];
};

/** Menü verisi src/data/menu.json içinde tutulur; /admin panelinden güncellenir. */
export const menu: MenuCategory[] = menuData.categories as MenuCategory[];

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
  priceDate: menuData.priceDate,
};
