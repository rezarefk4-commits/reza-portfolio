-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: CV File & Years Experience
-- Jalankan di Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Tambah kolom cv_file (URL file CV yang bisa diunduh)
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS cv_file TEXT;

-- Tambah kolom stats_years_experience (tahun pengalaman, diisi manual)
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS stats_years_experience INTEGER DEFAULT 0;

-- Buat storage bucket 'documents' untuk CV (jika belum ada)
-- Jalankan di Supabase Dashboard > Storage > New bucket
-- Nama: documents, Public: true
-- Atau via SQL (hanya jika pakai Supabase dengan storage API):
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: siapa saja bisa baca (download CV)
CREATE POLICY IF NOT EXISTS "Public read documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- Policy: hanya authenticated yang bisa upload
CREATE POLICY IF NOT EXISTS "Authenticated upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY IF NOT EXISTS "Authenticated update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY IF NOT EXISTS "Authenticated delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');
