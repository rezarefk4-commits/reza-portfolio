-- Migration: tambah kolom gallery_display_mode ke tabel projects
-- Jalankan di Supabase SQL Editor

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS gallery_display_mode TEXT NOT NULL DEFAULT 'slider'
  CHECK (gallery_display_mode IN ('slider', 'scroll-horizontal', 'scroll-vertical'));

COMMENT ON COLUMN projects.gallery_display_mode IS
  'Mode tampilan gallery: slider | scroll-horizontal | scroll-vertical';
