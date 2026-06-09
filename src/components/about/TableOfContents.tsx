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
      .filter((s) => s.display && (s.id || s.title))
      .map((s) => s.id ?? s.title);

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

  return (
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      m={{ hide: true }}
    >
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => {
          const targetId = section.id ?? section.title;
          const isActive = activeId === targetId;
          return (
            <Column key={sectionIndex} gap="12">
              <Flex
                cursor="interactive"
                className={styles.hover}
                gap="8"
                vertical="center"
                onClick={() => scrollTo(targetId, 80)}
                style={{ opacity: isActive ? 1 : 0.55, transition: "opacity 0.2s" }}
              >
                <Flex
                  height="1"
                  minWidth="16"
                  background="neutral-strong"
                  style={{
                    minWidth: isActive ? 24 : 16,
                    transition: "min-width 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    background: isActive ? "var(--brand-on-background-medium)" : undefined,
                  }}
                />
                <Text style={{ fontWeight: isActive ? 600 : undefined }}>{section.title}</Text>
              </Flex>
              {about.tableOfContent.subItems && (
                <>
                  {section.items.map((item, itemIndex) => (
                    <Flex
                      l={{ hide: true }}
                      key={itemIndex}
                      style={{ cursor: "pointer" }}
                      className={styles.hover}
                      gap="12"
                      paddingLeft="24"
                      vertical="center"
                      onClick={() => scrollTo(item, 80)}
                    >
                      <Flex height="1" minWidth="8" background="neutral-strong"></Flex>
                      <Text>{item}</Text>
                    </Flex>
                  ))}
                </>
              )}
            </Column>
          );
        })}
    </Column>
  );
};

export default TableOfContents;
