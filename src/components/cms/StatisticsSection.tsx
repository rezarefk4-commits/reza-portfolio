"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Row, Text, RevealFx } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { SiteSettings } from "@/lib/types";

interface StatisticsProps {
  settings: SiteSettings | null;
  projectsCount: number;
  blogsCount: number;
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
}

function AnimNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Single Stat Card — premium horizontal layout ────────────────────────────
function StatCard({
  icon,
  value,
  suffix,
  label,
  sublabel,
  accentColor,
  index,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
  accentColor: string;
  index: number;
}) {
  return (
    <>
      <style>{`
        /* ── Card shell ───────────────────────────────────── */
        .pstat-card {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          padding: 28px 28px;
          border: 1px solid var(--neutral-alpha-weak);
          border-radius: 20px;
          background: var(--neutral-background-weak);
          overflow: hidden;
          min-width: 200px;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          cursor: default;
        }

        /* Gradient top-rim accent */
        .pstat-card::before {
          content: "";
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--pstat-accent) 50%,
            transparent 100%
          );
          opacity: 0.45;
          pointer-events: none;
        }

        /* Radial glow behind icon */
        .pstat-card::after {
          content: "";
          position: absolute;
          top: -20px; left: -20px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: var(--pstat-accent);
          opacity: 0.05;
          filter: blur(18px);
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .pstat-card:hover {
          border-color: var(--neutral-alpha-medium);
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.14);
        }
        .pstat-card:hover::after {
          opacity: 0.12;
        }

        /* ── Icon badge ──────────────────────────────────── */
        .pstat-icon-badge {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          width: 48px; height: 48px;
          border-radius: 14px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-background-medium);
          display: flex; align-items: center; justify-content: center;
          color: var(--pstat-accent);
          transition: background 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pstat-card:hover .pstat-icon-badge {
          background: var(--neutral-background-strong);
          transform: scale(1.08);
        }

        /* ── Text block ──────────────────────────────────── */
        .pstat-body {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 2px;
        }

        .pstat-number {
          font-size: 38px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--neutral-on-background-strong);
          font-variant-numeric: tabular-nums;
          transition: color 0.25s ease;
        }

        .pstat-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--neutral-on-background-strong);
          margin-top: 6px;
          letter-spacing: 0.01em;
        }

        .pstat-sublabel {
          font-size: 11px;
          color: var(--neutral-on-background-weak);
          letter-spacing: 0.01em;
          line-height: 1.4;
        }

        /* ── Divider between cards ───────────────────────── */
        .pstat-divider {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--neutral-alpha-medium) 30%,
            var(--neutral-alpha-medium) 70%,
            transparent 100%
          );
          flex-shrink: 0;
        }

        /* ── Section header ──────────────────────────────── */
        .pstat-header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 14px;
          border-radius: 99px;
          border: 1px solid var(--neutral-alpha-weak);
          background: var(--neutral-background-weak);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--neutral-on-background-weak);
        }

        .pstat-header-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--neutral-on-background-weak);
          opacity: 0.5;
        }

        /* ── Horizontal rule under header ─────────────────── */
        .pstat-section-rule {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
        }
        .pstat-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--neutral-alpha-weak), transparent);
        }
        .pstat-rule-line.right {
          background: linear-gradient(270deg, var(--neutral-alpha-weak), transparent);
        }

        /* ── Wrapper row for cards ─────────────────────────── */
        .pstat-row {
          display: flex;
          flex-direction: row;
          gap: 0;
          width: 100%;
          border: 1px solid var(--neutral-alpha-weak);
          border-radius: 22px;
          overflow: hidden;
          background: var(--neutral-background-weak);
        }

        .pstat-row .pstat-card {
          border: none;
          border-radius: 0;
          background: transparent;
        }

        .pstat-row .pstat-card:hover {
          background: var(--neutral-background-medium);
        }

        @media (max-width: 640px) {
          .pstat-row {
            flex-direction: column;
          }
          .pstat-divider {
            width: 100%;
            height: 1px;
            align-self: auto;
            background: linear-gradient(
              to right,
              transparent 0%,
              var(--neutral-alpha-medium) 30%,
              var(--neutral-alpha-medium) 70%,
              transparent 100%
            );
          }
        }
      `}</style>

      <div
        className="pstat-card"
        style={{ "--pstat-accent": accentColor } as React.CSSProperties}
      >
        <div className="pstat-icon-badge">{icon}</div>
        <div className="pstat-body">
          <div className="pstat-number">
            <AnimNum value={value} suffix={suffix} />
          </div>
          <div className="pstat-label">{label}</div>
          <div className="pstat-sublabel">{sublabel}</div>
        </div>
      </div>
    </>
  );
}

