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

function triggerCardAnimations(container: HTMLElement, baseDelay = 100) {
  const wrappers = Array.from(
    container.querySelectorAll<HTMLElement>(".card-hidden")
  );
  const STAGGER = 130;

  // Reset dulu ke state awal
  wrappers.forEach((w) => {
    w.classList.remove("card-animate");
    w.style.transitionDelay = "0ms";
  });

  // Satu frame jeda agar browser paint state reset
  requestAnimationFrame(() => {
    wrappers.forEach((w, i) => {
      w.style.transitionDelay = `${baseDelay + i * STAGGER}ms`;
      w.classList.add("card-animate");
    });
  });
}

export function WorkPageClient({ projects }: WorkPageClientProps) {
  const { lang } = useLang();
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const listRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const categoryLabel = (c: "All" | ProjectCategory) => {
    if (c === "All") return lang === "en" ? "All" : "Semua";
    return c;
  };

  // Animasi saat pertama load
  useEffect(() => {
    if (!listRef.current) return;
    triggerCardAnimations(listRef.current, 200);
    isFirst.current = false;
  }, []);

  // Animasi saat filter berubah (cards sudah re-render)
  useEffect(() => {
    if (isFirst.current) return;
    if (!listRef.current) return;
    triggerCardAnimations(listRef.current, 50);
  }, [activeCategory]);

  return (
    <Column fillWidth gap="xl">
      {/* Category Filter */}
      <Row gap="8" wrap horizontal="center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              border: "1px solid",
              borderColor: activeCategory === cat
                ? "var(--brand-background-strong)"
                : "var(--neutral-alpha-medium)",
              background: activeCategory === cat
                ? "var(--brand-alpha-weak)"
                : "transparent",
              color: activeCategory === cat
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
              <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 11 }}>
                ({projects.filter((p) => p.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </Row>

      {/* Project Cards */}
      {filtered.length === 0 ? (
        <Column horizontal="center" align="center" paddingY="80" gap="m"
          style={{ animation: "cardFadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text variant="heading-strong-m">
            {lang === "en" ? "No projects in this category" : "Tidak ada proyek di kategori ini"}
          </Text>
        </Column>
      ) : (
        <div
          ref={listRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--static-space-40)",
            width: "100%",
            paddingInline: "var(--static-space-24)",
            marginBottom: "40px",
          }}
        >
          {filtered.map((project, index) => {
            const thumbUrl = project.thumbnail ?? "";
            const galleryUrls = (project.gallery ?? []).filter(Boolean);
            const images: string[] = [];
            if (thumbUrl) images.push(thumbUrl);
            galleryUrls.forEach((g) => { if (!images.includes(g)) images.push(g); });

            return (
              // card-hidden ada dari render — invisible sebelum JS jalan
              <div key={project.slug} className="card-hidden">
                <ProjectCard
                  priority={index < 2}
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
              </div>
            );
          })}
        </div>
      )}
    </Column>
  );
}
