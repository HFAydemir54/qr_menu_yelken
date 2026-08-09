import type { Locale } from "./config";

/**
 * Menü metinlerinin çevirileri. Anahtar, `src/data/menu.ts` içindeki
 * Türkçe metnin birebir kendisidir; karşılığı yoksa Türkçe gösterilir.
 */
export const menuTerms: Record<string, Partial<Record<Locale, string>>> = {
  // ——— Kategoriler ———
  Kahvaltı: { en: "Breakfast", ar: "الفطور" },
  "Fast Food": { en: "Fast Food", ar: "الوجبات السريعة" },
  "Pide & Börek": { en: "Pide & Pastry", ar: "البيدة والمعجنات" },
  Kahve: { en: "Coffee", ar: "القهوة" },
  İçecekler: { en: "Drinks", ar: "المشروبات" },
  Kurabiye: { en: "Cookies", ar: "الحلويات" },

  // ——— Alt başlıklar ———
  Tost: { en: "Toast", ar: "توست" },
  "Burger Menü": { en: "Burger Meals", ar: "وجبات البرجر" },
  "Kır Pidesi": { en: "Village Pide", ar: "بيدة القرية" },
  "Açık Pide": { en: "Open Pide", ar: "بيدة مفتوحة" },
  "Poğaça · Açma · Börek": { en: "Pastries", ar: "المخبوزات" },
  "Soğuk İçecek": { en: "Cold Drinks", ar: "مشروبات باردة" },
  "Sıcak İçecek": { en: "Hot Drinks", ar: "مشروبات ساخنة" },

  // ——— Kahvaltı ———
  "Mini Kahvaltı": { en: "Mini Breakfast", ar: "فطور صغير" },
  "Serpme Kahvaltı": { en: "Turkish Spread Breakfast", ar: "فطور تركي مفتوح" },
  Omlet: { en: "Omelette", ar: "أومليت" },
  "Sahanda 2 Yumurta": { en: "2 Fried Eggs", ar: "بيضتان مقليتان" },
  Menemen: { en: "Menemen (Egg & Tomato)", ar: "منمن (بيض بالطماطم)" },
  "Söğüş Tabağı": { en: "Fresh Vegetable Plate", ar: "طبق خضار طازجة" },

  // ——— Fast food ———
  "Kaşarlı Tost": { en: "Cheese Toast", ar: "توست بالجبن" },
  "Kaşarlı Sucuklu Tost": { en: "Cheese & Sucuk Toast", ar: "توست بالجبن والسجق" },
  "Beyaz Peynirli Tost": { en: "White Cheese Toast", ar: "توست بالجبن الأبيض" },
  "Karışık Tost": { en: "Mixed Toast", ar: "توست مشكل" },
  "Hamburger Menü": { en: "Hamburger Meal", ar: "وجبة همبرغر" },
  "Double Köfte Hamburger Menü": {
    en: "Double Patty Burger Meal",
    ar: "وجبة همبرغر بقطعتين",
  },
  "Cheese Burger Menü": { en: "Cheeseburger Meal", ar: "وجبة تشيز برغر" },
  "Double Cheese Burger Menü": {
    en: "Double Cheeseburger Meal",
    ar: "وجبة تشيز برغر مزدوجة",
  },
  "Patates Kızartması": { en: "French Fries", ar: "بطاطس مقلية" },
  Patso: { en: "Patso (Fries Sandwich)", ar: "ساندويتش بطاطس" },

  // ——— Pide & börek ———
  "Kıymalı Kır Pidesi": { en: "Minced Meat Pide", ar: "بيدة باللحم المفروم" },
  "Peynirli Kır Pidesi": { en: "Cheese Pide", ar: "بيدة بالجبن" },
  "Patatesli Kır Pidesi": { en: "Potato Pide", ar: "بيدة بالبطاطس" },
  "Güveç Pide": { en: "Casserole Pide", ar: "بيدة الفخارة" },
  "Kaşarlı Açık Pide": { en: "Cheese Open Pide", ar: "بيدة مفتوحة بالجبن" },
  "Kaşarlı Sucuklu Açık Pide": {
    en: "Cheese & Sucuk Open Pide",
    ar: "بيدة مفتوحة بالجبن والسجق",
  },
  "Kıymalı Açık Pide": {
    en: "Minced Meat Open Pide",
    ar: "بيدة مفتوحة باللحم المفروم",
  },
  "Kavurmalı Kaşarlı Açık Pide": {
    en: "Roast Meat & Cheese Open Pide",
    ar: "بيدة مفتوحة باللحم المحمر والجبن",
  },
  "Karışık Açık Pide": { en: "Mixed Open Pide", ar: "بيدة مفتوحة مشكلة" },
  "Poğaça - Simit - Sade Açma": {
    en: "Pogaca - Simit - Plain Acma",
    ar: "بوغاتشا - سميت - عجمة سادة",
  },
  "Çekirdekli Simit": { en: "Seeded Simit", ar: "سميت بالحبوب" },
  "Dereotlu Poğaça": { en: "Dill Pogaca", ar: "بوغاتشا بالشبت" },
  "Açma Çeşitleri": { en: "Acma Varieties", ar: "أنواع العجمة" },
  "Açma Pizza": { en: "Acma Pizza", ar: "عجمة بيتزا" },
  "Simit Pizza": { en: "Simit Pizza", ar: "سميت بيتزا" },
  "Dilim Pizza": { en: "Pizza Slice", ar: "شريحة بيتزا" },
  Sandviç: { en: "Sandwich", ar: "ساندويتش" },
  Boyoz: { en: "Boyoz Pastry", ar: "معجنات بويوز" },
  "Sigara Böreği": { en: "Cigar Borek", ar: "بورك سيجارة" },
  "Küt Böreği": { en: "Küt Borek", ar: "بورك كوت" },
  "Kol Böreği": { en: "Rolled Borek", ar: "بورك ملفوف" },
  "Su Böreği": { en: "Su Borek (Layered)", ar: "بورك الماء" },
  "Adana Böreği": { en: "Adana Borek", ar: "بورك أضنة" },

  // ——— Kahve ———
  "Türk Kahvesi": { en: "Turkish Coffee", ar: "قهوة تركية" },
  "Sütlü Türk Kahvesi": { en: "Turkish Coffee with Milk", ar: "قهوة تركية بالحليب" },
  "Damla Sakızlı Türk Kahvesi": {
    en: "Mastic Turkish Coffee",
    ar: "قهوة تركية بالمستكة",
  },
  "Double Türk Kahvesi": { en: "Double Turkish Coffee", ar: "قهوة تركية مزدوجة" },
  Menengiç: { en: "Menengic Coffee", ar: "قهوة المننغيتش" },
  "Dibek Kahvesi": { en: "Dibek Coffee", ar: "قهوة ديبك" },
  Espresso: { en: "Espresso", ar: "إسبريسو" },
  Americano: { en: "Americano", ar: "أمريكانو" },
  Latte: { en: "Latte", ar: "لاتيه" },
  Cappuccino: { en: "Cappuccino", ar: "كابتشينو" },
  Nescafe: { en: "Nescafe", ar: "نسكافيه" },
  "Sütlü Nescafe": { en: "Nescafe with Milk", ar: "نسكافيه بالحليب" },

  // ——— Soğuk içecek ———
  Su: { en: "Water", ar: "ماء" },
  "Meyve Suyu Çeşitleri": { en: "Fruit Juices", ar: "عصائر الفواكه" },
  "Link Çeşitleri": { en: "Link Varieties", ar: "أنواع لينك" },
  "Küçük Ayran": { en: "Small Ayran", ar: "عيران صغير" },
  "Büyük Ayran": { en: "Large Ayran", ar: "عيران كبير" },
  "Sade Soda": { en: "Plain Soda", ar: "صودا سادة" },
  "Meyveli Soda": { en: "Fruit Soda", ar: "صودا بالفواكه" },
  "Çamlıca Gazoz": { en: "Çamlıca Soda", ar: "غازوز تشاملجا" },
  "Süt Çeşitleri": { en: "Milk Varieties", ar: "أنواع الحليب" },
  "Kutu Soğuk Nescafe": { en: "Canned Iced Nescafe", ar: "نسكافيه مثلج معلب" },
  "Lipton Çeşitleri": { en: "Lipton Ice Tea", ar: "ليبتون آيس تي" },
  "Kutu Cola - Fanta Çeşitleri": {
    en: "Canned Cola / Fanta",
    ar: "كولا وفانتا معلبة",
  },
  "Kutu Cappy Çeşitleri": { en: "Canned Cappy Juice", ar: "عصير كابي معلب" },
  "1 Litrelik İçecek": { en: "1 Litre Drinks", ar: "مشروبات لتر واحد" },

  // ——— Sıcak içecek ———
  "Küçük Çay": { en: "Small Tea", ar: "شاي صغير" },
  "Büyük Çay": { en: "Large Tea", ar: "شاي كبير" },
  "Yeşil Çay": { en: "Green Tea", ar: "شاي أخضر" },
  Kuşburnu: { en: "Rosehip Tea", ar: "شاي الورد البري" },
  Ihlamur: { en: "Linden Tea", ar: "شاي الزيزفون" },
  "Sıcak Süt": { en: "Hot Milk", ar: "حليب ساخن" },
  Sahlep: { en: "Salep", ar: "سحلب" },
  "Sıcak Çikolata": { en: "Hot Chocolate", ar: "شوكولاتة ساخنة" },

  // ——— Kurabiye ———
  "Elmalı Kurabiye": { en: "Apple Cookie", ar: "كوكيز بالتفاح" },
  "İzmir Bomba": { en: "İzmir Bomba (Chocolate Bun)", ar: "إزمير بومبا بالشوكولاتة" },

  // ——— Açıklama notları ———
  Kaşarlı: { en: "With cheese", ar: "بالجبن" },
  Sucuklu: { en: "With sucuk", ar: "بالسجق" },
  "Kaşarlı, Sucuklu": { en: "With cheese & sucuk", ar: "بالجبن والسجق" },
  Karışık: { en: "Mixed", ar: "مشكل" },
  Sade: { en: "Plain", ar: "سادة" },
  Sosisli: { en: "With sausage", ar: "بالنقانق" },
  Porsiyon: { en: "Portion", ar: "حصة" },
  "200 ml": { en: "200 ml", ar: "٢٠٠ مل" },
  "Patates Kızartması + Cola": {
    en: "French fries + cola",
    ar: "بطاطس مقلية + كولا",
  },
  "Kaşar, Sucuk, Domates, Ketçap": {
    en: "Cheese, sucuk, tomato, ketchup",
    ar: "جبن، سجق، طماطم، كاتشب",
  },
  "Kıymalı, Patatesli, Peynirli — Porsiyon": {
    en: "Minced meat, potato or cheese — portion",
    ar: "لحم مفروم أو بطاطس أو جبن — حصة",
  },
  "Kaşarlı — Porsiyon": { en: "With cheese — portion", ar: "بالجبن — حصة" },
  "Cola, Fanta, Ayran, Meyve Suyu": {
    en: "Cola, Fanta, ayran, fruit juice",
    ar: "كولا، فانتا، عيران، عصير",
  },
  "Domates, Salatalık, Beyaz Peynir, Kaşar Peyniri, Zeytin, Haşlanmış Yumurta, Karper Peyniri, Reçel":
    {
      en: "Tomato, cucumber, white cheese, kaşar cheese, olives, boiled egg, cream cheese, jam",
      ar: "طماطم، خيار، جبن أبيض، جبن قشقوان، زيتون، بيض مسلوق، جبنة كريمية، مربى",
    },
  "Domates, Salatalık, Beyaz Peynir, Kaşar Peyniri, Zeytin, Salam, Sosis, Bal, Tereyağ, Çikolata, Karper Peyniri, Reçel, Patates Kızartması, Sahanda Yumurta, Menemen, Sınırsız Çay — 3. kişi servis ücreti 250 TL'dir.":
    {
      en: "Tomato, cucumber, white cheese, kaşar cheese, olives, salami, sausage, honey, butter, chocolate spread, cream cheese, jam, fries, fried eggs, menemen, unlimited tea — service charge for a 3rd person is 250 TL.",
      ar: "طماطم، خيار، جبن أبيض، جبن قشقوان، زيتون، سلامي، نقانق، عسل، زبدة، شوكولاتة، جبنة كريمية، مربى، بطاطس مقلية، بيض مقلي، منمن، شاي بلا حدود — رسوم خدمة الشخص الثالث ٢٥٠ ليرة.",
    },
};

export function translateTerm(text: string, locale: Locale) {
  if (locale === "tr") return text;
  return menuTerms[text]?.[locale] ?? text;
}
