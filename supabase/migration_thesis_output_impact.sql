-- Migration: tambah thesis_output & thesis_impact ke tabel about_education
-- Jalankan di Supabase SQL Editor

ALTER TABLE about_education
  ADD COLUMN IF NOT EXISTS thesis_output TEXT,
  ADD COLUMN IF NOT EXISTS thesis_impact TEXT;

COMMENT ON COLUMN about_education.thesis_output IS 'Output / hasil konkret penelitian (produk, model, sistem, dll)';
COMMENT ON COLUMN about_education.thesis_impact IS 'Dampak / manfaat penelitian bagi masyarakat, bidang ilmu, dll';
