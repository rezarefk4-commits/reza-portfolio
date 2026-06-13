"use client";

import { useState, useEffect } from "react";

interface EduJournalModalProps {
  title: string;
  pdfUrl?: string | null;
  externalUrl?: string | null;
}

export function EduJournalModal({ title, pdfUrl, externalUrl }: EduJournalModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  if (!pdfUrl && !externalUrl) return null;

  const cleanPdf = pdfUrl ? pdfUrl.split("?")[0] : null;
  const viewerSrc = cleanPdf
    ? `${cleanPdf}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`
    : `https://docs.google.com/viewer?url=${encodeURIComponent(externalUrl!)}&embedded=true`;
  const openHref = cleanPdf ?? externalUrl!;

  return (
    <>
      <style>{`
        @keyframes _jIn  { from { opacity:0; transform:scale(.97) translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes _jBg  { from { opacity:0; } to { opacity:1; } }
        .journal-btn-minimal {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          border: 1px solid var(--brand-alpha-medium);
          background: var(--brand-alpha-weak);
          color: var(--brand-on-background-strong);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .journal-btn-minimal:hover {
          background: var(--brand-alpha-medium);
          border-color: var(--brand-background-strong);
          transform: translateY(-1px);
        }
      `}</style>

      {/* ── Trigger button — text only, no thumbnail ── */}
      <button className="journal-btn-minimal" onClick={() => setOpen(true)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Baca Jurnal
      </button>

      {/* ── Full-screen PDF modal ── */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
            animation: "_jBg 0.2s ease",
          }}
        >
          <div style={{
            width: "100%", maxWidth: 880,
            height: "min(92vh, 920px)",
            borderRadius: 18,
            background: "var(--neutral-background-strong)",
            border: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 10%, transparent)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "_jIn 0.24s cubic-bezier(0.34,1.56,0.64,1)",
          }}>

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 18px", flexShrink: 0,
              borderBottom: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)",
              background: "color-mix(in srgb, var(--neutral-on-background-strong) 3%, transparent)",
            }}>
              {/* PDF icon */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: "color-mix(in srgb, #ef4444 14%, transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>

              {/* Title stack */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--neutral-on-background-weak)", marginBottom: 1 }}>
                  Skripsi / Jurnal
                </div>
                <div style={{
                  fontSize: 12.5, fontWeight: 600, fontStyle: "italic",
                  color: "var(--neutral-on-background-strong)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {title}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a
                  href={openHref} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 12px", borderRadius: 7,
                    background: "var(--neutral-alpha-weak)",
                    border: "1px solid var(--neutral-alpha-medium)",
                    color: "var(--neutral-on-background-strong)",
                    fontSize: 12, fontWeight: 600, textDecoration: "none",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-alpha-medium)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--neutral-alpha-weak)")}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Buka
                </a>
                <button
                  onClick={() => setOpen(false)}
                  title="Tutup (Esc)"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 7,
                    background: "var(--neutral-alpha-weak)",
                    border: "1px solid var(--neutral-alpha-medium)",
                    color: "var(--neutral-on-background-strong)",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-alpha-weak)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--neutral-alpha-weak)")}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* PDF viewer */}
            <div style={{ flex: 1, overflow: "hidden", background: "#404040" }}>
              <iframe
                src={viewerSrc}
                title={title}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allow="fullscreen"
              />
            </div>

            {/* Footer */}
            <div style={{
              padding: "7px 18px", flexShrink: 0,
              borderTop: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "color-mix(in srgb, var(--neutral-on-background-strong) 2%, transparent)",
            }}>
              <span style={{ fontSize: 10.5, color: "var(--neutral-on-background-weak)" }}>
                Tekan{" "}
                <kbd style={{ padding: "1px 4px", borderRadius: 3, border: "1px solid var(--neutral-alpha-medium)", fontSize: 9.5, fontFamily: "monospace" }}>Esc</kbd>
                {" "}untuk menutup
              </span>
              {externalUrl && cleanPdf && (
                <a href={externalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10.5, color: "var(--brand-on-background-weak)", textDecoration: "none" }}>
                  Sumber asli →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
