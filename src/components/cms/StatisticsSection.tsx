"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Row, Text, RevealFx } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { SiteSettings } from "@/lib/types";

interface StatisticsProps {
  settings: SiteSettings | null;
}

// ─── Count-up ─────────────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 4)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon, value, label, sublabel, color, accent,
}: {
  icon: string; value: number; label: string; sublabel: string;
  color: string; accent: string;
}) {
  return (
    <Column
      flex={1}
      gap="m"
      border="neutral-alpha-weak"
      radius="l"
      padding="l"
      background="surface"
      style={{
        backdropFilter: "blur(8px)",
        minWidth: 200,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent blob */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 80, height: 80, borderRadius: "50%",
        background: accent, opacity: 0.12, pointerEvents: "none",
      }}/>

      <Row gap="m" vertical="center">
        <span style={{ fontSize: 28 }}>{icon}</span>
        <Text variant="label-strong-xs" onBackground="neutral-weak"
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {label}
        </Text>
      </Row>

      <Text style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color }}>
        <AnimatedNumber value={value} />
      </Text>

      <Text variant="body-default-s" onBackground="neutral-weak">
        {sublabel}
      </Text>

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, background: color, opacity: 0.5,
      }}/>
    </Column>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function StatisticsSection({ settings }: StatisticsProps) {
  const { lang } = useLang();
  const isID = lang === "id";

  const projects = settings?.stats_projects ?? 0;
  const certificates = settings?.stats_certificates ?? 0;
  const total = projects + certificates;

  if (!projects && !certificates) return null;

  return (
    <RevealFx translateY="12" delay={0.1} fillWidth>
      <Column
        fillWidth
        gap="xl"
        paddingY="64"
        paddingX="l"
        style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}
      >
        {/* Header */}
        <Column gap="8" align="center" horizontal="center">
          <Text variant="label-strong-xs" style={{
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--brand-on-background-weak)",
          }}>
            {isID ? "Rekam Jejak" : "Track Record"}
          </Text>
          <Text as="h2" variant="display-strong-s" align="center" style={{ lineHeight: 1.1 }}>
            {isID ? "Angka yang Mencerminkan Perjalanan" : "Numbers That Reflect the Journey"}
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center"
            style={{ maxWidth: 460 }}>
            {isID
              ? "Setiap angka adalah cerita — dari baris kode pertama hingga solusi yang berdampak nyata."
              : "Every number tells a story — from the first line of code to solutions that create real impact."}
          </Text>
        </Column>

        {/* Stat Cards */}
        <Row fillWidth gap="l" s={{ direction: "column" }}>
          <StatCard
            icon="🗂️"
            value={projects}
            label={isID ? "Proyek" : "Projects"}
            sublabel={isID ? "Proyek selesai dikerjakan" : "Completed projects"}
            color="var(--brand-background-strong)"
            accent="var(--brand-background-strong)"
          />
          <StatCard
            icon="🏆"
            value={certificates}
            label={isID ? "Sertifikat" : "Certificates"}
            sublabel={isID ? "Sertifikat & pencapaian diraih" : "Certificates & achievements earned"}
            color="var(--accent-background-strong)"
            accent="var(--accent-background-strong)"
          />
        </Row>

        {/* Total Summary Bar */}
        {total > 0 && (
          <Row
            fillWidth
            gap="l"
            border="brand-alpha-weak"
            radius="l"
            padding="l"
            background="surface"
            vertical="center"
            style={{
              background: "linear-gradient(135deg, var(--brand-alpha-weak), var(--neutral-background-medium))",
              backdropFilter: "blur(8px)",
            }}
            s={{ direction: "column" }}
          >
            <Column gap="4" flex={1}>
              <Text variant="label-strong-xs" style={{
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: "var(--brand-on-background-weak)",
              }}>
                {isID ? "Total Pencapaian" : "Total Achievements"}
              </Text>
              <Text variant="display-strong-m" onBackground="brand-medium">
                <AnimatedNumber value={total} />
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {isID ? "Proyek & sertifikat gabungan" : "Combined projects & certificates"}
              </Text>
            </Column>

            {/* Progress bars */}
            <Column flex={2} gap="m">
              {[
                { label: isID ? "Proyek" : "Projects", value: projects, color: "var(--brand-background-strong)" },
                { label: isID ? "Sertifikat" : "Certificates", value: certificates, color: "var(--accent-background-strong)" },
              ].map((item) => (
                <Column key={item.label} gap="s">
                  <Row fillWidth horizontal="between">
                    <Text variant="label-default-xs" onBackground="neutral-weak">{item.label}</Text>
                    <Text variant="label-strong-xs" style={{ color: item.color }}>{item.value}</Text>
                  </Row>
                  <div style={{ height: 6, borderRadius: 99, background: "var(--neutral-alpha-weak)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: item.color,
                      width: `${total > 0 ? Math.round((item.value / total) * 100) : 0}%`,
                      transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
                    }}/>
                  </div>
                </Column>
              ))}
            </Column>
          </Row>
        )}
      </Column>
    </RevealFx>
  );
}