// ─── Icons (refined, slightly thicker) ───────────────────────────────────────
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2.5"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <path d="M2 12.5h8M14 12.5h8"/>
    <path d="M12 12.5v1"/>
  </svg>
);

const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4.586a1 1 0 0 1 .707.293L12 7h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    <path d="M3 10h18" strokeOpacity="0.4"/>
  </svg>
);

const IconPen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    <path d="M15 5l3 3" strokeOpacity="0.4"/>
  </svg>
);

// ─── Accent palette — subtle, works on light & dark ──────────────────────────
const ACCENTS = [
  "var(--brand-solid-strong, #6366f1)",   // indigo
  "var(--accent-solid-strong, #06b6d4)",  // cyan / teal
  "#a78bfa",                              // violet
];

// ─── Main Section ─────────────────────────────────────────────────────────────
export function StatisticsSection({
  settings,
  projectsCount,
  blogsCount,
}: StatisticsProps) {
  const { lang } = useLang();
  const isID = lang === "id";

  const yearsExp = settings?.stats_years_experience ?? 0;

  if (!yearsExp && !projectsCount && !blogsCount) return null;

  const stats = [
    yearsExp > 0 && {
      icon: <IconBriefcase />,
      value: yearsExp,
      suffix: isID ? "+" : "+",
      label: isID ? "Tahun Pengalaman" : "Years of Experience",
      sublabel: isID
        ? "Membangun solusi digital profesional"
        : "Building professional digital solutions",
    },
    projectsCount > 0 && {
      icon: <IconFolder />,
      value: projectsCount,
      label: isID ? "Proyek Dipublikasikan" : "Published Projects",
      sublabel: isID
        ? "Dari web app hingga visualisasi data"
        : "From web apps to data visualization",
    },
    blogsCount > 0 && {
      icon: <IconPen />,
      value: blogsCount,
      label: isID ? "Artikel Diterbitkan" : "Published Articles",
      sublabel: isID
        ? "Insight seputar teknologi & engineering"
        : "Insights on technology & engineering",
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    label: string;
    sublabel: string;
  }[];

  if (stats.length === 0) return null;

  return (
    <RevealFx translateY="12" delay={0.1} fillWidth>
      <style>{`
        .pstat-section {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 0;
        }
      `}</style>

      <div className="pstat-section">
        {/* ── Section header ─────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 36 }}>
          {/* Eyebrow pill */}
          <div className="pstat-header-eyebrow">
            <span className="pstat-header-dot" />
            {isID ? "Rekam Jejak" : "Track Record"}
            <span className="pstat-header-dot" />
          </div>

          {/* Headline */}
          <div style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            textAlign: "center",
            color: "var(--neutral-on-background-strong)",
          }}>
            {isID ? "Angka yang Berbicara" : "Milestones at a Glance"}
          </div>

          {/* Sub-headline */}
          <div style={{
            fontSize: 14,
            color: "var(--neutral-on-background-weak)",
            textAlign: "center",
            maxWidth: 420,
            lineHeight: 1.6,
          }}>
            {isID
              ? "Setiap angka adalah cerminan dari dedikasi, kerja nyata, dan pertumbuhan berkelanjutan."
              : "Each number reflects dedication, real-world output, and continuous professional growth."}
          </div>

          {/* Decorative rule */}
          <div className="pstat-section-rule" style={{ marginTop: 8, maxWidth: 260 }}>
            <div className="pstat-rule-line" />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="var(--neutral-alpha-medium)" />
              <circle cx="6" cy="6" r="5" stroke="var(--neutral-alpha-weak)" strokeWidth="1" fill="none" />
            </svg>
            <div className="pstat-rule-line right" />
          </div>
        </div>

        {/* ── Unified card row ─────────────────────────────────────────── */}
        <div className="pstat-row">
          {stats.map((s, i) => (
            <>
              <StatCard
                key={i}
                index={i}
                accentColor={ACCENTS[i % ACCENTS.length]}
                {...s}
              />
              {i < stats.length - 1 && (
                <div key={`div-${i}`} className="pstat-divider" />
              )}
            </>
          ))}
        </div>
      </div>
    </RevealFx>
  );
}
