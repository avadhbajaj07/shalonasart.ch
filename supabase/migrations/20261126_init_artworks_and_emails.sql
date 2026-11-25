-- Migration: 20261126_init_artworks_and_emails.sql
-- Description: Create artworks, artwork_images, emails tables, storage bucket, RLS, and triggers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create function for updated_at timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Artworks Table
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  philosophy TEXT,
  year TEXT,
  medium TEXT,
  dimensions TEXT,
  price NUMERIC(10, 2),
  currency TEXT DEFAULT 'CHF',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'not_for_sale', 'in_progress', 'Available', 'Sold', 'Not For Sale', 'In Progress')),
  category TEXT DEFAULT 'Abstract',
  image_path TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  accession TEXT,
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(6, 4),
  verification_status TEXT DEFAULT 'verified',
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at on artworks
DROP TRIGGER IF EXISTS trigger_set_artworks_updated_at ON public.artworks;
CREATE TRIGGER trigger_set_artworks_updated_at
BEFORE UPDATE ON public.artworks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Artwork Additional Images Table
CREATE TABLE IF NOT EXISTS public.artwork_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Emails Table (Studio Inbound & Outbound)
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'sent', 'failed')),
  thread_id TEXT,
  provider_message_id TEXT,
  received_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Artworks RLS Policies
DROP POLICY IF EXISTS "Public can view published artworks" ON public.artworks;
CREATE POLICY "Public can view published artworks"
  ON public.artworks
  FOR SELECT
  TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins have full access to artworks" ON public.artworks;
CREATE POLICY "Admins have full access to artworks"
  ON public.artworks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Artwork Images RLS Policies
DROP POLICY IF EXISTS "Public can view published artwork images" ON public.artwork_images;
CREATE POLICY "Public can view published artwork images"
  ON public.artwork_images
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.artworks
      WHERE public.artworks.id = public.artwork_images.artwork_id
        AND public.artworks.is_published = true
    )
  );

DROP POLICY IF EXISTS "Admins have full access to artwork_images" ON public.artwork_images;
CREATE POLICY "Admins have full access to artwork_images"
  ON public.artwork_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Emails RLS Policies (Never readable by anonymous public)
DROP POLICY IF EXISTS "Admins have full access to emails" ON public.emails;
CREATE POLICY "Admins have full access to emails"
  ON public.emails
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Storage Bucket for Artworks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artworks',
  'artworks',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

-- Storage Objects RLS Policies for "artworks" bucket
DROP POLICY IF EXISTS "Public can view artwork images in storage" ON storage.objects;
CREATE POLICY "Public can view artwork images in storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Admins can upload artwork images" ON storage.objects;
CREATE POLICY "Admins can upload artwork images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Admins can update artwork images" ON storage.objects;
CREATE POLICY "Admins can update artwork images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Admins can delete artwork images" ON storage.objects;
CREATE POLICY "Admins can delete artwork images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'artworks');

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON public.artworks (slug);
CREATE INDEX IF NOT EXISTS idx_artworks_sort_order ON public.artworks (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_artworks_is_published ON public.artworks (is_published);
CREATE INDEX IF NOT EXISTS idx_emails_direction ON public.emails (direction);
CREATE INDEX IF NOT EXISTS idx_emails_status ON public.emails (status);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON public.emails (created_at DESC);
