"use client";

import { Column, Row, Text, Card, Heading, Button } from "@once-ui-system/core";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface DashboardStats {
  counts: { projects: number; blogs: number; certificates: number; media: number };
  visitors: { today: number; month: number; total: number };
  recentProjects: Array<{ id: string; title_id: string; slug: string; published: boolean; created_at: string }>;
  recentBlogs: Array<{ id: string; title_id: string; slug: string; published: boolean; created_at: string }>;
  activityLogs: Array<{ id: string; action: string; entity_type: string; created_at: string }>;
}

const ContentIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    projects: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7a2 2 0 0 1 2-2h4l2 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
      </svg>
    ),
    blogs: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    certificates: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/><path d="M9 21v-4l3 1 3-1v4"/><path d="M6 13.18A7 7 0 0 0 5 17v4"/>
        <path d="M18 13.18A7 7 0 0 1 19 17v4"/>
      </svg>
    ),
    media: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  };
  return <span style={{ color: "var(--brand-on-background-strong)", display: "flex" }}>{icons[type]}</span>;
};

const VisitorIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    today: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    month: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    total: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  };
  return <span style={{ color: "var(--accent-on-background-medium)", display: "flex" }}>{icons[type]}</span>;
};

export function AdminDashboardClient({ stats }: { stats: DashboardStats }) {
  const router = useRouter();

  const contentCards = [
    { key: "projects",     label: "Projects",      value: stats.counts.projects,     href: "/reza-control/projects",     desc: "Proyek aktif" },
    { key: "blogs",        label: "Blog Posts",     value: stats.counts.blogs,        href: "/reza-control/blogs",        desc: "Artikel tersimpan" },
    { key: "certificates", label: "Certificates",   value: stats.counts.certificates, href: "/reza-control/certificates", desc: "Sertifikat" },
    { key: "media",        label: "Media Files",    value: stats.counts.media,        href: "/reza-control/media",        desc: "File media" },
  ];

  const visitorCards = [
    { key: "today",  label: "Pengunjung Hari Ini", value: stats.visitors.today,  sub: "Sejak tengah malam" },
    { key: "month",  label: "Bulan Ini",           value: stats.visitors.month,  sub: "30 hari terakhir" },
    { key: "total",  label: "Total Pengunjung",    value: stats.visitors.total,  sub: "Sepanjang waktu" },
  ];

  return (
    <Column fillWidth gap="xl">

      {/* ── Content Stats ─────────────────────────── */}
      <Column gap="m">
        <Row fillWidth horizontal="between" vertical="center">
          <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: "0.08em" }}>
            KONTEN
          </Text>
        </Row>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "12px",
        }}>
          {contentCards.map((card) => (
            <button
              key={card.key}
              onClick={() => router.push(card.href)}
              style={{
                all: "unset",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid var(--neutral-alpha-weak)",
                background: "var(--neutral-background-weak)",
                cursor: "pointer",
                transition: "background 0.15s, transform 0.15s, box-shadow 0.15s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--neutral-alpha-weak)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--neutral-background-weak)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {/* Icon box */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "var(--brand-alpha-weak)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ContentIcon type={card.key} />
              </div>
              {/* Number */}
              <div>
                <div style={{
                  fontSize: "2rem", fontWeight: 700, lineHeight: 1,
                  color: "var(--neutral-on-background-strong)",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {card.value.toLocaleString()}
                </div>
                <div style={{
                  fontSize: "13px", fontWeight: 600,
                  color: "var(--neutral-on-background-medium)",
                  marginTop: 4,
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "var(--neutral-on-background-weak)",
                  marginTop: 2,
                }}>
                  {card.desc}
                </div>
              </div>
              {/* Arrow */}
              <div style={{
                position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                color: "var(--neutral-on-background-weak)", opacity: 0.5,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </button>
          ))}
        </div>
      </Column>

      {/* ── Visitor Stats ─────────────────────────── */}
      <Column gap="m">
        <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: "0.08em" }}>
          STATISTIK PENGUNJUNG
        </Text>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px",
        }}>
          {visitorCards.map((card) => (
            <div
              key={card.key}
              style={{
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid var(--neutral-alpha-weak)",
                background: "var(--neutral-background-weak)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--accent-alpha-weak)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <VisitorIcon type={card.key} />
              </div>
              <div>
                <div style={{
                  fontSize: "1.75rem", fontWeight: 700, lineHeight: 1,
                  color: "var(--neutral-on-background-strong)",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {card.value.toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--neutral-on-background-medium)", marginTop: 4 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--neutral-on-background-weak)", marginTop: 2 }}>
                  {card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Column>

      {/* ── Recent Content ─────────────────────────── */}
      <Row gap="xl" s={{ direction: "column" }}>
        {/* Recent Projects */}
        <Column flex={1} gap="m">
          <Row fillWidth horizontal="between" vertical="center">
            <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: "0.08em" }}>
              PROYEK TERBARU
            </Text>
            <Button href="/reza-control/projects" variant="tertiary" size="s" arrowIcon>
              Lihat semua
            </Button>
          </Row>
          <Column gap="8" style={{
            background: "var(--neutral-background-weak)",
            borderRadius: 16, border: "1px solid var(--neutral-alpha-weak)",
            overflow: "hidden",
          }}>
            {stats.recentProjects.length === 0 ? (
              <div style={{ padding: "24px 20px", textAlign: "center" }}>
                <Text variant="body-default-s" onBackground="neutral-weak">Belum ada proyek.</Text>
              </div>
            ) : (
              stats.recentProjects.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/reza-control/projects/${p.id}`)}
                  style={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    cursor: "pointer",
                    borderBottom: i < stats.recentProjects.length - 1 ? "1px solid var(--neutral-alpha-weak)" : "none",
                    transition: "background 0.12s",
                    gap: 12,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--neutral-alpha-weak)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: "13.5px", fontWeight: 500,
                      color: "var(--neutral-on-background-strong)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {p.title_id}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--neutral-on-background-weak)" }}>
                      {format(new Date(p.created_at), "d MMM yyyy")}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: 20, flexShrink: 0,
                    background: p.published ? "var(--brand-alpha-weak)" : "var(--neutral-alpha-weak)",
                    color: p.published ? "var(--brand-on-background-strong)" : "var(--neutral-on-background-weak)",
                  }}>
                    {p.published ? "Tayang" : "Draft"}
                  </span>
                </button>
              ))
            )}
          </Column>
        </Column>

        {/* Recent Blogs */}
        <Column flex={1} gap="m">
          <Row fillWidth horizontal="between" vertical="center">
            <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: "0.08em" }}>
              BLOG TERBARU
            </Text>
            <Button href="/reza-control/blogs" variant="tertiary" size="s" arrowIcon>
              Lihat semua
            </Button>
          </Row>
          <Column gap="8" style={{
            background: "var(--neutral-background-weak)",
            borderRadius: 16, border: "1px solid var(--neutral-alpha-weak)",
            overflow: "hidden",
          }}>
            {stats.recentBlogs.length === 0 ? (
              <div style={{ padding: "24px 20px", textAlign: "center" }}>
                <Text variant="body-default-s" onBackground="neutral-weak">Belum ada blog.</Text>
              </div>
            ) : (
              stats.recentBlogs.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => router.push(`/reza-control/blogs/${b.id}`)}
                  style={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    cursor: "pointer",
                    borderBottom: i < stats.recentBlogs.length - 1 ? "1px solid var(--neutral-alpha-weak)" : "none",
                    transition: "background 0.12s",
                    gap: 12,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--neutral-alpha-weak)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: "13.5px", fontWeight: 500,
                      color: "var(--neutral-on-background-strong)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {b.title_id}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--neutral-on-background-weak)" }}>
                      {format(new Date(b.created_at), "d MMM yyyy")}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: 20, flexShrink: 0,
                    background: b.published ? "var(--brand-alpha-weak)" : "var(--neutral-alpha-weak)",
                    color: b.published ? "var(--brand-on-background-strong)" : "var(--neutral-on-background-weak)",
                  }}>
                    {b.published ? "Tayang" : "Draft"}
                  </span>
                </button>
              ))
            )}
          </Column>
        </Column>
      </Row>

      {/* ── Quick Actions ─────────────────────────── */}
      <Column gap="m">
        <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: "0.08em" }}>
          AKSI CEPAT
        </Text>
        <Row gap="m" wrap>
          {[
            { label: "Proyek Baru",      href: "/reza-control/projects/new",      color: "var(--brand-alpha-weak)",  textColor: "var(--brand-on-background-strong)" },
            { label: "Blog Baru",        href: "/reza-control/blogs/new",         color: "var(--accent-alpha-weak)", textColor: "var(--accent-on-background-strong)" },
            { label: "Sertifikat Baru",  href: "/reza-control/certificates/new",  color: "var(--success-alpha-weak)", textColor: "var(--success-on-background-strong)" },
            { label: "Edit Profil",      href: "/reza-control/about",             color: "var(--neutral-alpha-weak)", textColor: "var(--neutral-on-background-strong)" },
          ].map((action) => (
            <button
              key={action.href}
              onClick={() => router.push(action.href)}
              style={{
                all: "unset",
                padding: "12px 20px",
                borderRadius: 12,
                background: action.color,
                color: action.textColor,
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {action.label}
            </button>
          ))}
        </Row>
      </Column>

    </Column>
  );
}
