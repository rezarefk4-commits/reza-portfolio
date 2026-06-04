-- ═══════════════════════════════════════════════════════════════════
-- MIGRATION: Tambah kolom jurnal ke about_education
-- Jalankan di Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE about_education
  ADD COLUMN IF NOT EXISTS journal_url  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS journal_pdf  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS gpa          TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS field_of_study TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS thesis_title TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS thesis_goal  TEXT DEFAULT '';
