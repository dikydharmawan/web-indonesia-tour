-- =============================================================================
-- Virtual Tour & Rute Wisata Dinamis — Migration 002
-- Tabel site_settings untuk pengaturan tampilan (warna tema).
--
-- Cara pakai:
--   1. Supabase Dashboard → SQL Editor → New query → paste file ini → Run, atau
--   2. Supabase CLI: supabase db push
--
-- Catatan:
--   * Idempotent — aman dijalankan lebih dari satu kali.
--   * Publik boleh membaca pengaturan (agar tema tampil di situs publik),
--     hanya role `authenticated` yang boleh menulis.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABEL: site_settings
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key check (btrim(key) <> ''),
  value       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table  public.site_settings        is 'Pengaturan global situs (mis. tema warna)';
comment on column public.site_settings.value  is 'Contoh tema: {"brand":"#0d9488","accent":"#f59e0b","ink":"#0b1220"}';

-- -----------------------------------------------------------------------------
-- 2. Trigger updated_at (fungsi sudah dibuat di migration 001)
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

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_insert_auth" on public.site_settings;
create policy "site_settings_insert_auth"
  on public.site_settings for insert
  to authenticated
  with check (true);

drop policy if exists "site_settings_update_auth" on public.site_settings;
create policy "site_settings_update_auth"
  on public.site_settings for update
  to authenticated
  using (true) with check (true);

drop policy if exists "site_settings_delete_auth" on public.site_settings;
create policy "site_settings_delete_auth"
  on public.site_settings for delete
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- 4. Seed tema bawaan
-- -----------------------------------------------------------------------------
insert into public.site_settings (key, value)
values (
  'theme',
  '{"brand":"#0d9488","accent":"#f59e0b","ink":"#0b1220"}'::jsonb
)
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- 5. Batas ukuran berkas pada bucket Storage
--    cover 5 MB, panorama 360 20 MB (ditegakkan oleh Supabase Storage).
-- -----------------------------------------------------------------------------
update storage.buckets
  set file_size_limit = 5242880
  where id = 'covers';

update storage.buckets
  set file_size_limit = 20971520
  where id = 'panoramas';
