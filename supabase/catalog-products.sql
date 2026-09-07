-- Product schema for Foodstuff and Fresh Food catalogs.
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null,
  section text not null check (section in ('foodstuff', 'fresh-food')),
  unit text not null,
  price numeric(12, 2) not null default 0,
  image text not null default '',
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock', 'limited', 'unavailable')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can read available catalog products"
on public.products for select
using (stock_status <> 'unavailable');

alter table public.orders
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists delivery_address text,
  add column if not exists delivery_area text,
  add column if not exists subtotal numeric(12, 2),
  add column if not exists status text default 'new';

alter table public.order_items
  add column if not exists product_id text,
  add column if not exists product_name text,
  add column if not exists unit_price numeric(12, 2),
  add column if not exists quantity integer;
