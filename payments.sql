-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists public.purchases (
  user_id uuid primary key references auth.users(id) on delete cascade,
  paid boolean not null default false,
  amount integer,
  currency text,
  coupon text,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
drop policy if exists "read own purchase" on public.purchases;
create policy "read own purchase" on public.purchases for select using (auth.uid() = user_id);
-- (no insert/update policy: only the server functions can write)

create table if not exists public.coupons (
  code text primary key,
  amount_minor integer not null,      -- price in pence after the coupon, e.g. 1200 = £12.00
  active boolean not null default true,
  uses integer not null default 0
);
alter table public.coupons enable row level security;  -- no policy: nobody can read from the browser

insert into public.coupons (code, amount_minor) values ('FRIEND12', 1200) on conflict do nothing;
