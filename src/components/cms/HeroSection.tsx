"use client";

import { Heading, Text, RevealFx, Column, Row } from "@once-ui-system/core";
import { about, person } from "@/resources";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { useEffect, useState } from "react";
import { ShimmerButton } from "./ShimmerButton";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

/* ── Download CV Button ─────────────────────────────────────────────────── */
function DownloadCVButton({ cvUrl, label }: { cvUrl: string; label: string }) {
  const handleDownload = () => {
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
        @keyframes cvSweep {
          0%   { transform: translateX(-130%) rotate(-18deg); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.7; }
          100% { transform: translateX(240%) rotate(-18deg); opacity: 0; }
        }
        @keyframes cvPulse {
          0%, 100% { box-shadow: 0 2px 16px rgba(var(--brand-rgb, 99 102 241) / 0.12), 0 0 0 1px rgba(var(--brand-rgb, 99 102 241) / 0.15); }
          50%       { box-shadow: 0 4px 24px rgba(var(--brand-rgb, 99 102 241) / 0.20), 0 0 0 1px rgba(var(--brand-rgb, 99 102 241) / 0.25); }
        }

        .cv-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          animation: cvPulse 3.5s ease-in-out infinite;
          transition:
            background  0.3s ease,
            transform   0.3s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow  0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 20px 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-background-medium);
          cursor: pointer;
          color: var(--neutral-on-background-strong);
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          text-decoration: none;
          white-space: nowrap;
        }

        /* sweep shine */
        .cv-btn::before {
          content: "";
          position: absolute;
          top: -40%; left: 0;
          width: 26%; height: 180%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255,255,255,0.02) 20%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0.02) 80%,
            transparent 100%
          );
          animation: cvSweep 5s cubic-bezier(0.45,0,0.55,1) infinite;
          pointer-events: none;
          z-index: 1;
          filter: blur(1px);
        }

        /* top rim */
        .cv-btn::after {
          content: "";
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent);
          opacity: 0.5;
          pointer-events: none;
          z-index: 2;
        }

        .cv-btn:hover {
          background: var(--neutral-background-strong) !important;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 24px rgba(0,0,0,0.18), 0 0 0 1px var(--neutral-alpha-strong);
          animation: none;
        }
        .cv-btn:hover::before {
          animation: cvSweep 1.4s cubic-bezier(0.45,0,0.55,1) infinite;
        }
        .cv-btn:active {
          transform: translateY(0) scale(0.97);
        }

        .cv-icon {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; z-index: 3;
          color: var(--neutral-on-background-weak);
          flex-shrink: 0;
        }
        .cv-btn:hover .cv-icon {
          transform: translateY(2px);
        }
        .cv-label {
          position: relative; z-index: 3;
        }
      `}</style>

      <button className="cv-btn" onClick={handleDownload} type="button">
        {/* Download icon */}
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="cv-icon"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span className="cv-label">{label}</span>
        {/* tiny CV badge */}
        <span style={{
          position: "relative", zIndex: 3,
          fontSize: 10, fontWeight: 700, lineHeight: 1,
          padding: "2px 5px", borderRadius: 4,
          background: "var(--neutral-alpha-medium)",
          color: "var(--neutral-on-background-weak)",
          letterSpacing: "0.06em",
        }}>
          CV
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
      });
  }, []);

  const heroHeadline = settings
    ? lang === "en" ? settings.hero_headline_en : settings.hero_headline_id
    : "Membangun solusi digital yang bermakna";

  const heroDescription = settings
    ? lang === "en" ? settings.hero_description_en : settings.hero_description_id
    : "Saya Reza, seorang developer yang bersemangat membangun solusi digital.";

  const ctaText = settings
    ? lang === "en" ? settings.hero_cta_text_en : settings.hero_cta_text_id
    : lang === "en" ? "About Me" : "Tentang Saya";

  const ctaLink = settings?.hero_cta_link || about.path;
  const cvUrl = settings?.cv_file ?? null;
  const cvLabel = lang === "en" ? "Download CV" : "Unduh CV";

  return (
    <Column fillWidth horizontal="center" gap="m">
      <Column maxWidth="s" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l">
            {heroHeadline}
          </Heading>
        </RevealFx>
        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
          <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
            {heroDescription}
          </Text>
        </RevealFx>
        <RevealFx paddingTop="12" delay={0.4} horizontal="center">
          <Row gap="12" horizontal="center" wrap>
            <ShimmerButton
              href={ctaLink}
              avatarSrc={avatarSrc}
              label={ctaText}
              personName={person.name}
            />
            {cvUrl && (
              <DownloadCVButton cvUrl={cvUrl} label={cvLabel} />
            )}
          </Row>
        </RevealFx>
      </Column>
    </Column>
  );
}
