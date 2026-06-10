"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectGalleryInlineProps {
  thumbnail: string;
  attachment: string;
  gallery: string[];
  title: string;
}

type MediaType = "image" | "video" | "pdf";

interface MediaItem {
  url: string;
  type: MediaType;
}

function detectType(url: string): MediaType {
  if (!url) return "image";
  const clean = url.split("?")[0].toLowerCase();
  // Cek ekstensi video
  if (/\.(mp4|webm|mov|ogg|mkv|avi|m4v)$/.test(clean)) return "video";
  // Cek path Supabase — kadang URL punya segment "video" di path-nya
  if (/\/video\//i.test(clean)) return "video";
  if (/\.pdf$/.test(clean)) return "pdf";
  return "image";
}

/* ─────────────────────────────────────────────────────────────────── */
/* Video Player — autoplay, progress bar, seek, mute, aspect-ratio    */
/* ─────────────────────────────────────────────────────────────────── */
function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function VideoPlayer({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("16/9");
  const [isPortrait, setIsPortrait] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proxySrc = src.includes("supabase.co") || src.includes("supabase.in")
    ? `/api/video-proxy?url=${encodeURIComponent(src)}`
    : src;

  // Auto-play on mount / src change
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(false);
    setPlaying(false);

    const tryPlay = () => {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });

    return () => { v.removeEventListener("loadeddata", tryPlay); v.pause(); };
  }, [proxySrc]);

  // Auto-hide controls after 3s of playing
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => { return () => { if (hideTimer.current) clearTimeout(hideTimer.current); }; }, []);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) {
      const r = v.videoWidth / v.videoHeight;
      setAspectRatio(`${v.videoWidth}/${v.videoHeight}`);
      setIsPortrait(r < 1);
    }
    setDuration(v.duration);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    setCurrentTime(v.currentTime);
    setProgress(v.duration ? v.currentTime / v.duration : 0);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
    resetHideTimer();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
    resetHideTimer();
  };

  // Seek on progress bar click/drag
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
    setProgress(pct);
    resetHideTimer();
  };

  // Container sizing: portrait capped at 70vh height, landscape full width
  const containerStyle: React.CSSProperties = isPortrait
    ? {
        width: "100%",
        maxHeight: "70vh",
        aspectRatio,
        margin: "0 auto",
        background: "#000",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
        position: "relative",
        cursor: "pointer",
      }
    : {
        width: "100%",
        aspectRatio,
        background: "#000",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
        position: "relative",
        cursor: "pointer",
      };

  return (
    <div
      style={containerStyle}
      onClick={togglePlay}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (playing) setShowControls(false);
      }}
    >
      <video
        ref={videoRef}
        key={proxySrc}
        src={proxySrc}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={handleMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setError(true)}
        onPlay={() => { setPlaying(true); resetHideTimer(); }}
        onPause={() => setPlaying(false)}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: isPortrait ? "cover" : "contain",
          background: "#000",
        }}
        title={title}
      />

      {/* Error state */}
      {error && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 13,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Video tidak dapat dimuat
        </div>
      )}

      {/* Center play/pause indicator (flash on toggle) */}
      {!error && !playing && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(0,0,0,0.52)", backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
          </div>
        </div>
      )}

      {/* ── Bottom Controls Bar ──────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "32px 14px 12px",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        display: "flex", flexDirection: "column", gap: 8,
        opacity: showControls || !playing ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: showControls || !playing ? "all" : "none",
      }}>
        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          style={{
            width: "100%", height: 4, borderRadius: 99,
            background: "rgba(255,255,255,0.25)",
            cursor: "pointer", position: "relative",
          }}
        >
          {/* Buffered / progress fill */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${progress * 100}%`,
            background: "var(--brand-background-strong, #6366f1)",
            borderRadius: 99,
            transition: "width 0.1s linear",
          }}/>
          {/* Scrubber thumb */}
          <div style={{
            position: "absolute", top: "50%",
            left: `${progress * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 12, height: 12, borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 4px rgba(0,0,0,0.5)",
          }}/>
        </div>

        {/* Controls row */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 10,
        }}>
          {/* Play/Pause */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          {/* Timestamp */}
          <span style={{
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)",
            fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em", flexShrink: 0,
          }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }}/>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
          >
            {muted ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* PDF Viewer — responsive height, tombol buka tab baru               */
/* ─────────────────────────────────────────────────────────────────── */
function PdfViewer({ src, title }: { src: string; title: string }) {
  const proxySrc = `/api/pdf-proxy?url=${encodeURIComponent(src)}`;

  return (
    <div
      style={{
        width: "100%", borderRadius: 20, overflow: "hidden",
        background: "var(--neutral-background-medium)",
        border: "1px solid var(--neutral-alpha-weak)",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* Accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, var(--brand-background-strong) 0%, transparent 70%)",
        zIndex: 1,
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 20px",
        background: "var(--neutral-background-strong)",
        borderBottom: "1px solid var(--neutral-alpha-weak)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ef4444", flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
            <polyline points="9 9 10 9"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--neutral-on-background-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          <div style={{ fontSize: 10, color: "var(--neutral-on-background-weak)", marginTop: 2, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
            Dokumen PDF
          </div>
        </div>
        <a
          href={src} target="_blank" rel="noopener noreferrer"
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--neutral-alpha-weak)", border: "1px solid var(--neutral-alpha-medium)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--neutral-on-background-weak)", flexShrink: 0, textDecoration: "none",
          }}
          title="Buka di tab baru"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      {/* iframe */}
      <div style={{ position: "relative" }}>
        <iframe
          src={`${proxySrc}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          title={title}
          style={{
            width: "100%",
            height: "clamp(400px, 75vh, 800px)",
            border: "none", display: "block",
            background: "var(--neutral-background-weak)",
          }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 28,
          background: "linear-gradient(to top, var(--neutral-background-medium) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Image Slide — rasio otomatis dari gambar asli, lightbox on click   */
/* ─────────────────────────────────────────────────────────────────── */
function ImageSlide({
  src, title, onClick, priority,
}: {
  src: string; title: string; onClick: () => void; priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.naturalWidth && el.naturalHeight) {
      setNaturalRatio(el.naturalWidth / el.naturalHeight);
    }
    setLoaded(true);
  };

  const aspectRatio = naturalRatio ? `${naturalRatio}` : "16/9";

  return (
    <div
      onClick={onClick}
      style={{
        width: "100%", aspectRatio, borderRadius: 16, overflow: "hidden",
        background: "var(--neutral-alpha-weak)", cursor: "zoom-in",
        position: "relative", transition: "aspect-ratio 0.3s ease",
      }}
    >
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, var(--neutral-alpha-weak) 25%, var(--neutral-alpha-medium) 50%, var(--neutral-alpha-weak) 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
        }} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={title}
        loading={priority ? "eager" : "lazy"} decoding="async"
        onLoad={handleLoad}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }}
        style={{
          width: "100%", height: "100%", objectFit: "contain",
          display: "block",
          opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease",
        }}
      />
      <div style={{
        position: "absolute", bottom: 10, right: 10,
        padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
        background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)",
        color: "#fff", display: "flex", alignItems: "center", gap: 5,
        opacity: 0.8, pointerEvents: "none",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        Zoom
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Lightbox                                                             */
/* ─────────────────────────────────────────────────────────────────── */
function Lightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(24px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "lbIn 0.18s ease",
      }}
    >
      <style>{`@keyframes lbIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }`}</style>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 18, right: 18, width: 44, height: 44,
          borderRadius: "50%", background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src} alt={title}
          style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 32px 80px rgba(0,0,0,0.7)", display: "block" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Nav Button                                                           */
/* ─────────────────────────────────────────────────────────────────── */
function NavBtn({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      aria-label={direction === "prev" ? "Sebelumnya" : "Berikutnya"}
      style={{
        position: "absolute", top: "50%",
        [direction === "prev" ? "left" : "right"]: 12,
        transform: "translateY(-50%)", zIndex: 10,
        width: 40, height: 40, borderRadius: "50%",
        background: "rgba(0,0,0,0.48)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.14)", color: "#fff",
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0 : 1,
        transition: "opacity 0.2s, background 0.2s",
        pointerEvents: disabled ? "none" : "all",
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.7)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.48)"; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === "prev" ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Thumbnail Strip                                                      */
/* ─────────────────────────────────────────────────────────────────── */
function ThumbnailStrip({ items, activeIdx, onSelect }: { items: MediaItem[]; activeIdx: number; onSelect: (i: number) => void }) {
  if (items.length <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
      {items.map((item, i) => (
        <button
          key={`${item.url}-${i}`}
          onClick={() => onSelect(i)}
          style={{
            flexShrink: 0, width: 76, height: 54, borderRadius: 8, overflow: "hidden",
            border: `2px solid ${i === activeIdx ? "var(--brand-background-strong)" : "rgba(255,255,255,0.08)"}`,
            cursor: "pointer", padding: 0,
            background: "var(--neutral-alpha-medium)",
            transition: "border-color 0.18s, opacity 0.18s, transform 0.18s",
            opacity: i === activeIdx ? 1 : 0.5,
            transform: i === activeIdx ? "scale(1.06)" : "scale(1)",
            position: "relative",
          }}
          aria-label={`Slide ${i + 1}`}
        >
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          ) : item.type === "video" ? (
            <div style={{ width: "100%", height: "100%", background: "#1a1a2e", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#1a1010", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Main: ProjectGalleryInline                                           */
/* ─────────────────────────────────────────────────────────────────── */
export function ProjectGalleryInline({ thumbnail, attachment, gallery, title }: ProjectGalleryInlineProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Bangun daftar media — thumbnail SELALU pertama
  const mediaItems = useCallback((): MediaItem[] => {
    const seen = new Set<string>();
    const items: MediaItem[] = [];

    const push = (url: string) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      items.push({ url, type: detectType(url) });
    };

    if (thumbnail) push(thumbnail);
    if (attachment && attachment !== thumbnail) push(attachment);
    for (const g of gallery) {
      if (g && g !== thumbnail && g !== attachment) push(g);
    }

    return items;
  }, [thumbnail, attachment, gallery])();

  const total = mediaItems.length;
  const current = mediaItems[activeIdx] ?? null;

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(total - 1, i + 1));

  // Keyboard nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (lightboxSrc) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxSrc, total]);

  if (!current) return null;

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} title={title} onClose={() => setLightboxSrc(null)} />
      )}

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Slide utama ─────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%" }}>
            {current.type === "image" && (
              <ImageSlide
                src={current.url} title={title}
                onClick={() => setLightboxSrc(current.url)}
                priority={activeIdx === 0}
              />
            )}
            {/* key={current.url} → React re-mount VideoPlayer tiap ganti video */}
            {current.type === "video" && (
              <VideoPlayer key={current.url} src={current.url} title={title} />
            )}
            {current.type === "pdf" && (
              <PdfViewer src={current.url} title={title} />
            )}
          </div>

          {/* Prev/next — bukan untuk PDF */}
          {current.type !== "pdf" && total > 1 && (
            <>
              <NavBtn direction="prev" onClick={prev} disabled={activeIdx === 0} />
              <NavBtn direction="next" onClick={next} disabled={activeIdx === total - 1} />
            </>
          )}

          {/* Counter badge */}
          {total > 1 && current.type !== "pdf" && (
            <div style={{
              position: "absolute", bottom: 12, left: 12,
              padding: "4px 10px", borderRadius: 99, fontSize: 11,
              background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)",
              color: "#fff", fontWeight: 600, pointerEvents: "none",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              {activeIdx + 1} / {total}
            </div>
          )}
        </div>

        {/* ── Thumbnail Strip ──────────────────────────────────── */}
        {total > 1 && (
          <ThumbnailStrip items={mediaItems} activeIdx={activeIdx} onSelect={setActiveIdx} />
        )}

        {/* ── Dot indicators ───────────────────────────────────── */}
        {total > 1 && total <= 12 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: -4 }}>
            {mediaItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 99,
                  background: i === activeIdx ? "var(--brand-background-strong)" : "var(--neutral-alpha-medium)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width 0.25s ease, background 0.2s",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
