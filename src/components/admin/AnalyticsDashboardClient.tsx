"use client";

import { Column, Row, Text, Card } from "@once-ui-system/core";
import {
  AreaChart,
  Area,
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
  Legend,
} from "recharts";

interface AnalyticsDashboardClientProps {
  visitorStats: { today: number; month: number; total: number };
  topProjects: Array<{
    project_id: string;
    count: number;
    project: { title_id: string; title_en: string; slug: string };
  }>;
  topBlogs: Array<{
    blog_id: string;
    count: number;
    blog: { title_id: string; title_en: string; slug: string };
  }>;
  dailyData: Array<{ day: string; visits: number }>;
  recentVisitors: Array<{ page: string; created_at: string; referrer: string | null }>;
}

// ─── Shared tooltip style ──────────────────────────────────────────────────────
const tooltipStyle = {
  background: "var(--neutral-background-strong)",
  border: "1px solid var(--neutral-alpha-medium)",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 12,
  color: "var(--neutral-on-background-strong)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div style={tooltipStyle}>
        {label && <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11, opacity: 0.6 }}>{label}</div>}
        {payload.map((p, i) => (
          <div key={i} style={{ color: "var(--brand-on-background-medium)", fontWeight: 600 }}>
            {p.value.toLocaleString()} {p.name || "visits"}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PIE_COLORS = ["var(--brand-background-strong)", "var(--accent-background-strong)", "#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#f87171", "#60a5fa"];

export function AnalyticsDashboardClient({
  visitorStats,
  topProjects,
  topBlogs,
  dailyData,
  recentVisitors,
}: AnalyticsDashboardClientProps) {
  const totalContent = topProjects.length + topBlogs.length;

  // Content view pie data
  const pieData = [
    ...topProjects.slice(0, 4).map((p) => ({
      name: (p.project.title_id || "Project").slice(0, 20),
      value: p.count,
    })),
    ...topBlogs.slice(0, 4).map((b) => ({
      name: (b.blog.title_id || "Blog").slice(0, 20),
      value: b.count,
    })),
  ].sort((a, b) => b.value - a.value);

  // Horizontal bar for top projects
  const projectBarData = topProjects.slice(0, 6).map((p) => ({
    name: (p.project.title_id || "Project").slice(0, 18) + (p.project.title_id?.length > 18 ? "…" : ""),
    views: p.count,
  }));

  // Horizontal bar for top blogs
  const blogBarData = topBlogs.slice(0, 6).map((b) => ({
    name: (b.blog.title_id || "Blog").slice(0, 18) + (b.blog.title_id?.length > 18 ? "…" : ""),
    views: b.count,
  }));

  return (
    <Column fillWidth gap="xl">
      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <Row gap="m" wrap>
        {[
          { label: "Pengunjung Hari Ini", value: visitorStats.today, color: "var(--brand-on-background-medium)", icon: "☀️" },
          { label: "Pengunjung Bulan Ini", value: visitorStats.month, color: "#22d3ee", icon: "📅" },
          { label: "Total Pengunjung", value: visitorStats.total, color: "#a78bfa", icon: "🌐" },
        ].map((card) => (
          <Card
            key={card.label}
            border="neutral-alpha-weak"
            background="surface"
            padding="l"
            radius="l"
            style={{ flex: "1 1 180px", minWidth: 160 }}
          >
            <Column gap="8">
              <Row gap="8" vertical="center">
                <span style={{ fontSize: 18 }}>{card.icon}</span>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {card.label}
                </Text>
              </Row>
              <Text
                variant="display-strong-l"
                style={{ color: card.color, fontVariantNumeric: "tabular-nums" }}
              >
                {card.value.toLocaleString()}
              </Text>
            </Column>
          </Card>
        ))}
      </Row>

      {/* ── Area Chart – 7 hari terakhir ───────────────────────────────── */}
      <Column
        border="neutral-alpha-weak"
        background="surface"
        radius="l"
        padding="l"
        gap="m"
      >
        <Column gap="4">
          <Text variant="label-strong-m">Tren Kunjungan — 7 Hari Terakhir</Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Jumlah halaman yang dikunjungi per hari
          </Text>
        </Column>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-background-strong)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--brand-background-strong)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-alpha-weak)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--brand-background-strong)"
                strokeWidth={2}
                fill="url(#areaGrad)"
                dot={{ r: 3, fill: "var(--brand-background-strong)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--brand-background-strong)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Column>

      {/* ── Bar Charts Row ──────────────────────────────────────────────── */}
      <Row gap="l" s={{ direction: "column" }}>
        {/* Top Projects Bar */}
        <Column
          flex={1}
          border="neutral-alpha-weak"
          background="surface"
          radius="l"
          padding="l"
          gap="m"
        >
          <Text variant="label-strong-m">🗂️ Project Terpopuler</Text>
          {projectBarData.length === 0 ? (
            <Text variant="body-default-xs" onBackground="neutral-weak">Belum ada data views.</Text>
          ) : (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectBarData}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 4, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    <linearGradient id="projectBarGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--brand-background-strong)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-alpha-weak)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--neutral-alpha-weak)" }} />
                  <Bar dataKey="views" fill="url(#projectBarGrad)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Column>

        {/* Top Blogs Bar */}
        <Column
          flex={1}
          border="neutral-alpha-weak"
          background="surface"
          radius="l"
          padding="l"
          gap="m"
        >
          <Text variant="label-strong-m">📝 Blog Terpopuler</Text>
          {blogBarData.length === 0 ? (
            <Text variant="body-default-xs" onBackground="neutral-weak">Belum ada data views.</Text>
          ) : (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={blogBarData}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 4, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    <linearGradient id="blogBarGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--accent-background-strong)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-alpha-weak)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "var(--neutral-on-background-weak)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--neutral-alpha-weak)" }} />
                  <Bar dataKey="views" fill="url(#blogBarGrad)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Column>
      </Row>

      {/* ── Pie Chart – Content Distribution ───────────────────────────── */}
      {pieData.length > 0 && (
        <Column border="neutral-alpha-weak" background="surface" radius="l" padding="l" gap="m">
          <Column gap="4">
            <Text variant="label-strong-m">Distribusi Views Konten</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Perbandingan jumlah views antar konten populer
            </Text>
          </Column>
          <Row gap="l" vertical="center" s={{ direction: "column" }}>
            <div style={{ height: 220, minWidth: 220, flex: "0 0 220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <Column gap="8" flex={1}>
              {pieData.map((entry, i) => (
                <Row key={i} gap="8" vertical="center" fillWidth>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: PIE_COLORS[i % PIE_COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    variant="body-default-xs"
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.name}
                  </Text>
                  <Text
                    variant="label-strong-xs"
                    style={{ color: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }}
                  >
                    {entry.value}
                  </Text>
                </Row>
              ))}
            </Column>
          </Row>
        </Column>
      )}

      {/* ── Recent Visitors Log ─────────────────────────────────────────── */}
      <Column border="neutral-alpha-weak" background="surface" radius="l" padding="l" gap="m">
        <Text variant="label-strong-m">📋 Log Kunjungan Terbaru</Text>
        <Column gap="4">
          {recentVisitors.length === 0 && (
            <Text variant="body-default-xs" onBackground="neutral-weak">Belum ada data.</Text>
          )}
          {recentVisitors.map((v, i) => (
            <Row
              key={i}
              fillWidth
              horizontal="between"
              vertical="center"
              gap="12"
              style={{
                padding: "8px 0",
                borderBottom: i < recentVisitors.length - 1 ? "1px solid var(--neutral-alpha-weak)" : "none",
              }}
            >
              <Text
                variant="body-default-xs"
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                {v.page}
              </Text>
              {v.referrer && (
                <Text
                  variant="body-default-xs"
                  onBackground="neutral-weak"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 120,
                    fontSize: 10,
                  }}
                >
                  via {v.referrer.replace(/^https?:\/\//, "").slice(0, 20)}
                </Text>
              )}
              <Text
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{ flexShrink: 0, fontSize: 10 }}
              >
                {new Date(v.created_at).toLocaleString("id-ID", {
                  timeZone: "Asia/Makassar",
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </Row>
          ))}
        </Column>
      </Column>
    </Column>
  );
}
