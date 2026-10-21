-- =============================================================================
-- Virtual Tour & Rute Wisata Dinamis — Migration 001
-- Skema awal: destinations, routes, route_items + RLS + Storage + seed demo
--
-- Cara pakai:
--   1. Supabase Dashboard → SQL Editor → New query → paste file ini → Run, atau
--   2. Supabase CLI: supabase db push
--
-- Catatan:
--   * Idempotent — aman dijalankan lebih dari satu kali.
--   * RLS "sederhana": publik boleh membaca, role `authenticated` (admin login
--     via Supabase Auth) boleh CRUD. Untuk mengunci lebih ketat, ganti policy
--     tulis dengan cek email admin (lihat komentar pada bagian RLS).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Extensions
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. TABEL: destinations
-- -----------------------------------------------------------------------------
create table if not exists public.destinations (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (btrim(title) <> ''),
  slug           text not null unique check (btrim(slug) <> ''),
  description    text,
  category       text,
  city           text,
  cover_image    text,
  panorama_url   text,
  lat            double precision check (lat between -90 and 90),
  lng            double precision check (lng between -180 and 180),
  ticket_info    jsonb,
  opening_hours  jsonb,
  facilities     text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table  public.destinations                    is 'Destinasi wisata + foto panorama 360';
comment on column public.destinations.cover_image        is 'URL gambar cover (Supabase Storage: bucket covers)';
comment on column public.destinations.panorama_url       is 'URL foto panorama equirectangular 360 derajat (bucket panoramas)';
comment on column public.destinations.ticket_info        is 'Contoh: {"adult":50000,"child":25000,"notes":"Tiket masuk candi"}';
comment on column public.destinations.opening_hours      is 'Contoh: {"open":"08:00","close":"17:00","days":["Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]}';
comment on column public.destinations.facilities         is 'Fasilitas: {Musholla,Parkir,Toilet,Kantin}';

-- -----------------------------------------------------------------------------
-- 2. TABEL: routes (rute wisata)
-- -----------------------------------------------------------------------------
create table if not exists public.routes (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (btrim(title) <> ''),
  slug           text not null unique check (btrim(slug) <> ''),
  summary        text,
  duration_days  smallint not null default 1 check (duration_days between 1 and 60),
  cover_image    text,
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table  public.routes              is 'Rute wisata (urutan destinasi + jadwal)';
comment on column public.routes.status       is 'draft = hanya terlihat admin; published = tampil di publik';

-- -----------------------------------------------------------------------------
-- 3. TABEL: route_items (waypoint / urutan destinasi dalam satu rute)
-- -----------------------------------------------------------------------------
create table if not exists public.route_items (
  id              uuid primary key default gen_random_uuid(),
  route_id        uuid not null references public.routes(id) on delete cascade on update cascade,
  destination_id  uuid not null references public.destinations(id) on delete cascade on update cascade,
  order_index     integer not null default 0 check (order_index >= 0),
  time_schedule   text,
  notes           text,
  created_at      timestamptz not null default now()
);

comment on table  public.route_items                is 'Satu baris = satu waypoint dalam rute';
comment on column public.route_items.order_index    is 'Urutan kunjungan (0, 1, 2, ...). Tidak unique agar destinasi bisa dikunjungi lebih dari sekali dalam satu rute';
comment on column public.route_items.time_schedule  is 'Contoh: Hari 1 - 09:00';

-- -----------------------------------------------------------------------------
-- 4. Index
-- -----------------------------------------------------------------------------
create index if not exists destinations_category_idx       on public.destinations (category);
create index if not exists destinations_city_idx           on public.destinations (city);
create index if not exists destinations_created_at_idx     on public.destinations (created_at desc);
create index if not exists routes_status_idx               on public.routes (status);
create index if not exists routes_created_at_idx           on public.routes (created_at desc);
create index if not exists route_items_route_order_idx     on public.route_items (route_id, order_index);
create index if not exists route_items_destination_idx     on public.route_items (destination_id);

-- -----------------------------------------------------------------------------
-- 5. Trigger: updated_at otomatis
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists destinations_touch_updated_at on public.destinations;
create trigger destinations_touch_updated_at
  before update on public.destinations
  for each row execute function public.touch_updated_at();

drop trigger if exists routes_touch_updated_at on public.routes;
create trigger routes_touch_updated_at
  before update on public.routes
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- 6. View: daftar kategori & kota (untuk filter publik & dropdown admin)
-- -----------------------------------------------------------------------------
create or replace view public.categories as
select category, count(*)::integer as destination_count
from public.destinations
where category is not null and btrim(category) <> ''
group by category
order by category;

create or replace view public.cities as
select city, count(*)::integer as destination_count
from public.destinations
where city is not null and btrim(city) <> ''
group by city
order by city;

-- -----------------------------------------------------------------------------
-- 7. Row Level Security (sederhana)
-- -----------------------------------------------------------------------------
alter table public.destinations enable row level security;
alter table public.routes      enable row level security;
alter table public.route_items enable row level security;

-- destinasi: publik boleh baca, authenticated boleh CRUD
drop policy if exists "destinations_select_public" on public.destinations;
create policy "destinations_select_public"
  on public.destinations for select
  using (true);

drop policy if exists "destinations_insert_auth" on public.destinations;
create policy "destinations_insert_auth"
  on public.destinations for insert
  to authenticated
  with check (true);

drop policy if exists "destinations_update_auth" on public.destinations;
create policy "destinations_update_auth"
  on public.destinations for update
  to authenticated
  using (true) with check (true);

drop policy if exists "destinations_delete_auth" on public.destinations;
create policy "destinations_delete_auth"
  on public.destinations for delete
  to authenticated
  using (true);

-- routes: publik hanya melihat yang published; authenticated melihat semua + CRUD
drop policy if exists "routes_select_published" on public.routes;
create policy "routes_select_published"
  on public.routes for select
  using (status = 'published');

drop policy if exists "routes_select_auth" on public.routes;
create policy "routes_select_auth"
  on public.routes for select
  to authenticated
  using (true);

drop policy if exists "routes_insert_auth" on public.routes;
create policy "routes_insert_auth"
  on public.routes for insert
  to authenticated
  with check (true);

drop policy if exists "routes_update_auth" on public.routes;
create policy "routes_update_auth"
  on public.routes for update
  to authenticated
  using (true) with check (true);

drop policy if exists "routes_delete_auth" on public.routes;
create policy "routes_delete_auth"
  on public.routes for delete
  to authenticated
  using (true);

-- route_items: publik hanya melihat item milik rute published; authenticated semua + CRUD
drop policy if exists "route_items_select_published" on public.route_items;
create policy "route_items_select_published"
  on public.route_items for select
  using (exists (
    select 1 from public.routes r
    where r.id = route_items.route_id
      and r.status = 'published'
  ));

drop policy if exists "route_items_select_auth" on public.route_items;
create policy "route_items_select_auth"
  on public.route_items for select
  to authenticated
  using (true);

drop policy if exists "route_items_insert_auth" on public.route_items;
create policy "route_items_insert_auth"
  on public.route_items for insert
  to authenticated
  with check (true);

drop policy if exists "route_items_update_auth" on public.route_items;
create policy "route_items_update_auth"
  on public.route_items for update
  to authenticated
  using (true) with check (true);

drop policy if exists "route_items_delete_auth" on public.route_items;
create policy "route_items_delete_auth"
  on public.route_items for delete
  to authenticated
  using (true);

-- Opsional — mengunci akses tulis hanya ke akun admin tertentu:
--   create or replace function public.is_admin() returns boolean
--   language sql stable as $$
--     select coalesce(auth.jwt() ->> 'email', '') in ('admin@contoh.com')
--   $$;
--   lalu tambahkan: to authenticated using (public.is_admin()) with check (public.is_admin())
--   pada setiap policy INSERT/UPDATE/DELETE di atas.

-- -----------------------------------------------------------------------------
-- 8. Storage: bucket publik untuk cover & panorama 360
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true),
       ('panoramas', 'panoramas', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id in ('covers', 'panoramas'));

drop policy if exists "media_insert_auth" on storage.objects;
create policy "media_insert_auth"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('covers', 'panoramas'));

