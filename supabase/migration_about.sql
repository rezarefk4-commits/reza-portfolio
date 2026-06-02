-- ═══════════════════════════════════════════════════════════════════
-- ABOUT CMS TABLES — jalankan di Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Pendidikan
CREATE TABLE IF NOT EXISTS about_education (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  university_name TEXT NOT NULL,
  faculty       TEXT DEFAULT '',
  major         TEXT DEFAULT '',
  degree        TEXT DEFAULT 'S1',
  year_start    TEXT DEFAULT '',
  year_end      TEXT DEFAULT '',
  logo          TEXT,
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Pengalaman Kerja
CREATE TABLE IF NOT EXISTS about_experiences (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company       TEXT NOT NULL,
  role_id       TEXT DEFAULT '',
  role_en       TEXT DEFAULT '',
  timeframe     TEXT DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Keahlian Teknis
CREATE TABLE IF NOT EXISTS about_skills (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_id      TEXT NOT NULL,
  title_en      TEXT DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  icon          TEXT DEFAULT '',
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Organisasi
CREATE TABLE IF NOT EXISTS about_organizations (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  role_id       TEXT DEFAULT '',
  role_en       TEXT DEFAULT '',
  year          TEXT DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  logo          TEXT,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE about_education     ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_experiences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_organizations ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read education"     ON about_education     FOR SELECT USING (true);
CREATE POLICY "Public read experiences"   ON about_experiences   FOR SELECT USING (true);
CREATE POLICY "Public read skills"        ON about_skills        FOR SELECT USING (true);
CREATE POLICY "Public read organizations" ON about_organizations FOR SELECT USING (true);

-- Auth write
CREATE POLICY "Auth manage education"     ON about_education     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage experiences"   ON about_experiences   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage skills"        ON about_skills        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth manage organizations" ON about_organizations FOR ALL TO authenticated USING (true) WITH CHECK (true);
