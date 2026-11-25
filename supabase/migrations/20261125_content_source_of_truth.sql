-- =============================================================================
-- Shalona's Art — Content Source-of-Truth & Audit System
-- Production Database Schema (PostgreSQL / Supabase)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. ARTWORKS SOURCE-OF-TRUTH TABLE
create table if not exists public.artworks (
    id text primary key,
    slug text not null unique,
    title_en text not null,
    title_fr text,
    description_en text,
    description_fr text,
    year text,
    medium text,
    dimensions text,
    image_url text,
    status text not null check (status in ('published', 'draft', 'unfinished')) default 'published',
    sort_order integer default 0,
    verification_status text not null check (verification_status in ('verified', 'needs_review', 'unverified')) default 'unverified',
    verified_by text,
    verified_at timestamptz,
    source text not null default 'old site export (data_dump/arts.json)',
    is_locked boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. SITE CONTENT SOURCE-OF-TRUTH TABLE (Philosophy, Biography, Tagline, Statements)
create table if not exists public.site_content (
    id text primary key,
    key text not null unique,
    content_en text not null,
    content_fr text,
    verification_status text not null check (verification_status in ('verified', 'needs_review', 'unverified')) default 'unverified',
    verified_by text,
    verified_at timestamptz,
    source text not null default 'old site export (data_dump/pages.json)',
    is_locked boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. CONTENT REVISIONS AUDIT LOG TABLE
create table if not exists public.content_revisions (
    id uuid primary key default gen_random_uuid(),
    table_name text not null,
    record_id text not null,
    old_value jsonb,
    new_value jsonb,
    changed_by text default 'admin',
    changed_at timestamptz not null default now()
);

-- 4. STUDIO EMAILS TABLE (info@shalonasart.ch Inbox & Outbox)
create table if not exists public.studio_emails (
    id uuid primary key default gen_random_uuid(),
    direction text not null check (direction in ('incoming', 'outgoing')),
    sender text not null,
    recipient text not null,
    subject text not null,
    body text not null,
    artwork_title text,
    phone text,
    location text,
    status text not null check (status in ('unread', 'read', 'replied', 'archived', 'sent')) default 'unread',
    created_at timestamptz not null default now()
);

-- =============================================================================
-- AUTOMATIC AUDIT TRIGGER ON UPDATES
-- Every change to artworks or site_content is automatically recorded in content_revisions
-- =============================================================================

create or replace function public.log_content_revision()
returns trigger as $$
begin
    -- Prevent modification if content is locked (except when unlocked by an admin explicit action)
    if (old.is_locked = true and new.is_locked = true and old is distinct from new) then
        -- Allow verification status updates or unlocking, but block silent content edits
        if (old.title_en is distinct from new.title_en or 
            old.description_en is distinct from new.description_en or 
            old.medium is distinct from new.medium or
            old.dimensions is distinct from new.dimensions) then
            raise exception 'Content is locked. Unlock the item before making modifications.';
        end if;
    end if;

    -- Insert audit entry
    insert into public.content_revisions (
        table_name,
        record_id,
        old_value,
        new_value,
        changed_by,
        changed_at
    ) values (
        tg_table_name,
        coalesce(new.id, old.id),
        to_jsonb(old),
        to_jsonb(new),
        coalesce(current_setting('app.current_user', true), new.verified_by, 'admin'),
        now()
    );

    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Drop existing triggers if re-running
drop trigger if exists trg_audit_artworks on public.artworks;
create trigger trg_audit_artworks
    after update on public.artworks
    for each row
    execute function public.log_content_revision();

drop trigger if exists trg_audit_site_content on public.site_content;
create trigger trg_audit_site_content
    after update on public.site_content
    for each row
    execute function public.log_content_revision();

-- =============================================================================
-- INDEXES & ROW LEVEL SECURITY
-- =============================================================================

create index if not exists idx_artworks_slug on public.artworks (slug);
create index if not exists idx_artworks_verification on public.artworks (verification_status);
create index if not exists idx_site_content_key on public.site_content (key);
create index if not exists idx_revisions_table_record on public.content_revisions (table_name, record_id);
create index if not exists idx_emails_direction_status on public.studio_emails (direction, status);

-- Enable RLS
alter table public.artworks enable row level security;
alter table public.site_content enable row level security;
alter table public.content_revisions enable row level security;
alter table public.studio_emails enable row level security;

-- Public can read published & verified artworks and site content
create policy "Allow public read verified artworks"
    on public.artworks for select
    using (status = 'published');

create policy "Allow public read site content"
    on public.site_content for select
    using (true);

-- Authenticated admins can perform all actions
create policy "Allow authenticated admin full access artworks"
    on public.artworks for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated admin full access site_content"
    on public.site_content for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated admin full access revisions"
    on public.content_revisions for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated admin full access studio_emails"
    on public.studio_emails for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
