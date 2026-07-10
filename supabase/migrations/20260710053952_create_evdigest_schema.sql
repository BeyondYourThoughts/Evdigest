/*
# EVDigest — Core Content Schema

## Overview
Creates the foundational tables for EVDigest, India's EV magazine. This is a
single-tenant content site (no sign-in) so all policies use TO anon, authenticated.

## New Tables

1. **brands** — EV manufacturers sold in India
2. **vehicles** — Individual EV models
3. **articles** — Editorial content (news, features, long reads, interviews)
4. **reviews** — Vehicle reviews
5. **events** — EV events in India
6. **owner_stories** — Community UGC owner stories
7. **glossary_terms** — EV glossary A-Z
8. **ev_sales_data** — Monthly India EV sales by category (Vahan source)

## Security
- RLS enabled on ALL tables.
- All policies use TO anon, authenticated (public content site, no sign-in).
- Full CRUD for anon+authenticated on all tables (content is intentionally public).
*/

-- ============================================================================
-- BRANDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  segment text NOT NULL DEFAULT '2W',
  tagline text,
  founded_year int,
  hq_city text,
  vehicle_count int DEFAULT 0,
  description text,
  logo_url text,
  cover_url text,
  charging_network_info text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_brands" ON brands;
CREATE POLICY "anon_select_brands" ON brands FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_brands" ON brands;
CREATE POLICY "anon_insert_brands" ON brands FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_brands" ON brands;
CREATE POLICY "anon_update_brands" ON brands FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_brands" ON brands;
CREATE POLICY "anon_delete_brands" ON brands FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- VEHICLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  segment text NOT NULL DEFAULT '2W',
  price_inr bigint,
  range_km int,
  battery_kwh numeric,
  charge_time_hrs text,
  top_speed_kmph int,
  seating int,
  image_url text,
  rating numeric DEFAULT 0,
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  review_excerpt text,
  body_type text,
  launch_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_vehicles" ON vehicles;
CREATE POLICY "anon_select_vehicles" ON vehicles FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_vehicles" ON vehicles;
CREATE POLICY "anon_insert_vehicles" ON vehicles FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_vehicles" ON vehicles;
CREATE POLICY "anon_update_vehicles" ON vehicles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_vehicles" ON vehicles;
CREATE POLICY "anon_delete_vehicles" ON vehicles FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- ARTICLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'news',
  section text NOT NULL DEFAULT 'consumers',
  excerpt text,
  body text,
  image_url text,
  author text,
  author_role text,
  read_time_min int DEFAULT 5,
  published_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_breaking boolean DEFAULT false,
  view_count int DEFAULT 0,
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_articles" ON articles;
CREATE POLICY "anon_select_articles" ON articles FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_articles" ON articles;
CREATE POLICY "anon_insert_articles" ON articles FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_articles" ON articles;
CREATE POLICY "anon_update_articles" ON articles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_articles" ON articles;
CREATE POLICY "anon_delete_articles" ON articles FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  review_type text NOT NULL DEFAULT 'expert',
  rating numeric DEFAULT 0,
  excerpt text,
  body text,
  author text,
  author_role text,
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  rating_breakdown jsonb,
  image_url text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_reviews" ON reviews;
CREATE POLICY "anon_update_reviews" ON reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_reviews" ON reviews;
CREATE POLICY "anon_delete_reviews" ON reviews FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'expo',
  start_date date NOT NULL,
  end_date date,
  city text,
  venue text,
  description text,
  image_url text,
  registration_url text,
  is_featured boolean DEFAULT false,
  is_past boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- OWNER_STORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS owner_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  vehicle text NOT NULL,
  brand text,
  city text,
  use_case text DEFAULT 'daily',
  headline text,
  story_text text,
  photo_url text,
  submitted_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE owner_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_owner_stories" ON owner_stories;
CREATE POLICY "anon_select_owner_stories" ON owner_stories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_owner_stories" ON owner_stories;
CREATE POLICY "anon_insert_owner_stories" ON owner_stories FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_owner_stories" ON owner_stories;
CREATE POLICY "anon_update_owner_stories" ON owner_stories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_owner_stories" ON owner_stories;
CREATE POLICY "anon_delete_owner_stories" ON owner_stories FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- GLOSSARY_TERMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  definition text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_glossary" ON glossary_terms;
CREATE POLICY "anon_select_glossary" ON glossary_terms FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_glossary" ON glossary_terms;
CREATE POLICY "anon_insert_glossary" ON glossary_terms FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_glossary" ON glossary_terms;
CREATE POLICY "anon_update_glossary" ON glossary_terms FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_glossary" ON glossary_terms;
CREATE POLICY "anon_delete_glossary" ON glossary_terms FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- EV_SALES_DATA
-- ============================================================================
CREATE TABLE IF NOT EXISTS ev_sales_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  year int NOT NULL,
  segment text NOT NULL,
  units_sold int NOT NULL,
  source text DEFAULT 'Vahan',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ev_sales_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sales" ON ev_sales_data;
CREATE POLICY "anon_select_sales" ON ev_sales_data FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sales" ON ev_sales_data;
CREATE POLICY "anon_insert_sales" ON ev_sales_data FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sales" ON ev_sales_data;
CREATE POLICY "anon_update_sales" ON ev_sales_data FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sales" ON ev_sales_data;
CREATE POLICY "anon_delete_sales" ON ev_sales_data FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_segment ON vehicles(segment);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_section ON articles(section);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle ON reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reviews_type ON reviews(review_type);
CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_brands_segment ON brands(segment);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_slug ON reviews(slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
