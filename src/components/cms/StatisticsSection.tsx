"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Row, Text, RevealFx } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { SiteSettings } from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface StatisticsProps {
  settings: SiteSettings | null;
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
            const eased = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

// ─── Animated number ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Radial progress ring ─────────────────────────────────────────────────────
function RadialRing({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: React.ReactNode;
  sublabel: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const ref = useRef<SVGCircleElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 1600;
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const ratio = max > 0 ? Math.min(value / max, 1) : 0;
            setOffset(circ - eased * ratio * circ);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, max, circ]);

  return (
    <Column align="center" gap="8">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--neutral-alpha-weak)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            ref={ref}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 6px ${color}44)` }}
          />
        </svg>
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: "var(--neutral-on-background-strong)" }}>
            {label}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 12, color: "var(--neutral-on-background-weak)", textAlign: "center", maxWidth: 100 }}>
        {sublabel}
      </span>
    </Column>
  );
}

// ─── Custom bar tooltip ───────────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--neutral-background-strong)",
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
          color: "var(--neutral-on-background-strong)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: "var(--brand-on-background-medium)" }}>{payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

// ─── Custom pie tooltip ───────────────────────────────────────────────────────
const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--neutral-background-strong)",
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
          color: "var(--neutral-on-background-strong)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{payload[0].name}</div>
        <div style={{ color: "var(--brand-on-background-medium)" }}>{payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

// ─── Main Section ─────────────────────────────────────────────────────────────
export function StatisticsSection({ settings }: StatisticsProps) {
  const { lang } = useLang();

  const projects = settings?.stats_projects ?? 0;
  const certificates = settings?.stats_certificates ?? 0;
  const monthlyVisitors = settings?.stats_monthly_visitors ?? 0;
  const totalVisitors = settings?.stats_total_visitors ?? 0;

  const isID = lang === "id";

  // Bar chart — monthly vs total visitors (normalized for display)
  const barData = [
    {
      name: isID ? "Proyek" : "Projects",
      value: projects,
      fill: "var(--brand-background-strong)",
    },
    {
      name: isID ? "Sertifikat" : "Certificates",
      value: certificates,
      fill: "var(--accent-background-strong)",
    },
    {
      name: isID ? "Pengunjung/Bln" : "Monthly Visitors",
      value: monthlyVisitors,
      fill: "url(#barGrad1)",
    },
    {
      name: isID ? "Total Pengunjung" : "Total Visitors",
      value: totalVisitors,
      fill: "url(#barGrad2)",
    },
  ];

  // Pie chart — Projects vs Certificates ratio
  const pieData = [
    { name: isID ? "Proyek" : "Projects", value: Math.max(projects, 1) },
    { name: isID ? "Sertifikat" : "Certificates", value: Math.max(certificates, 1) },
  ];

  const PIE_COLORS = ["var(--brand-background-strong)", "var(--accent-background-strong)"];

  // Metric cards
  const metrics = [
    {
      icon: "🗂️",
      value: projects,
      max: Math.max(projects + certificates, 1),
      label: <AnimatedNumber value={projects} />,
      sublabel: isID ? "Proyek Selesai" : "Projects Completed",
      color: "var(--brand-background-strong)",
    },
    {
      icon: "🏆",
      value: certificates,
      max: Math.max(projects + certificates, 1),
      label: <AnimatedNumber value={certificates} />,
      sublabel: isID ? "Sertifikat Diraih" : "Certificates Earned",
      color: "var(--accent-background-strong)",
    },
    {
      icon: "👥",
      value: monthlyVisitors,
      max: Math.max(totalVisitors, 1),
      label: (
        <>
          <AnimatedNumber value={monthlyVisitors} />
        </>
      ),
      sublabel: isID ? "Pengunjung / Bulan" : "Monthly Visitors",
      color: "#22d3ee",
    },
    {
      icon: "🌐",
      value: totalVisitors,
      max: Math.max(totalVisitors, 1),
      label: <AnimatedNumber value={totalVisitors} />,
      sublabel: isID ? "Total Pengunjung" : "Total Visitors",
      color: "#a78bfa",
    },
  ];

  // Don't render if all zeros
  if (!projects && !certificates && !monthlyVisitors && !totalVisitors) return null;

  return (
    <RevealFx translateY="12" delay={0.1} fillWidth>
      <Column
        fillWidth
        gap="xl"
        paddingY="64"
        paddingX="l"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        {/* Section Header */}
        <Column gap="8" align="center">
          <Text
            variant="label-strong-xs"
            style={{
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--brand-on-background-weak)",
            }}
          >
            {isID ? "Rekam Jejak" : "Track Record"}
          </Text>
          <Text
            as="h2"
            variant="display-strong-s"
            align="center"
            style={{ lineHeight: 1.1 }}
          >
            {isID
              ? "Angka yang Mencerminkan Perjalanan"
              : "Numbers That Reflect the Journey"}
          </Text>
          <Text
            variant="body-default-m"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: 480 }}
          >
            {isID
              ? "Setiap angka adalah cerita — dari baris kode pertama hingga solusi yang berdampak nyata."
              : "Every number tells a story — from the first line of code to solutions that create real impact."}
          </Text>
        </Column>

        {/* Radial Rings — 4 metrics */}
        <Row fillWidth gap="l" horizontal="center" wrap>
          {metrics.map((m, i) => (
            <RadialRing
              key={i}
              value={m.value}
              max={m.max}
              color={m.color}
              label={m.label}
              sublabel={m.sublabel}
            />
          ))}
        </Row>

        {/* Charts Row */}
        <Row fillWidth gap="l" s={{ direction: "column" }}>
          {/* Bar Chart */}
          <Column
            flex={3}
            gap="m"
            border="neutral-alpha-weak"
            radius="l"
            padding="l"
            background="surface"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <Column gap="4">
              <Text variant="label-strong-m">
                {isID ? "Distribusi Metrik" : "Metric Distribution"}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {isID
                  ? "Perbandingan seluruh pencapaian secara visual"
                  : "Visual comparison of all achievements"}
              </Text>
            </Column>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <defs>
                    <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--neutral-alpha-weak)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "var(--neutral-on-background-weak)",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "var(--neutral-on-background-weak)",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: "var(--neutral-alpha-weak)" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Column>

          {/* Pie Chart */}
          <Column
            flex={2}
            gap="m"
            border="neutral-alpha-weak"
            radius="l"
            padding="l"
            background="surface"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <Column gap="4">
              <Text variant="label-strong-m">
                {isID ? "Komposisi Karya" : "Work Composition"}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {isID ? "Proyek vs Sertifikat" : "Projects vs Certificates"}
              </Text>
            </Column>
            <div style={{ height: 180, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index]}
                        style={{ filter: "url(#glow)", outline: "none" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  paddingTop: 8,
                }}
              >
                <Column align="center" gap="2">
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--neutral-on-background-strong)",
                    }}
                  >
                    {projects + certificates}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--neutral-on-background-weak)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {isID ? "Total" : "Total"}
                  </span>
                </Column>
              </div>
            </div>
            {/* Legend */}
            <Column gap="8">
              {pieData.map((entry, i) => (
                <Row key={i} gap="8" vertical="center">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: PIE_COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {entry.name}
                  </Text>
                  <Text
                    variant="label-strong-xs"
                    style={{ marginLeft: "auto", color: PIE_COLORS[i] }}
                  >
                    {projects + certificates > 0
                      ? Math.round((entry.value / (projects + certificates)) * 100)
                      : 0}
                    %
                  </Text>
                </Row>
              ))}
            </Column>
          </Column>
        </Row>

        {/* Visitor highlight bar */}
        {(monthlyVisitors > 0 || totalVisitors > 0) && (
          <Row
            fillWidth
            gap="l"
            border="brand-alpha-weak"
            radius="l"
            padding="l"
            background="surface"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-alpha-weak), var(--neutral-background-medium))",
              backdropFilter: "blur(8px)",
            }}
            s={{ direction: "column" }}
          >
            <Column flex={1} gap="4">
              <Text
                variant="label-strong-xs"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--brand-on-background-weak)",
                }}
              >
                {isID ? "Jangkauan Bulanan" : "Monthly Reach"}
              </Text>
              <Text variant="display-strong-m" onBackground="brand-medium">
                <AnimatedNumber value={monthlyVisitors} />
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {isID
                  ? "pengunjung unik aktif setiap bulan"
                  : "unique active visitors per month"}
              </Text>
            </Column>
            <div
              style={{
                width: 1,
                background: "var(--brand-alpha-weak)",
                alignSelf: "stretch",
              }}
              className="hide-mobile"
            />
            <Column flex={1} gap="4">
              <Text
                variant="label-strong-xs"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--neutral-on-background-weak)",
                }}
              >
                {isID ? "Total Seluruh Waktu" : "All-Time Total"}
              </Text>
              <Text
                variant="display-strong-m"
                style={{ color: "#a78bfa" }}
              >
                <AnimatedNumber value={totalVisitors} />
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {isID
                  ? "kunjungan tercatat sejak pertama rilis"
                  : "recorded visits since first launch"}
              </Text>
            </Column>
          </Row>
        )}
      </Column>
    </RevealFx>
  );
}
