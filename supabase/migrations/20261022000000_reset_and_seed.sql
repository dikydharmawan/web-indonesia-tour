-- =============================================================================
-- Reset & Migration: Indonesia Virtual Tour
-- =============================================================================

-- 1. Hapus data lama agar bersih
truncate table public.route_items cascade;
truncate table public.routes cascade;
truncate table public.destinations cascade;

-- 2. Insert data baru
insert into public.destinations
  (title, slug, description, category, city, cover_image, panorama_url, lat, lng, ticket_info, opening_hours, facilities)
values
  ('Fly Bali', 'fly-bali',
   'Keliling Bali dengan helikopter',
   'Real', 'Bali',
   '/demo/covers/bali.jpg', '/demo/panoramas/bali.jpg',
   -8.3405, 115.0920,
   '{"adult": 1000000, "notes": "Harga per orang."}'::jsonb,
   '{"open": "09:00", "close": "17:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Helikopter', 'Pemandu']),
  ('Nuanu Creative City', 'nuanu-creative-city',
   'Magic Garden, Kec. Kediri, Kab. Tabanan, Bali',
   'Real', 'Tabanan',
   '/demo/covers/nuanu.jpg', '/demo/panoramas/nuanu.jpg',
   -8.6250, 115.1100,
   '{"adult": 50000, "notes": "Harga tiket masuk Magic Garden."}'::jsonb,
   '{"open": "10:00", "close": "20:00", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Parkir', 'Toilet', 'Taman']),
  ('CandyLand', 'candyland',
   'Dunia permen',
   'Fantasy', 'Wisata',
   '/demo/covers/candyland.jpg', '/demo/panoramas/candyland.jpg',
   0.0, 0.0,
   '{"adult": 0, "notes": "Gratis untuk semua."}'::jsonb,
   '{"open": "00:00", "close": "23:59", "days": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}'::jsonb,
   array['Permen', 'Keajaiban']);

insert into public.routes (title, slug, summary, duration_days, cover_image, status)
values
  ('Eksplorasi Bali & Fantasi', 'eksplorasi-bali-fantasi',
   'Keliling Bali dengan helikopter, menikmati Magic Garden, dan bermain di dunia permen.',
   1, '/demo/covers/bali.jpg', 'published');

insert into public.route_items (route_id, destination_id, order_index, time_schedule, notes)
select r.id, d.id, v.order_index, v.time_schedule, v.notes
from (values
  ('eksplorasi-bali-fantasi', 'fly-bali', 0, '09:00', 'Keliling Bali dengan helikopter'),
  ('eksplorasi-bali-fantasi', 'nuanu-creative-city', 1, '13:00', 'Magic Garden di Tabanan'),
  ('eksplorasi-bali-fantasi', 'candyland', 2, '16:00', 'Bermain di dunia permen')
) as v(route_slug, dest_slug, order_index, time_schedule, notes)
join public.destinations d on d.slug = v.dest_slug
join public.routes r       on r.slug = v.route_slug;
