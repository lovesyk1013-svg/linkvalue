-- ============================================
-- LinkValue Supabase Schema
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ============================================

-- 1. profiles 테이블
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- 2. products 테이블
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null default '',
  category text not null default '기타',
  type text not null check (type in ('group_buy', 'investment')),
  status text not null default 'active' check (status in ('active', 'closed', 'upcoming')),
  price bigint not null default 0,
  original_price bigint,
  target_amount bigint,
  current_amount bigint not null default 0,
  participant_count integer not null default 0,
  deadline timestamptz,
  image_url text,
  interest_rate numeric(5,2),
  duration_months integer,
  account_bank text,
  account_number text,
  account_holder text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 3. orders 테이블
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  amount bigint not null,
  quantity integer,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  memo text,
  created_at timestamptz default now()
);

-- ============================================
-- RLS (Row Level Security) 설정
-- ============================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- profiles: 자신의 프로필만 보기/수정, admin은 전체
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- products: 모든 인증 사용자 조회, admin만 작성
create policy "Anyone can view products" on public.products for select to authenticated using (true);
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- orders: 자신의 주문만 보기/생성, admin은 전체
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- 자동 프로필 생성 트리거
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 샘플 데이터 (선택 사항)
-- 관리자 계정 생성 후 아래 SQL 수동 실행:
-- UPDATE profiles SET role = 'admin' WHERE email = '관리자이메일@example.com';
-- ============================================
