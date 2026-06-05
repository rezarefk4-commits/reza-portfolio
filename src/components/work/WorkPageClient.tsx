"use client";

import { useState, useEffect, useRef } from "react";
import { Column, Row, Text } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { Project, ProjectCategory } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";

const CATEGORIES: ("All" | ProjectCategory)[] = [
  "All",
  "Web App",
  "Mobile App",
  "Data Visualization",
  "Creativity",
];

interface WorkPageClientProps {
  projects: Project[];
}

export function WorkPageClient({ projects }: WorkPageClientProps) {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const [isChanging, setIsChanging] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const categoryLabel = (c: "All" | ProjectCategory) => {
    if (c === "All") return lang === "en" ? "All" : "Semua";
    return c;
  };

  // Animate cards when category changes
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];

    // Reset to invisible
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(44px) scale(0.97)";
      card.style.filter = "blur(4px)";
      card.style.transition = "none";
    });

    // Stagger reveal
    const timers: ReturnType<typeof setTimeout>[] = [];
    cards.forEach((card, i) => {
      const t = setTimeout(() => {
        card.style.transition = [
          `opacity 0.7s cubic-bezier(0.22,1,0.36,1)`,
          `transform 0.7s cubic-bezier(0.22,1,0.36,1)`,
          `filter 0.6s cubic-bezier(0.22,1,0.36,1)`,
        ].join(", ");
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
        card.style.filter = "blur(0)";
      }, 40 + i * 120);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [activeCategory]);

  const handleCategoryChange = (cat: "All" | ProjectCategory) => {
    setIsChanging(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsChanging(false);
    }, 0);
  };

  return (
    <Column fillWidth gap="xl">
      {/* Category Filter */}
      <Row gap="8" wrap horizontal="center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              border: "1px solid",
              borderColor:
                activeCategory === cat
                  ? "var(--brand-background-strong)"
                  : "var(--neutral-alpha-medium)",
              background:
                activeCategory === cat
                  ? "var(--brand-alpha-weak)"
                  : "transparent",
              color:
                activeCategory === cat
                  ? "var(--brand-on-background-strong)"
                  : "var(--neutral-on-background-weak)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeCategory === cat ? 600 : 400,
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              whiteSpace: "nowrap",
            }}
          >
            {categoryLabel(cat)}
            {cat !== "All" && (
              <span
                style={{
                  marginLeft: 6,
                  opacity: 0.6,
                  fontSize: 11,
                }}
              >
                ({projects.filter((p) => p.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </Row>

      {/* Project Cards */}
      {filtered.length === 0 ? (
        <Column horizontal="center" align="center" paddingY="80" gap="m"
          style={{ animation: "fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text variant="heading-strong-m">
            {lang === "en"
              ? "No projects in this category"
              : "Tidak ada proyek di kategori ini"}
          </Text>
        </Column>
      ) : (
        <Column
          ref={listRef}
          fillWidth
          gap="xl"
          marginBottom="40"
          paddingX="l"
        >
          {filtered.map((project, index) => {
            const thumbUrl = project.thumbnail ?? "";
            const galleryUrls = (project.gallery ?? []).filter(Boolean);
            const images: string[] = [];
            if (thumbUrl) images.push(thumbUrl);
            galleryUrls.forEach((g) => { if (!images.includes(g)) images.push(g); });

            return (
              <ProjectCard
                priority={index < 2}
                key={project.slug}
                href={`/project/${project.slug}`}
                images={images}
                thumbnail={thumbUrl}
                title={lang === "en" ? project.title_en || project.title_id : project.title_id}
                description={
                  lang === "en"
                    ? project.description_en || project.description_id
                    : project.description_id
                }
                content=""
                avatars={[]}
                link={project.live_demo_url || ""}
                tools={project.tools ?? []}
                category={project.category}
                attachment={project.attachment}
                slug={project.slug}
              />
            );
          })}
        </Column>
      )}
    </Column>
  );
}
