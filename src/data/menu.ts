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

export const menu: MenuCategory[] = [
  {
    id: "kahvalti",
    name: "Kahvaltı",
    icon: "🍳",
    groups: [
      {
        items: [
          {
            name: "Mini Kahvaltı",
            note: "Domates, Salatalık, Beyaz Peynir, Kaşar Peyniri, Zeytin, Haşlanmış Yumurta, Karper Peyniri, Reçel",
            price: 350,
          },
          {
            name: "Serpme Kahvaltı",
            note: "Domates, Salatalık, Beyaz Peynir, Kaşar Peyniri, Zeytin, Salam, Sosis, Bal, Tereyağ, Çikolata, Karper Peyniri, Reçel, Patates Kızartması, Sahanda Yumurta, Menemen, Sınırsız Çay — 3. kişi servis ücreti 250 TL'dir.",
            price: 1100,
          },
          { name: "Omlet", price: 200 },
          { name: "Sahanda 2 Yumurta", price: 210 },
          { name: "Sahanda 2 Yumurta", note: "Kaşarlı", price: 220 },
          { name: "Sahanda 2 Yumurta", note: "Sucuklu", price: 230 },
          { name: "Sahanda 2 Yumurta", note: "Kaşarlı, Sucuklu", price: 240 },
          { name: "Menemen", price: 210 },
          { name: "Menemen", note: "Kaşarlı", price: 220 },
          { name: "Menemen", note: "Karışık", price: 240 },
          { name: "Söğüş Tabağı", price: 150 },
        ],
      },
    ],
  },
  {
    id: "fast-food",
    name: "Fast Food",
    icon: "🍔",
    groups: [
      {
        title: "Tost",
        items: [
          { name: "Kaşarlı Tost", price: 130 },
          { name: "Kaşarlı Sucuklu Tost", price: 170 },
          { name: "Beyaz Peynirli Tost", price: 160 },
          { name: "Karışık Tost", note: "Kaşar, Sucuk, Domates, Ketçap", price: 190 },
        ],
      },
      {
        title: "Burger Menü",
        items: [
          { name: "Hamburger Menü", note: "Patates Kızartması + Cola", price: 320 },
          { name: "Double Köfte Hamburger Menü", note: "Patates Kızartması + Cola", price: 340 },
          { name: "Cheese Burger Menü", note: "Patates Kızartması + Cola", price: 370 },
          { name: "Double Cheese Burger Menü", note: "Patates Kızartması + Cola", price: 400 },
        ],
      },
      {
        items: [
          { name: "Patates Kızartması", note: "Porsiyon", price: 240 },
          { name: "Patso", price: 200 },
          { name: "Patso", note: "Sosisli", price: 230 },
        ],
      },
    ],
  },
  {
    id: "pide-borek",
    name: "Pide & Börek",
    icon: "🥟",
    groups: [
      {
        title: "Kır Pidesi",
        items: [
          { name: "Kıymalı Kır Pidesi", price: 50 },
          { name: "Peynirli Kır Pidesi", price: 50 },
          { name: "Patatesli Kır Pidesi", price: 50 },
        ],
      },
      {
        title: "Açık Pide",
        items: [
          { name: "Güveç Pide", price: 100 },
          { name: "Kaşarlı Açık Pide", price: 270 },
          { name: "Kaşarlı Sucuklu Açık Pide", price: 290 },
          { name: "Kıymalı Açık Pide", price: 300 },
          { name: "Kavurmalı Kaşarlı Açık Pide", price: 380 },
          { name: "Karışık Açık Pide", price: 350 },
        ],
      },
      {
        title: "Poğaça · Açma · Börek",
        items: [
          { name: "Poğaça - Simit - Sade Açma", price: 25 },
          { name: "Çekirdekli Simit", price: 30 },
          { name: "Dereotlu Poğaça", price: 30 },
          { name: "Açma Çeşitleri", price: 30 },
          { name: "Açma Pizza", price: 40 },
          { name: "Simit Pizza", price: 50 },
          { name: "Dilim Pizza", price: 100 },
          { name: "Sandviç", price: 100 },
          { name: "Boyoz", note: "Sade", price: 40 },
          { name: "Sigara Böreği", price: 50 },
          { name: "Küt Böreği", note: "Porsiyon", price: 100 },
          { name: "Kol Böreği", note: "Kıymalı, Patatesli, Peynirli — Porsiyon", price: 150 },
          { name: "Su Böreği", note: "Porsiyon", price: 150 },
          { name: "Adana Böreği", note: "Kaşarlı — Porsiyon", price: 200 },
        ],
      },
    ],
  },
  {
    id: "kahve",
    name: "Kahve",
    icon: "☕",
    groups: [
      {
        items: [
          { name: "Türk Kahvesi", price: 100 },
          { name: "Sütlü Türk Kahvesi", price: 120 },
          { name: "Damla Sakızlı Türk Kahvesi", price: 120 },
          { name: "Double Türk Kahvesi", price: 180 },
          { name: "Menengiç", price: 120 },
          { name: "Dibek Kahvesi", price: 100 },
          { name: "Espresso", price: 100 },
          { name: "Americano", price: 120 },
          { name: "Latte", price: 160 },
          { name: "Cappuccino", price: 150 },
          { name: "Nescafe", price: 80 },
          { name: "Sütlü Nescafe", price: 100 },
        ],
      },
    ],
  },
  {
    id: "icecekler",
    name: "İçecekler",
    icon: "🥤",
    groups: [
      {
        title: "Soğuk İçecek",
        items: [
          { name: "Su", price: 20 },
          { name: "Meyve Suyu Çeşitleri", note: "200 ml", price: 30 },
          { name: "Link Çeşitleri", price: 30 },
          { name: "Küçük Ayran", price: 30 },
          { name: "Büyük Ayran", price: 45 },
          { name: "Sade Soda", price: 30 },
          { name: "Meyveli Soda", price: 35 },
          { name: "Çamlıca Gazoz", price: 50 },
          { name: "Süt Çeşitleri", price: 35 },
          { name: "Kutu Soğuk Nescafe", price: 80 },
          { name: "Lipton Çeşitleri", price: 70 },
          { name: "Kutu Cola - Fanta Çeşitleri", price: 70 },
          { name: "Kutu Cappy Çeşitleri", price: 70 },
          { name: "1 Litrelik İçecek", note: "Cola, Fanta, Ayran, Meyve Suyu", price: 110 },
        ],
      },
      {
        title: "Sıcak İçecek",
        items: [
          { name: "Küçük Çay", price: 30 },
          { name: "Büyük Çay", price: 50 },
          { name: "Yeşil Çay", price: 70 },
          { name: "Kuşburnu", price: 70 },
          { name: "Ihlamur", price: 70 },
          { name: "Sıcak Süt", price: 60 },
          { name: "Sahlep", price: 80 },
          { name: "Sıcak Çikolata", price: 100 },
        ],
      },
    ],
  },
  {
    id: "kurabiye",
    name: "Kurabiye",
    icon: "🍪",
    groups: [
      {
        items: [
          { name: "Elmalı Kurabiye", price: 25 },
          { name: "İzmir Bomba", price: 50 },
        ],
      },
    ],
  },
];

export const cafe = {
  name: "Yelken Börek Cafe",
  tagline: "Börek · Pide · Kahvaltı",
  phone: "+90 536 767 82 11",
  phoneHref: "tel:+905367678211",
  address:
    "Kurtköy, Ankara Cd. Yelken Plaza D:289/19, 34912 Pendik/İstanbul",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Yelken+B%C3%B6rek+Pide+Cafe+Kurt%C3%B6y+Pendik",
  hours: "Her gün · Kapanış 22:30",
  rating: 4.1,
  reviewCount: 102,
  priceDate: "04.02.2026",
};