drop policy if exists "media_update_auth" on storage.objects;
create policy "media_update_auth"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('covers', 'panoramas'))
  with check (bucket_id in ('covers', 'panoramas'));

drop policy if exists "media_delete_auth" on storage.objects;
create policy "media_delete_auth"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('covers', 'panoramas'));

-- -----------------------------------------------------------------------------
-- 9. Seed data demo (opsional — hapus bagian ini untuk produksi)
-- -----------------------------------------------------------------------------
insert into public.destinations
  (title, slug, description, category, city, cover_image, panorama_url, lat, lng, ticket_info, opening_hours, facilities)
values
  ('Kawah Ijen', 'kawah-ijen',
   'Kawah Ijen adalah danau kawah asam terbesar di dunia yang terletak di perbatasan Kabupaten Banyuwangi dan Kabupaten Bondowoso. Fenomena api biru (blue fire) yang muncul di malam hari adalah daya tarik utama yang mendunia. Selain itu, pengunjung dapat menyaksikan penambang belerang yang bekerja keras di tengah asap belerang yang tajam.',
   'Alam', 'Banyuwangi',
   '/demo/covers/ijen.jpg', '/demo/panoramas/ijen.jpg',
   -8.0583, 114.2411,
   '{"adult": 10000, "child": 5000, "notes": "Harga tiket untuk wisatawan domestik."}'::jsonb,
   '{"open": "02:00", "close": "12:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Parkir', 'Toilet', 'Warung', 'Pemandu']),
  ('Pantai Pulau Merah', 'pantai-pulau-merah',
   'Pantai Pulau Merah atau Red Island Beach terkenal dengan bukit kecil bertanah merah di tengah pantai yang bisa dicapai saat air surut. Pantai ini populer bagi peselancar pemula karena ombaknya yang cukup ramah.',
   'Alam', 'Banyuwangi',
   '/demo/covers/pulau-merah.jpg', '/demo/panoramas/pulau-merah.jpg',
   -8.5833, 114.0333,
   '{"adult": 10000, "child": 5000, "notes": "Retribusi masuk kawasan."}'::jsonb,
   '{"open": "06:00", "close": "18:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Parkir', 'Toilet', 'Warung', 'Penyewaan Papan Selancar']),
  ('Taman Nasional Baluran', 'tn-baluran',
   'Taman Nasional Baluran sering disebut sebagai ''Afrika van Java'' karena padang savana yang luas dengan latar belakang Gunung Baluran. Anda bisa melihat kawanan rusa dan merak liar di sini.',
   'Alam', 'Banyuwangi',
   '/demo/covers/baluran.jpg', '/demo/panoramas/baluran.jpg',
   -7.8286, 114.3989,
   '{"adult": 15000, "child": 10000, "notes": "Tiket masuk kawasan konservasi."}'::jsonb,
   '{"open": "07:30", "close": "16:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Parkir', 'Toilet', 'Warung', 'Pemandu']),
  ('Taman Nasional Alas Purwo', 'tn-alas-purwo',
   'Alas Purwo adalah taman nasional dengan hutan hujan tropis, hutan bambu, dan pantai-pantai yang masih asri. Kawasan ini dikenal karena kekayaan flora, fauna, dan nilai spiritualnya yang tinggi.',
   'Alam', 'Banyuwangi',
   '/demo/covers/alas-purwo.jpg', '/demo/panoramas/alas-purwo.jpg',
   -8.6667, 114.3333,
   '{"adult": 5000, "child": 3000, "notes": "Tiket masuk hutan wisata."}'::jsonb,
   '{"open": "07:00", "close": "17:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Parkir', 'Toilet', 'Warung'])
