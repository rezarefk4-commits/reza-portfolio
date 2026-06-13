export const dynamic = "force-dynamic";

import Link from "next/link";
import { Column, Heading, Text } from "@once-ui-system/core";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; title?: string }>;
}) {
  const { title } = await searchParams;
  return {
    title: title ? `${title} · Preview Jurnal` : "Preview Jurnal",
  };
}

export default async function JurnalPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; title?: string }>;
}) {
  const { url, title } = await searchParams;

  if (!url) {
    return (
      <Column maxWidth="m" paddingY="48" gap="16" horizontal="center">
        <Heading as="h1" variant="display-strong-s">Jurnal tidak ditemukan</Heading>
        <Text onBackground="neutral-weak">Tautan jurnal tidak valid atau tidak disertakan.</Text>
        <Link href="/about" className="jurnal-back-link">← Kembali ke halaman About</Link>
      </Column>
    );
  }

  const isSupabaseUrl = /\.(supabase\.co|supabase\.in)$/.test(
    (() => {
      try { return new URL(url).hostname; } catch { return ""; }
    })()
  );
  const proxyUrl = isSupabaseUrl && !url.includes("/api/")
    ? `/api/pdf-proxy?url=${encodeURIComponent(url)}`
    : url;

  const displayTitle = title || "Preview Jurnal";

  return (
    <div className="jurnal-page">
      <style>{`
        .jurnal-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .jurnal-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 96px 24px 16px;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .jurnal-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--neutral-on-background-strong);
          margin: 0;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .jurnal-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .jurnal-back-link,
        .jurnal-open-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12.5px; font-weight: 600;
          color: var(--neutral-on-background-strong);
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-alpha-weak);
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .jurnal-back-link:hover,
        .jurnal-open-link:hover {
          background: var(--neutral-alpha-medium);
        }
        .jurnal-open-link {
          color: var(--brand-on-background-medium);
          border-color: var(--brand-alpha-medium);
          background: var(--brand-alpha-weak);
        }
        .jurnal-open-link:hover {
          background: var(--brand-alpha-medium);
        }
        .jurnal-viewer-wrap {
          flex: 1;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 32px;
          box-sizing: border-box;
        }
        .jurnal-viewer {
          width: 100%;
          height: calc(100vh - 160px);
          min-height: 600px;
          border: 1px solid var(--neutral-alpha-weak);
          border-radius: 12px;
          background: #fff;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        .jurnal-viewer iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        @media (max-width: 640px) {
          .jurnal-topbar { padding: 88px 16px 12px; }
          .jurnal-viewer-wrap { padding: 0 16px 24px; }
          .jurnal-viewer { height: calc(100vh - 140px); min-height: 480px; border-radius: 10px; }
          .jurnal-title { width: 100%; order: -1; white-space: normal; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
        }
      `}</style>

      <div className="jurnal-topbar">
        <p className="jurnal-title">{displayTitle}</p>
        <div className="jurnal-actions">
          <Link href="/about#pendidikan" className="jurnal-back-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Kembali
          </Link>
          <a href={url} target="_blank" rel="noopener noreferrer" className="jurnal-open-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Buka di Tab Baru
          </a>
        </div>
      </div>

      <div className="jurnal-viewer-wrap">
        <div className="jurnal-viewer">
          <iframe src={proxyUrl} title={displayTitle} />
        </div>
      </div>
    </div>
  );
}
