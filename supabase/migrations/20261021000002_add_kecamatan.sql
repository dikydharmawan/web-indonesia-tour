alter table public.destinations
add column if not exists kecamatan text;

comment on column public.destinations.kecamatan is 'Kecamatan lokasi destinasi';
