"use client";

import { useEffect, useRef } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];

    // CSS-only stagger animation — no IntersectionObserver needed.
    // Hero animasi selesai ~700ms, jadi kartu mulai muncul setelah itu.
    const BASE_DELAY = 500; // ms setelah page load
    const STAGGER    = 150; // ms jeda antar card

    cards.forEach((card, i) => {
      card.classList.add("card-stagger");
      card.style.animationDelay = `${BASE_DELAY + i * STAGGER}ms`;
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--static-space-40)",
        width: "100%",
        paddingInline: "var(--static-space-24)",
        marginBottom: "var(--static-space-40)",
      }}
    >
      {children}
    </div>
  );
}
