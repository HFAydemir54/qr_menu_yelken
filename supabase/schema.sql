-- Yelken QR Menü veritabanı şeması.
-- Okuma herkese açık (anon), yazma yalnızca sunucudaki service role anahtarıyla yapılır.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text not null default '🍽️',
  name_tr text not null,
  name_en text,
  name_ar text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists menu_groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories (id) on delete cascade,
  -- Alt başlık (ör. "TOST"). Boşsa ürünler doğrudan kategori altında listelenir.
  title_tr text,
  title_en text,
  title_ar text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references menu_groups (id) on delete cascade,
  name_tr text not null,
  name_en text,
  name_ar text,
  note_tr text,
  note_en text,
  note_ar text,
  -- TL cinsinden. null ise menüde fiyat gösterilmez.
  price numeric(10, 2),
  image_path text,
  image_url text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_groups_category_idx on menu_groups (category_id, sort_order);
create index if not exists menu_items_group_idx on menu_items (group_id, sort_order);

create table if not exists settings (
  key text primary key,
  value text not null
);

alter table categories enable row level security;
alter table menu_groups enable row level security;
alter table menu_items enable row level security;
alter table settings enable row level security;

drop policy if exists "public read" on categories;
drop policy if exists "public read" on menu_groups;
drop policy if exists "public read" on menu_items;
drop policy if exists "public read" on settings;
create policy "public read" on categories for select using (true);
create policy "public read" on menu_groups for select using (true);
create policy "public read" on menu_items for select using (true);
create policy "public read" on settings for select using (true);
