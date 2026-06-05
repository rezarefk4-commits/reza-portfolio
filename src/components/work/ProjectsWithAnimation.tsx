"use client";

import { useEffect, useRef } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];

    // Set initial state — opacity 0, translated down
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(40px) scale(0.98)";
      card.style.transition = "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
    });

    const observers: IntersectionObserver[] = [];

    cards.forEach((card, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
            }, i * 150); // stagger 150ms per card
            obs.unobserve(card);
          }
        },
        { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
      );
      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-40)", width: "100%", paddingInline: "var(--static-space-24)", marginBottom: "var(--static-space-40)" }}>
      {children}
    </div>
  );
}
