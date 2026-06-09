"use client";

import { Heading, Text, RevealFx, Column, Row } from "@once-ui-system/core";
import { about, person } from "@/resources";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { useEffect, useState } from "react";
import { ShimmerButton } from "./ShimmerButton";
import { HeroSkeleton } from "@/components/Skeletons";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

/* ── Download CV Button — Minimal Solid CTA ────────────────────────────── */
function DownloadCVButton({ cvUrl, label }: { cvUrl: string; label: string }) {
  const [clicked, setClicked] = useState(false);

  const handleDownload = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "CV-Reza-Refka.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{`
        @keyframes cv-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(2.5px); }
        }
        @keyframes cv-check-draw {
          from { stroke-dashoffset: 22; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cv-success-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }

        /* ── Base — Solid Dark (Dark Mode) ── */
        .cv-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px 9px 12px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.90);
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          outline: none;
          overflow: hidden;
          isolation: isolate;
          transition:
            background 0.22s ease,
            border-color 0.22s ease,
            transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.22s ease,
            color 0.22s ease;
          box-shadow: 0 1px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
          -webkit-tap-highlight-color: transparent;
        }

        /* shimmer sweep */
        .cv-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .cv-btn:hover::before { transform: translateX(100%); }

        .cv-btn:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.30);
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 18px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.16);
          color: #fff;
        }
        .cv-btn:hover .cv-icon { animation: cv-bounce 0.55s ease-in-out infinite; }
        .cv-btn:active { transform: scale(0.97); }

        /* Success */
        .cv-btn.cv-ok {
          background: rgba(34,197,94,0.18);
          border-color: rgba(34,197,94,0.40);
          color: rgb(74,222,128);
          box-shadow: 0 2px 14px rgba(34,197,94,0.14);
        }

        /* ── Icon ── */
        .cv-icon {
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; position: relative; z-index: 2;
          opacity: 0.85;
        }
        .cv-label { position: relative; z-index: 2; }
        .cv-check {
          stroke-dasharray: 22; stroke-dashoffset: 22;
          animation: cv-check-draw 0.38s ease forwards;
        }
        .cv-pop { animation: cv-success-pop 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        /* ── Light Mode ── */
        [data-theme="light"] .cv-btn,
        .light .cv-btn {
          background: #111;
          border-color: rgba(0,0,0,0.75);
          color: #f9f9f9;
          box-shadow: 0 1px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        [data-theme="light"] .cv-btn:hover,
        .light .cv-btn:hover {
          background: #222;
          border-color: rgba(0,0,0,0.85);
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          color: #fff;
        }
        [data-theme="light"] .cv-btn.cv-ok,
        .light .cv-btn.cv-ok {
          background: #166534;
          border-color: #15803d;
          color: #bbf7d0;
        }
      `}</style>

      <button
        className={`cv-btn${clicked ? " cv-ok" : ""}`}
        onClick={handleDownload}
        type="button"
        aria-label={label}
      >
        <span className="cv-icon">
          {clicked ? (
            <svg className="cv-pop" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline className="cv-check" points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="cv-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          )}
        </span>
        <span className="cv-label">
          {clicked
            ? (label === "Download CV" ? "Saved!" : "Tersimpan!")
            : label}
        </span>
      </button>
    </>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export function HeroSection({ settings: initialSettings }: HeroSectionProps) {
  const { lang } = useLang();
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);
  const [avatarSrc, setAvatarSrc] = useState<string>(person.avatar);
  // Skeleton hanya muncul jika tidak ada data dari server (SSR kosong)
  const [isLoading, setIsLoading] = useState<boolean>(!initialSettings);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
          if (data.avatar) setAvatarSrc(data.avatar.split("?")[0]);
        }
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Column fillWidth horizontal="center" gap="m">
        <HeroSkeleton />
      </Column>
    );
  }

  const heroHeadline = settings
    ? lang === "en" ? settings.hero_headline_en : settings.hero_headline_id
    : "Membangun solusi digital yang bermakna";

  const heroDescription = settings
    ? lang === "en" ? settings.hero_description_en : settings.hero_description_id
    : "Saya Reza, seorang developer yang bersemangat membangun solusi digital.";

  const heroMotto = settings
    ? lang === "en" ? settings.hero_motto_en : settings.hero_motto_id
    : "";

  const ctaText = settings
    ? lang === "en" ? settings.hero_cta_text_en : settings.hero_cta_text_id
    : lang === "en" ? "About Me" : "Tentang Saya";

  const ctaLink = settings?.hero_cta_link || about.path;
  const cvUrl = settings?.cv_file ?? null;
  const cvLabel = lang === "en" ? "Download CV" : "Unduh CV";

  return (
    <Column fillWidth horizontal="center" gap="m" paddingX="l" style={{ paddingBottom: 16 }}>
      <style>{`
        @keyframes heroDotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:.45; transform:scale(1.5); }
        }
        .hero-motto-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px 5px 8px;
          border-radius: 999px;
          border: 1px solid var(--neutral-alpha-weak);
          background: var(--neutral-alpha-weak);
          backdrop-filter: blur(8px);
          max-width: 100%;
          overflow: hidden;
        }
        .hero-motto-text {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--neutral-on-background-weak);
          font-family: inherit;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 400px) {
          .hero-cta-row { flex-direction: column; align-items: stretch; }
          .hero-cta-row > * { width: 100%; justify-content: center; }
        }
      `}</style>
      <Column maxWidth="s" horizontal="center" align="center" fillWidth>

        {/* ── Motto pill ── */}
        {heroMotto?.trim() && (
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="20">
            <div className="hero-motto-pill">
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--brand-solid-strong, #6366f1)",
                flexShrink: 0,
                animation: "heroDotPulse 2.4s ease-in-out infinite",
                display: "inline-block",
              }} />
              <span className="hero-motto-text">
                {heroMotto}
              </span>
            </div>
          </RevealFx>
        )}

        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l" style={{ textAlign: "center" }}>
            {heroHeadline}
          </Heading>
        </RevealFx>

        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
          <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl" style={{ textAlign: "center" }}>
            {heroDescription}
          </Text>
        </RevealFx>

        <RevealFx paddingTop="12" delay={0.4} fillWidth horizontal="center">
          <div className="hero-cta-row">
            <ShimmerButton
              href={ctaLink}
              avatarSrc={avatarSrc}
              label={ctaText}
              personName={person.name}
            />
            {cvUrl && (
              <DownloadCVButton cvUrl={cvUrl} label={cvLabel} />
            )}
          </div>
        </RevealFx>

      </Column>
    </Column>
  );
}
