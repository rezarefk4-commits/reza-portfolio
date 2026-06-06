"use client";

import { useState } from "react";

interface ProjectMediaPreviewProps {
  thumbnail: string;
  attachment: string;
  title: string;
  gallery: string[];
}

function getMediaType(url: string): "image" | "video" | "pdf" | null {
  if (!url) return null;
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(mp4|webm|mov|ogg)$/.test(clean)) return "video";
  if (/\.pdf$/.test(clean)) return "pdf";
  return "image";
}

function VideoPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: "0 8px 48px rgba(0,0,0,0.3)" }}>
      <video
        src={src}
        controls
        playsInline
        style={{ width: "100%", maxHeight: "70vh", display: "block", background: "#000" }}
        poster={undefined}
        title={title}
      />
    </div>
  );
}

/* ── Elegant PDF Card Viewer ───────────────────────────────── */
function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        background: "var(--neutral-background-medium)",
        border: "1px solid var(--neutral-alpha-weak)",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      {/* Decorative top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, var(--brand-background-strong) 0%, transparent 70%)",
          borderRadius: "20px 20px 0 0",
          zIndex: 1,
        }}
      />

      {/* Card header — title only */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 22px",
          background: "var(--neutral-background-strong)",
          borderBottom: "1px solid var(--neutral-alpha-weak)",
        }}
      >
        {/* PDF icon badge */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
            <polyline points="9 9 10 9" />
          </svg>
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--neutral-on-background-strong)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--neutral-on-background-weak)",
              marginTop: 2,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Dokumen PDF
          </div>
        </div>
      </div>

      {/* PDF iframe — scroll only, no toolbar */}
      <div style={{ position: "relative" }}>
        <iframe
          src={`${src}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          title={title}
          style={{
            width: "100%",
            height: "680px",
            border: "none",
            display: "block",
            background: "var(--neutral-background-weak)",
          }}
        />
        {/* Bottom fade overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 32,
            background:
              "linear-gradient(to top, var(--neutral-background-medium) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function ImageLightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "lightIn 0.2s ease",
      }}
    >
      <style>{`@keyframes lightIn { from{opacity:0} to{opacity:1} }`}</style>
      <button onClick={onClose} style={{
        position: "absolute", top: 20, right: 20, width: 44, height: 44,
        borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "92vw", maxHeight: "90vh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }} />
      </div>
    </div>
  );
}

export function ProjectMediaPreview({ thumbnail, attachment, title, gallery }: ProjectMediaPreviewProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const attachType = attachment ? getMediaType(attachment) : null;

  const allImages = [
    ...(thumbnail ? [thumbnail] : []),
    ...gallery.filter((g) => g !== thumbnail && getMediaType(g) === "image"),
  ];

  return (
    <>
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} title={title} onClose={() => setLightboxSrc(null)} />
      )}

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>

        {attachment && attachType === "video" && (
          <VideoPlayer src={attachment} title={title} />
        )}

        {attachment && attachType === "pdf" && (
          <PdfViewer src={attachment} title={title} />
        )}

        {allImages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              onClick={() => setLightboxSrc(allImages[activeImg])}
              style={{
                width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden",
                background: "var(--neutral-alpha-weak)", cursor: "zoom-in",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={allImages[activeImg]}
                src={allImages[activeImg]}
                alt={`${title} — ${activeImg + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.25s" }}
              />
              <div style={{
                position: "absolute", bottom: 12, right: 12,
                padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                color: "#fff", display: "flex", alignItems: "center", gap: 5,
                opacity: 0.75,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                Zoom
              </div>
              {allImages.length > 1 && (
                <div style={{
                  position: "absolute", bottom: 12, left: 12,
                  padding: "4px 10px", borderRadius: 99, fontSize: 11,
                  background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                  color: "#fff",
                }}>
                  {activeImg + 1} / {allImages.length}
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      flexShrink: 0, width: 80, height: 56,
                      borderRadius: 8, overflow: "hidden",
                      border: `2px solid ${i === activeImg ? "var(--brand-background-strong)" : "transparent"}`,
                      cursor: "pointer", padding: 0, background: "var(--neutral-alpha-weak)",
                      transition: "border-color 0.18s, opacity 0.18s",
                      opacity: i === activeImg ? 1 : 0.55,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`thumb ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {attachment && attachType === "image" && attachment !== thumbnail && (
          <div
            onClick={() => setLightboxSrc(attachment)}
            style={{
              width: "100%", borderRadius: 16, overflow: "hidden",
              background: "var(--neutral-alpha-weak)", cursor: "zoom-in",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={attachment} alt={`${title} — attachment`}
              style={{ width: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
      </div>
    </>
  );
}
