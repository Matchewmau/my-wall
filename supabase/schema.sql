-- My Wall: posts table, RLS, realtime, and the public wall-photos bucket.
create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  body text null,
  created_at timestamptz not null default now(),
  photo_url text null,
  constraint posts_body_length check (body is null or char_length(body) <= 280),
  constraint posts_content_present check (body is not null or photo_url is not null)
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.posts to anon, authenticated;

drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert posts" on public.posts;
create policy "Public can insert posts"
  on public.posts for insert
  to anon, authenticated
  with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('wall-photos', 'wall-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view wall photos" on storage.objects;
create policy "Public can view wall photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'wall-photos');

drop policy if exists "Public can upload wall photos" on storage.objects;
create policy "Public can upload wall photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'wall-photos');