on conflict (slug) do nothing;

insert into public.routes (title, slug, summary, duration_days, cover_image, status)
values
  ('Jelajah Banyuwangi 2 Hari', 'jelajah-banyuwangi-2-hari',
   'Perjalanan alam dua hari: menikmati savanna Baluran, keindahan Pulau Merah, serta petualangan Ijen.',
   2, '/demo/covers/ijen.jpg', 'published'),
  ('Eksplorasi Alam Banyuwangi', 'eksplorasi-alam-banyuwangi',
   'Rute lengkap menjelajahi kekayaan alam Banyuwangi mulai dari Baluran hingga Alas Purwo.',
   1, '/demo/covers/baluran.jpg', 'published')
on conflict (slug) do nothing;

insert into public.route_items (route_id, destination_id, order_index, time_schedule, notes)
select r.id, d.id, v.order_index, v.time_schedule, v.notes
from (values
  ('jelajah-banyuwangi-2-hari', 'kawah-ijen',         0, 'Hari 1 — 02:00', 'Wajib menggunakan masker gas untuk Ijen.'),
  ('jelajah-banyuwangi-2-hari', 'pantai-pulau-merah', 1, 'Hari 1 — 14:00', 'Menikmati matahari terbenam.'),
  ('jelajah-banyuwangi-2-hari', 'tn-baluran',         2, 'Hari 2 — 08:00', 'Melihat savana Afrika van Java.'),
  ('eksplorasi-alam-banyuwangi', 'tn-baluran',        0, '08:00', 'Mengunjungi savana di pagi hari.'),
  ('eksplorasi-alam-banyuwangi', 'tn-alas-purwo',     1, '13:00', 'Menjelajahi hutan dan pantai.')
) as v(route_slug, dest_slug, order_index, time_schedule, notes)
join public.destinations d on d.slug = v.dest_slug
join public.routes r       on r.slug = v.route_slug
where not exists (
  select 1 from public.route_items ri
  where ri.route_id = r.id and ri.order_index = v.order_index
);
