"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  /* Lock scroll saat modal terbuka */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Tutup dengan Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "cmFadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes cmFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes cmSlideUp { from { opacity:0; transform:translateY(12px) scale(0.97) }
                               to   { opacity:1; transform:translateY(0)    scale(1)    } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          borderRadius: 18,
          background: "var(--neutral-background-strong)",
          border: "1px solid var(--neutral-alpha-medium)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px var(--neutral-alpha-weak)",
          overflow: "hidden",
          animation: "cmSlideUp 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Accent line */}
        <div style={{
          height: 3,
          background: danger
            ? "linear-gradient(90deg, #ef4444 0%, #f97316 100%)"
            : "linear-gradient(90deg, var(--brand-background-strong) 0%, var(--accent-background-strong) 100%)",
        }} />

        {/* Body */}
        <div style={{ padding: "24px 24px 20px" }}>
          {/* Icon */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, marginBottom: 16,
            background: danger ? "rgba(239,68,68,0.12)" : "var(--brand-alpha-weak)",
            border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "var(--brand-alpha-medium)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: danger ? "#ef4444" : "var(--brand-on-background-medium)",
          }}>
            {danger ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
          </div>

          {/* Text */}
          <div style={{
            fontSize: 16, fontWeight: 700, marginBottom: 8,
            color: "var(--neutral-on-background-strong)", lineHeight: 1.3,
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 13.5, color: "var(--neutral-on-background-weak)",
            lineHeight: 1.65, marginBottom: 24,
          }}>
            {message}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onCancel}
              style={{
                padding: "9px 20px", borderRadius: 10, border: "1px solid var(--neutral-alpha-medium)",
                background: "var(--neutral-background-medium)", color: "var(--neutral-on-background-strong)",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "var(--neutral-alpha-weak)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "var(--neutral-background-medium)"; }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: "9px 20px", borderRadius: 10, border: "none",
                background: danger
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "var(--brand-background-strong)",
                color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: danger ? "0 4px 14px rgba(239,68,68,0.35)" : "0 4px 14px var(--brand-alpha-medium)",
                transition: "opacity 0.15s, transform 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = "0.88"; (e.target as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = "1"; (e.target as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
