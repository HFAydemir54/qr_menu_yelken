import type { Locale } from "./config";

export const ui = {
  tagline: {
    tr: "Börek · Pide · Kahvaltı",
    en: "Pastry · Pide · Breakfast",
    ar: "معجنات · بيدة · فطور",
  },
  hours: {
    tr: "Her gün · Kapanış 22:30",
    en: "Daily · Closes 22:30",
    ar: "يومياً · يغلق ٢٢:٣٠",
  },
  reviews: {
    tr: "yorum",
    en: "reviews",
    ar: "تقييم",
  },
  call: { tr: "Ara", en: "Call", ar: "اتصل" },
  directions: { tr: "Yol Tarifi", en: "Directions", ar: "الاتجاهات" },
  menuTitle: { tr: "Menü", en: "Menu", ar: "قائمة الطعام" },
  categories: {
    tr: "Menü kategorileri",
    en: "Menu categories",
    ar: "أقسام القائمة",
  },
  searchLabel: { tr: "Menüde ara", en: "Search the menu", ar: "ابحث في القائمة" },
  searchIn: {
    tr: "içinde ara…",
    en: "— search…",
    ar: "— ابحث…",
  },
  noResults: {
    tr: "için bu kategoride sonuç bulunamadı.",
    en: "— no results in this category.",
    ar: "— لا توجد نتائج في هذا القسم.",
  },
  taxNote: {
    tr: "Fiyatlarımızda tüm vergiler dahildir.",
    en: "All taxes are included in our prices.",
    ar: "جميع الضرائب مشمولة في أسعارنا.",
  },
  priceDate: {
    tr: "Fiyat değişim tarihi",
    en: "Prices updated on",
    ar: "تاريخ تحديث الأسعار",
  },
  language: { tr: "Dil", en: "Language", ar: "اللغة" },
} satisfies Record<string, Record<Locale, string>>;

export type UiKey = keyof typeof ui;

export function t(key: UiKey, locale: Locale) {
  return ui[key][locale];
}
