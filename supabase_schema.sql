-- SUPABASE DATABASE SCHEMA FOR KINDLEAF
-- Execute this SQL in your Supabase Project's SQL Editor to set up the production tables.

-- Disable RLS warning for initial setup (or toggle active policies below)
SET check_function_bodies = false;

---------------------------------------------------------
-- 1. ADMINS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policies for Admins
CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin insert" ON public.admins FOR INSERT TO authenticated WITH CHECK (true);

---------------------------------------------------------
-- 2. PRODUCTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price NUMERIC NOT NULL DEFAULT 249,
    sale_price NUMERIC,
    stock INTEGER DEFAULT 100 NOT NULL,
    sku TEXT UNIQUE,
    weight TEXT NOT NULL DEFAULT '50g',
    category TEXT NOT NULL DEFAULT 'Single Pack',
    variant TEXT DEFAULT 'Single Pack',
    benefits JSONB DEFAULT '[]'::jsonb,
    ingredients JSONB DEFAULT '[]'::jsonb,
    taste_profile TEXT,
    aroma TEXT,
    brewing_summary TEXT,
    brewing_instructions JSONB DEFAULT '[]'::jsonb,
    fssai_info TEXT DEFAULT 'FSSAI Licensed Food Business',
    amazon_url TEXT,
    amazon_button_enabled BOOLEAN DEFAULT false NOT NULL,
    img TEXT NOT NULL DEFAULT '/assets/product_natural.png',
    images TEXT[] DEFAULT '{}'::text[],
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    featured BOOLEAN DEFAULT false NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Incremental column migrations if table already exists in Supabase
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS taste_profile TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS aroma TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brewing_summary TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fssai_info TEXT DEFAULT 'FSSAI Licensed Food Business';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS amazon_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS amazon_button_enabled BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variant TEXT DEFAULT 'Single Pack';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Indexes for high performance queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON public.products(display_order);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view active published products
CREATE POLICY "Allow public read active products" ON public.products FOR SELECT 
    USING (status = 'published');

-- Admins have full access
CREATE POLICY "Admins full access products" ON public.products FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 3. ORDERS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    product_title TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can create orders (checkout)
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT 
    WITH CHECK (true);

-- Admins can manage all orders
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 4. CUSTOMERS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    order_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Public insert when they buy
CREATE POLICY "Allow public insert customers" ON public.customers FOR INSERT 
    WITH CHECK (true);

-- Admins full access
CREATE POLICY "Admins full access customers" ON public.customers FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 5. REVIEWS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    approved BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public view approved reviews
CREATE POLICY "Allow public read approved reviews" ON public.reviews FOR SELECT 
    USING (approved = true);

-- Public can insert new review for admin review
CREATE POLICY "Allow public submit reviews" ON public.reviews FOR INSERT 
    WITH CHECK (true);

-- Admins full access
CREATE POLICY "Admins full access reviews" ON public.reviews FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 6. HOMEPAGE CONTENT TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL, -- e.g. 'hero', 'about', 'brewing', 'why_kindleaf'
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read homepage_content" ON public.homepage_content FOR SELECT 
    USING (true);

-- Admin write
CREATE POLICY "Admins full access homepage_content" ON public.homepage_content FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 7. SETTINGS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read settings" ON public.settings FOR SELECT 
    USING (true);

-- Admin write
CREATE POLICY "Admins full access settings" ON public.settings FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 8. MEDIA LIBRARY TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Public view media links
CREATE POLICY "Allow public read media" ON public.media FOR SELECT 
    USING (true);

-- Admin write
CREATE POLICY "Admins full access media" ON public.media FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 9. JOURNAL ARTICLES TABLE (BLOGS)
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journal_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    cover_image TEXT,
    category TEXT NOT NULL DEFAULT 'Tea',
    read_time TEXT DEFAULT '4 min read',
    author TEXT DEFAULT 'Kindleaf Herbalist',
    date TEXT DEFAULT 'August 2026',
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft'
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published articles" ON public.journal_articles FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Admins full access journal_articles" ON public.journal_articles FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 10. INGREDIENTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    botanical TEXT NOT NULL,
    role TEXT,
    flavor_aroma TEXT,
    details TEXT,
    icon TEXT,
    notes JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published ingredients" ON public.ingredients FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Admins full access ingredients" ON public.ingredients FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 11. FAQS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published faqs" ON public.faqs FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Admins full access faqs" ON public.faqs FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 12. OFFERS & PROMOTIONS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    cta_text TEXT DEFAULT 'GET THE KINDLEAF APP',
    cta_link TEXT DEFAULT '#get-the-app',
    start_date TEXT,
    end_date TEXT,
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active offers" ON public.offers FOR SELECT 
    USING (active = true AND status = 'published');

CREATE POLICY "Admins full access offers" ON public.offers FOR ALL 
    TO authenticated USING (true) WITH CHECK (true);

---------------------------------------------------------
-- 13. SUPABASE STORAGE BUCKET CONFIGURATION (FOR MEDIA)
---------------------------------------------------------
-- Insert media storage bucket if missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public reads from media bucket
CREATE POLICY "Public media access" ON storage.objects FOR SELECT 
    USING (bucket_id = 'media');

-- Policy to allow authenticated admin uploads to media bucket
CREATE POLICY "Admin media upload" ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'media');

