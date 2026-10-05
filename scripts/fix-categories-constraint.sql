-- ==============================================================================
-- COMPLETE SUPABASE SCHEMA SCRIPT (SAFE TO RUN ON NEW OR EXISTING DATABASES)
-- ==============================================================================

-- 1. Create Projects Table (WITHOUT the restrictive category check constraint)
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null, -- Allows custom and dynamically added categories
  discipline text not null,
  location text not null,
  scale text not null,
  scope text not null,
  description text,
  image_url text not null,
  gallery_urls text[] default array[]::text[],
  featured boolean default false,
  is_published boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Drop the restrictive constraint if the table already existed with it
alter table public.projects drop constraint if exists projects_category_check;

-- 3. Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- 4. Clean up any existing policies before re-creating to prevent conflicts
drop policy if exists "Public can view published projects" on public.projects;
drop policy if exists "Admin can read all projects" on public.projects;
drop policy if exists "Admin can insert projects" on public.projects;
drop policy if exists "Admin can update projects" on public.projects;
drop policy if exists "Admin can delete projects" on public.projects;

-- 5. RLS Policies: Anyone can view published projects
create policy "Public can view published projects"
  on public.projects for select
  using (is_published = true);

-- 6. RLS Policies: Authenticated admin can read/insert/update/delete everything
create policy "Admin can read all projects"
  on public.projects for select
  to authenticated
  using (true);

create policy "Admin can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Admin can update projects"
  on public.projects for update
  to authenticated
  using (true);

create policy "Admin can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- 7. (Bonus) Dynamic Categories Table for studio portfolio management
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  label text not null,
  display_order bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

drop policy if exists "Public can view categories" on public.categories;
drop policy if exists "Admin can manage categories" on public.categories;

create policy "Public can view categories"
  on public.categories for select
  using (true);

create policy "Admin can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- Seed default categories if not already present
insert into public.categories (name, label, display_order)
values 
  ('Architecture', 'Architecture & Villas', 1),
  ('Interior', 'Interior Architecture', 2),
  ('Turnkey', 'Turnkey Execution', 3)
on conflict (name) do nothing;
