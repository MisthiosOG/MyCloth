create table if not exists public.products (
  id text primary key,
  name text not null check (char_length(name) between 1 and 120),
  type text not null check (type in ('Atasan', 'Bawahan', 'Outer')),
  price text not null check (char_length(price) between 1 and 40),
  stock integer not null check (stock >= 0),
  description text not null check (char_length(description) between 1 and 2000),
  image text not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert to authenticated with check (true);

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can upload payment proofs" on storage.objects;
create policy "Anyone can upload payment proofs"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');

drop policy if exists "Anyone can view payment proofs" on storage.objects;
create policy "Anyone can view payment proofs"
  on storage.objects for select using (bucket_id = 'payment-proofs');
