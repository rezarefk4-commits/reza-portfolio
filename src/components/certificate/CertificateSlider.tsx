"use client";

import { useState } from "react";

interface CertificateSliderProps {
  images: string[];
  title: string;
}

export function CertificateSlider({ images, title }: CertificateSliderProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div style={{
        width: "100%", borderRadius: 16,
        background: "linear-gradient(135deg, var(--brand-alpha-weak), var(--accent-alpha-weak))",
        border: "1px solid var(--neutral-alpha-weak)",
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: 220, color: "var(--brand-on-background-medium)",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5"/><path d="M9 21v-4l3 1 3-1v4"/>
          <path d="M6 13.18A7 7 0 0 0 5 17v4"/><path d="M18 13.18A7 7 0 0 1 19 17v4"/>
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* ── Lightbox overlay ─────────────────────────── */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out", padding: "20px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${title} – slide ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "90vh",
              objectFit: "contain", borderRadius: 12,
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          />
          {/* Nav arrows in lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); }}
                style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  width: 44, height: 44, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.12)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(8px)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); }}
                style={{
                  position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                  width: 44, height: 44, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.12)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(8px)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
          {/* Close */}
          <button
            onClick={() => setZoomed(false)}
            style={{
              position: "absolute", top: 16, right: 16,
              width: 38, height: 38, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.12)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* ── Slider container ──────────────────────────── */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Main image */}
        <div
          style={{
            position: "relative", width: "100%",
            borderRadius: 14,
            border: "1px solid var(--neutral-alpha-weak)",
            background: "var(--neutral-alpha-weak)",
            overflow: "hidden",
            cursor: "zoom-in",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
          onClick={() => setZoomed(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${title} – slide ${active + 1}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />

          {/* Counter badge */}
          {images.length > 1 && (
            <div style={{
              position: "absolute", bottom: 10, right: 10,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
              color: "#fff", borderRadius: 99, padding: "3px 10px",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
            }}>
              {active + 1} / {images.length}
            </div>
          )}

          {/* Zoom hint */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
            color: "#fff", borderRadius: 99, padding: "4px 8px",
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 500,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            Zoom
          </div>

          {/* Arrow nav on image */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); }}
                style={{
                  position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.45)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(6px)",
                  transition: "background 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); }}
                style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.45)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backdropFilter: "blur(6px)",
                  transition: "background 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip (only if > 1 image) */}
        {images.length > 1 && (
          <div style={{
            display: "flex", gap: 6, overflow: "auto",
            paddingBottom: 2, scrollbarWidth: "none",
          }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flex: "0 0 60px", height: 44,
                  borderRadius: 8, overflow: "hidden",
                  border: i === active
                    ? "2px solid var(--brand-background-strong)"
                    : "2px solid var(--neutral-alpha-weak)",
                  background: "var(--neutral-alpha-weak)",
                  cursor: "pointer", padding: 0,
                  opacity: i === active ? 1 : 0.55,
                  transition: "opacity 0.15s, border-color 0.15s",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Slide ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </button>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
