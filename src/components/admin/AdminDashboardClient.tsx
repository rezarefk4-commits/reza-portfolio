"use client";

import { Column, Row, Text, Card, Heading, Button } from "@once-ui-system/core";
import { format } from "date-fns";

interface DashboardStats {
  counts: { projects: number; blogs: number; certificates: number; media: number };
  visitors: { today: number; month: number; total: number };
  recentProjects: Array<{ id: string; title_id: string; slug: string; published: boolean; created_at: string }>;
  recentBlogs: Array<{ id: string; title_id: string; slug: string; published: boolean; created_at: string }>;
  activityLogs: Array<{ id: string; action: string; entity_type: string; created_at: string }>;
}

const statCards = (counts: DashboardStats["counts"]) => [
  { label: "Projects", value: counts.projects, href: "/reza-control/projects", emoji: "🗂️" },
  { label: "Blog Posts", value: counts.blogs, href: "/reza-control/blogs", emoji: "📝" },
  { label: "Certificates", value: counts.certificates, href: "/reza-control/certificates", emoji: "🏆" },
  { label: "Media Files", value: counts.media, href: "/reza-control/media", emoji: "🖼️" },
];

const visitorCards = (visitors: DashboardStats["visitors"]) => [
  { label: "Hari Ini", value: visitors.today },
  { label: "Bulan Ini", value: visitors.month },
  { label: "Total", value: visitors.total },
];

export function AdminDashboardClient({ stats }: { stats: DashboardStats }) {
  return (
    <Column fillWidth gap="xl">
      {/* Content Counts */}
      <Column gap="m">
        <Text variant="label-strong-m" onBackground="neutral-weak">
          KONTEN
        </Text>
        <Row gap="m" wrap>
          {statCards(stats.counts).map((card) => (
            <Card
              key={card.label}
              href={card.href}
              border="neutral-alpha-weak"
              background="surface"
              radius="m"
              padding="l"
              transition="micro-medium"
              style={{ flex: "1 1 160px", minWidth: "140px" }}
            >
              <Column gap="8">
                <Text style={{ fontSize: "24px" }}>{card.emoji}</Text>
                <Text variant="display-strong-l" onBackground="brand-medium">
                  {card.value}
                </Text>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  {card.label}
                </Text>
              </Column>
            </Card>
          ))}
        </Row>
      </Column>

      {/* Visitor Stats */}
      <Column gap="m">
        <Text variant="label-strong-m" onBackground="neutral-weak">
          PENGUNJUNG
        </Text>
        <Row gap="m" wrap>
          {visitorCards(stats.visitors).map((card) => (
            <Card
              key={card.label}
              border="neutral-alpha-weak"
              background="surface"
              radius="m"
              padding="l"
              style={{ flex: "1 1 140px", minWidth: "120px" }}
            >
              <Column gap="8">
                <Text variant="display-strong-l" onBackground="accent-medium">
                  {card.value.toLocaleString()}
                </Text>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  {card.label}
                </Text>
              </Column>
            </Card>
          ))}
        </Row>
      </Column>

      {/* Recent Activity */}
      <Row gap="xl" s={{ direction: "column" }}>
        {/* Recent Projects */}
        <Column flex={1} gap="m">
          <Row fillWidth horizontal="between" vertical="center">
            <Text variant="label-strong-m" onBackground="neutral-weak">
              PROYEK TERBARU
            </Text>
            <Button href="/reza-control/projects" variant="tertiary" size="s" arrowIcon>
              Lihat semua
            </Button>
          </Row>
          <Column gap="8">
            {stats.recentProjects.length === 0 && (
              <Text variant="body-default-s" onBackground="neutral-weak">
                Belum ada proyek.
              </Text>
            )}
            {stats.recentProjects.map((p) => (
              <Card
                key={p.id}
                href={`/reza-control/projects/${p.id}`}
                fillWidth
                border="neutral-alpha-weak"
                background="transparent"
                padding="m"
                radius="m"
                transition="micro-medium"
              >
                <Row fillWidth horizontal="between" vertical="center">
                  <Column gap="2" flex={1}>
                    <Text
                      variant="body-default-m"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "240px",
                      }}
                    >
                      {p.title_id}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {format(new Date(p.created_at), "d MMM yyyy")}
                    </Text>
                  </Column>
                  <Text
                    variant="label-strong-xs"
                    onBackground={p.published ? "brand-weak" : "neutral-weak"}
                  >
                    {p.published ? "Published" : "Draft"}
                  </Text>
                </Row>
              </Card>
            ))}
          </Column>
        </Column>

        {/* Recent Blogs */}
        <Column flex={1} gap="m">
          <Row fillWidth horizontal="between" vertical="center">
            <Text variant="label-strong-m" onBackground="neutral-weak">
              BLOG TERBARU
            </Text>
            <Button href="/reza-control/blogs" variant="tertiary" size="s" arrowIcon>
              Lihat semua
            </Button>
          </Row>
          <Column gap="8">
            {stats.recentBlogs.length === 0 && (
              <Text variant="body-default-s" onBackground="neutral-weak">
                Belum ada blog.
              </Text>
            )}
            {stats.recentBlogs.map((b) => (
              <Card
                key={b.id}
                href={`/reza-control/blogs/${b.id}`}
                fillWidth
                border="neutral-alpha-weak"
                background="transparent"
                padding="m"
                radius="m"
                transition="micro-medium"
              >
                <Row fillWidth horizontal="between" vertical="center">
                  <Column gap="2" flex={1}>
                    <Text
                      variant="body-default-m"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "240px",
                      }}
                    >
                      {b.title_id}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {format(new Date(b.created_at), "d MMM yyyy")}
                    </Text>
                  </Column>
                  <Text
                    variant="label-strong-xs"
                    onBackground={b.published ? "brand-weak" : "neutral-weak"}
                  >
                    {b.published ? "Published" : "Draft"}
                  </Text>
                </Row>
              </Card>
            ))}
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
