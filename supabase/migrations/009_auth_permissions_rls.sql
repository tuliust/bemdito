-- Sprint 9 foundation
-- Apply after validating the roles used in auth.users app_metadata/user_metadata.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null check (role in ('viewer', 'editor', 'admin', 'company', 'professional')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
on public.user_profiles
for select
using (auth.uid() = id);

create policy "Admins can manage profiles"
on public.user_profiles
for all
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.section_items enable row level security;
alter table public.section_breakpoint_overrides enable row level security;
alter table public.global_blocks enable row level security;
alter table public.media_assets enable row level security;
alter table public.design_tokens enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.awards enable row level security;
alter table public.faq_groups enable row level security;
alter table public.faq_items enable row level security;

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role',
    'anonymous'
  )
$$;

create policy "Public read published pages"
on public.pages
for select
using (status = 'published' or public.current_app_role() in ('viewer', 'editor', 'admin'));

create policy "Admin/editor manage pages"
on public.pages
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage page sections"
on public.page_sections
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage section items"
on public.section_items
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage section overrides"
on public.section_breakpoint_overrides
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage global blocks"
on public.global_blocks
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage assets and design system"
on public.media_assets
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin manage design tokens"
on public.design_tokens
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "Admin/editor manage blog"
on public.blog_posts
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage testimonials"
on public.testimonials
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage awards"
on public.awards
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage faq groups"
on public.faq_groups
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));

create policy "Admin/editor manage faq items"
on public.faq_items
for all
using (public.current_app_role() in ('editor', 'admin'))
with check (public.current_app_role() in ('editor', 'admin'));
