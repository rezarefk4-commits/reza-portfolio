"use client";

import React, { useEffect, useState } from "react";
import { Column, Flex, Text } from "@once-ui-system/core";
import styles from "./about.module.scss";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
    id?: string;
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
  const [activeId, setActiveId] = useState<string>("");

  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveId(id);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = structure
      .filter((s) => s.display && s.id)
      .map((s) => s.id as string);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [structure]);

  if (!about.tableOfContent.display) return null;

  const visible = structure.filter((s) => s.display);

  return (
    <>
      <style>{`
        .toc-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 2px 0;
        }
        .toc-item .toc-line {
          height: 1px;
          min-width: 16px;
          background: var(--neutral-on-background-strong);
          transition: min-width 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
          opacity: 0.3;
          border-radius: 1px;
        }
        .toc-item .toc-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--neutral-on-background-weak);
          transition: color 0.2s, opacity 0.2s;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: max-width 0.3s ease, opacity 0.25s ease, color 0.2s;
        }
        .toc-item:hover .toc-label,
        .toc-item.toc-active .toc-label {
          opacity: 1;
          max-width: 160px;
        }
        .toc-item:hover .toc-line,
        .toc-item.toc-active .toc-line {
          min-width: 24px;
          opacity: 1;
        }
        .toc-item.toc-active .toc-line {
          background: var(--brand-on-background-medium, #6366f1);
          min-width: 28px;
        }
        .toc-item.toc-active .toc-label {
          color: var(--neutral-on-background-strong);
          font-weight: 600;
        }
        .toc-item:hover .toc-label { color: var(--neutral-on-background-strong); }
        .toc-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--neutral-on-background-strong);
          opacity: 0.25;
          flex-shrink: 0;
          transition: opacity 0.2s, background 0.2s;
        }
        .toc-item.toc-active .toc-dot {
          background: var(--brand-on-background-medium, #6366f1);
          opacity: 1;
        }
        .toc-item:hover .toc-dot { opacity: 0.7; }
      `}</style>
      <Column
        left="0"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
        position="fixed"
        paddingLeft="20"
        gap="20"
        m={{ hide: true }}
      >
        {visible.map((section, idx) => {
          const targetId = section.id ?? section.title;
          const isActive = activeId === targetId;
          return (
            <div
              key={idx}
              className={`toc-item${isActive ? " toc-active" : ""}`}
              onClick={() => scrollTo(targetId, 80)}
              title={section.title}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollTo(targetId, 80)}
            >
              <span className="toc-dot" />
              <span className="toc-line" />
              <span className="toc-label">{section.title}</span>
            </div>
          );
        })}
      </Column>
    </>
  );
};

export default TableOfContents;
