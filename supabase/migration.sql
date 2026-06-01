-- ═══════════════════════════════════════════════════════════════════════════
-- REZA REFKA PORTFOLIO CMS - SUPABASE MIGRATION
-- Timezone: Asia/Makassar (UTC+8)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLE: settings ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  website_name TEXT NOT NULL DEFAULT 'Reza Refka Kurniawan',
  tagline_id TEXT DEFAULT 'Full Stack Developer & Data Engineer',
  tagline_en TEXT DEFAULT 'Full Stack Developer & Data Engineer',
  hero_name TEXT DEFAULT 'Reza Refka Kurniawan',
  hero_headline_id TEXT DEFAULT 'Membangun solusi digital yang bermakna',
  hero_headline_en TEXT DEFAULT 'Building meaningful digital solutions',
  hero_motto_id TEXT DEFAULT 'Code. Create. Impact.',
  hero_motto_en TEXT DEFAULT 'Code. Create. Impact.',
  hero_description_id TEXT DEFAULT '',
  hero_description_en TEXT DEFAULT '',
  hero_cta_text_id TEXT DEFAULT 'Tentang Saya',
  hero_cta_text_en TEXT DEFAULT 'About Me',
  hero_cta_link TEXT DEFAULT '/about',
  logo TEXT,
  favicon TEXT,
  footer_text_id TEXT DEFAULT 'Dibuat dengan ❤️ di Makassar',
  footer_text_en TEXT DEFAULT 'Made with ❤️ in Makassar',
  avatar TEXT,
  social_github TEXT DEFAULT '',
  social_linkedin TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',
  social_twitter TEXT DEFAULT '',
  social_email TEXT DEFAULT '',
  calendar_link TEXT DEFAULT '',
  stats_projects INTEGER DEFAULT 0,
  stats_certificates INTEGER DEFAULT 0,
  stats_monthly_visitors INTEGER DEFAULT 0,
  stats_total_visitors INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id)
VALUES (uuid_generate_v4())
ON CONFLICT DO NOTHING;

-- ─── TABLE: projects ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Web App'
    CHECK (category IN ('Web App', 'Mobile App', 'Data Visualization', 'Creativity')),
  thumbnail TEXT,
  gallery TEXT[] DEFAULT '{}',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  content_id TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  attachment TEXT,
  live_demo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ─── TABLE: certificates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  issuer TEXT NOT NULL,
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  thumbnail TEXT,
  pdf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date DESC);

-- ─── TABLE: blogs ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  content_id TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  thumbnail TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- ─── TABLE: media ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER DEFAULT 0,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- ─── TABLE: visitor_analytics ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitor_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_analytics_created_at ON visitor_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_page ON visitor_analytics(page);

-- ─── TABLE: project_views ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views(project_id);

-- ─── TABLE: blog_views ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);

-- ─── TABLE: admin_users ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLE: activity_logs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ─── PUBLIC READ POLICIES ─────────────────────────────────────────────────────

-- Settings: public can read
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT USING (true);

-- Projects: public can read published
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT USING (published = true);

-- Certificates: public can read
CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT USING (true);

-- Blogs: public can read published
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT USING (published = true);

-- Visitor analytics: anyone can insert
CREATE POLICY "Anyone can track visits"
  ON visitor_analytics FOR INSERT WITH CHECK (true);

-- Project views: anyone can insert
CREATE POLICY "Anyone can log project views"
  ON project_views FOR INSERT WITH CHECK (true);

-- Blog views: anyone can insert
CREATE POLICY "Anyone can log blog views"
  ON blog_views FOR INSERT WITH CHECK (true);

-- ─── AUTHENTICATED (ADMIN) POLICIES ──────────────────────────────────────────

-- Settings: admin full access
CREATE POLICY "Authenticated can manage settings"
  ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects: admin full access
CREATE POLICY "Authenticated can manage projects"
  ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Certificates: admin full access
CREATE POLICY "Authenticated can manage certificates"
  ON certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blogs: admin full access
CREATE POLICY "Authenticated can manage blogs"
  ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Media: admin full access
CREATE POLICY "Authenticated can manage media"
  ON media FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Visitor analytics: admin can read
CREATE POLICY "Authenticated can read analytics"
  ON visitor_analytics FOR SELECT TO authenticated USING (true);

-- Project views: admin can read
CREATE POLICY "Authenticated can read project views"
  ON project_views FOR SELECT TO authenticated USING (true);

-- Blog views: admin can read
CREATE POLICY "Authenticated can read blog views"
  ON blog_views FOR SELECT TO authenticated USING (true);

-- Activity logs: admin full access
CREATE POLICY "Authenticated can manage activity logs"
  ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin users: admin full access
CREATE POLICY "Authenticated can manage admin users"
  ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════
-- Run these separately in Supabase Dashboard > Storage > New Bucket
-- Or via Supabase CLI. Buckets must be PUBLIC.

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- ─── STORAGE POLICIES ─────────────────────────────────────────────────────────
-- Public can read all buckets
-- INSERT INTO storage.policies (name, bucket_id, operation, definition)
-- VALUES ('Public Read', 'projects', 'SELECT', 'true');

-- Authenticated can upload/delete
-- INSERT INTO storage.policies (name, bucket_id, operation, definition)
-- VALUES ('Auth Upload', 'projects', 'INSERT', 'auth.role() = ''authenticated''');

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
