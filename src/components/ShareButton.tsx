"use client";

import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  ogImageUrl?: string;
}

export function ShareButton({ title, description, url, ogImageUrl }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const imageUrl = ogImageUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/api/og/generate?title=${encodeURIComponent(title)}`;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareStatus("Link disalin!");
      setTimeout(() => { setCopied(false); setShareStatus(null); }, 2500);
    } catch {
      setShareStatus("Gagal menyalin");
      setTimeout(() => setShareStatus(null), 2000);
    }
    setOpen(false);
  };

  const shareNative = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title,
        text: description || title,
        url: shareUrl,
      });
    } catch {
      // User cancelled
    }
    setOpen(false);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title}\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener");
    setOpen(false);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
    setOpen(false);
  };

  const shareToIGStory = () => {
    // Instagram Stories deep link — opens IG with the page URL as sticker
    // On mobile: opens IG app. On desktop: shows copy guide
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      // Try IG deep link with URL sticker
      const igDeepLink = `instagram-stories://share?background_image_url=${encodeURIComponent(imageUrl)}&content_url=${encodeURIComponent(shareUrl)}`;
      window.location.href = igDeepLink;
      setShareStatus("Membuka Instagram...");
    } else {
      // Desktop fallback — copy OG image URL
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setShareStatus("Link disalin — buka IG Story & tempel!");
        })
        .catch(() => {
          setShareStatus("Buka IG, tempel link ini di Story");
        });
    }
    setTimeout(() => setShareStatus(null), 3000);
    setOpen(false);
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <style>{`
        @keyframes shareMenuIn {
          from { opacity: 0; transform: scale(0.92) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .share-menu {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 200px;
          background: var(--neutral-background-strong);
          border: 1px solid var(--neutral-alpha-medium);
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 100;
          animation: shareMenuIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          backdrop-filter: blur(16px);
        }
        .share-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: var(--neutral-on-background-medium);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .share-item:hover {
          background: var(--neutral-alpha-weak);
          color: var(--neutral-on-background-strong);
        }
        .share-item:not(:last-child) {
          border-bottom: 1px solid var(--neutral-alpha-weak);
        }
        .share-status-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--neutral-background-strong);
          border: 1px solid var(--neutral-alpha-medium);
          border-radius: 99px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--neutral-on-background-strong);
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          z-index: 9999;
          animation: shareMenuIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>

      {/* Share button trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 10,
          border: "1px solid var(--neutral-alpha-medium)",
          background: open ? "var(--neutral-alpha-weak)" : "transparent",
          color: "var(--neutral-on-background-medium)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--neutral-alpha-weak)";
          e.currentTarget.style.color = "var(--neutral-on-background-strong)";
          e.currentTarget.style.borderColor = "var(--neutral-alpha-strong)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--neutral-on-background-medium)";
            e.currentTarget.style.borderColor = "var(--neutral-alpha-medium)";
          }
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Bagikan
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="share-menu">
          {/* Copy link */}
          <button className="share-item" onClick={copyLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied ? "✓ Tersalin!" : "Salin link"}
          </button>

          {/* Native Share (mobile) */}
          {hasNativeShare && (
            <button className="share-item" onClick={shareNative}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share...
            </button>
          )}

          {/* WhatsApp */}
          <button className="share-item" onClick={shareToWhatsApp}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/>
            </svg>
            WhatsApp
          </button>

          {/* Twitter/X */}
          <button className="share-item" onClick={shareToTwitter}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X (Twitter)
          </button>

          {/* Instagram Story */}
          <button className="share-item" onClick={shareToIGStory}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            IG Story
          </button>
        </div>
      )}

      {/* Status toast */}
      {shareStatus && (
        <div className="share-status-toast">
          {shareStatus}
        </div>
      )}
    </div>
  );
}
