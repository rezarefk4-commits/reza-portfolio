# Reza Refka Portfolio CMS

Portfolio berbasis CMS Supabase — dibangun di atas Magic Portfolio (Once UI).

## Stack
- **Frontend**: Next.js 15, TypeScript, Once UI
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **Editor**: Tiptap (rich text, bilingual)
- **Deploy**: Vercel

---

## Setup (Step by Step)

### 1. Install Dependencies
```bash
npm install
```

### 2. Buat Supabase Project
1. [supabase.com](https://supabase.com) → New Project → Region: Singapore
2. Catat **Project URL** dan **anon public key** dari Settings → API

### 3. Jalankan Migration SQL
Buka SQL Editor di Supabase → paste isi `supabase/migration.sql` → Run

### 4. Buat Storage Buckets (semua Public)
`avatars` | `projects` | `certificates` | `blogs` | `videos` | `documents` | `media`

### 5. Buat Admin User
Authentication → Users → Invite User → masukkan email Anda

### 6. Environment Variables
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://rezarefka.com
```

### 7. Dev
```bash
npm run dev
```

### 8. CMS Admin
Buka `/reza-control` → login dengan akun Supabase

---

## Deploy ke Vercel
1. Push ke GitHub
2. Import di vercel.com
3. Tambahkan 3 env vars di atas
4. Deploy

---

## Halaman Public
| Route | Keterangan |
|-------|------------|
| `/` | Homepage |
| `/about` | Tentang + sertifikat |
| `/work` | Projects + filter kategori |
| `/blog` | Artikel blog |
| `/gallery` | Galeri foto |
| `/contact` | Kontak |
| `/project/[slug]` | Detail project |
| `/blog/[slug]` | Detail artikel |
| `/certificate/[slug]` | Detail sertifikat |

## Admin (`/reza-control`)
Dashboard | Projects | Certificates | Blogs | Media | Analytics | Settings | Account

## Fitur
- Bilingual ID/EN realtime (toggle di header)
- CMS: Projects, Blog, Sertifikat, Settings, Media Library
- Analytics: visitors today/month/total, top projects, top blogs
- Tiptap rich text editor bilingual
- Upload media ke Supabase Storage
- Timezone: Asia/Makassar (UTC+8)
- RLS + Middleware auth protection
- SEO: sitemap, robots, Open Graph, JSON-LD, manifest
