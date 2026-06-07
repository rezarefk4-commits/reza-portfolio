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
function useCountUp(end: number, duration = 1600) {
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
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
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

// ─── Single Stat Item ─────────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  suffix,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
}) {
  return (
    <>
      <style>{`
        .stat-item {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 32px 24px;
          border: 1px solid var(--neutral-alpha-weak);
          border-radius: 16px;
          background: var(--neutral-background-weak);
          transition: border-color 0.25s ease, background 0.25s ease;
          min-width: 160px;
          overflow: hidden;
        }
        .stat-item::before {
          content: "";
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 40%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--neutral-alpha-medium), transparent);
          pointer-events: none;
        }
        .stat-item:hover {
          border-color: var(--neutral-alpha-medium);
          background: var(--neutral-background-medium);
        }

        .stat-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--neutral-alpha-medium);
          background: var(--neutral-background-strong);
          color: var(--neutral-on-background-strong);
          flex-shrink: 0;
        }
      `}</style>

      <div className="stat-item">
        <div className="stat-icon-wrap">{icon}</div>

        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--neutral-on-background-strong)",
          }}
        >
          <AnimNum value={value} suffix={suffix} />
        </span>

        <Column gap="4" horizontal="center" align="center">
          <Text
            variant="label-strong-s"
            style={{ textAlign: "center" }}
          >
            {label}
          </Text>
          <Text
            variant="body-default-xs"
            onBackground="neutral-weak"
            style={{ textAlign: "center" }}
          >
            {sublabel}
          </Text>
        </Column>
      </div>
    </>
  );
}

// ─── Icons (monoline, no color) ───────────────────────────────────────────────
const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/>
    <path d="M2 12h8M14 12h8"/>
  </svg>
);

const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconPen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ─── Main Section ─────────────────────────────────────────────────────────────
export function StatisticsSection({
  settings,
  projectsCount,
  blogsCount,
}: StatisticsProps) {
  const { lang } = useLang();
  const isID = lang === "id";

  const yearsExp = settings?.stats_years_experience ?? 0;

  // Only show if there's at least one stat to display
  if (!yearsExp && !projectsCount && !blogsCount) return null;

  const stats = [
    yearsExp > 0 && {
      icon: <IconBriefcase />,
      value: yearsExp,
      suffix: isID ? "+ Thn" : "+ Yrs",
      label: isID ? "Pengalaman" : "Experience",
      sublabel: isID ? "Tahun di industri" : "Years in the industry",
    },
    projectsCount > 0 && {
      icon: <IconFolder />,
      value: projectsCount,
      label: isID ? "Proyek" : "Projects",
      sublabel: isID ? "Total proyek dipublikasikan" : "Published projects",
    },
    blogsCount > 0 && {
      icon: <IconPen />,
      value: blogsCount,
      label: isID ? "Tulisan" : "Articles",
      sublabel: isID ? "Artikel telah diterbitkan" : "Articles published",
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
      <Column
        fillWidth
        gap="xl"
        paddingY="64"
        paddingX="l"
        style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}
      >
        {/* Header */}
        <Column gap="8" horizontal="center" align="center">
          <Text
            variant="label-strong-xs"
            onBackground="neutral-weak"
            style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}
          >
            {isID ? "Perjalanan" : "By the Numbers"}
          </Text>
          <Text
            as="h2"
            variant="display-strong-s"
            style={{ textAlign: "center", lineHeight: 1.15 }}
          >
            {isID ? "Angka yang Berbicara" : "Numbers That Speak"}
          </Text>
        </Column>

        {/* Stat grid */}
        <Row
          fillWidth
          gap="m"
          style={{ flexWrap: "wrap" }}
          s={{ direction: "column" }}
        >
          {stats.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </Row>
      </Column>
    </RevealFx>
  );
}
