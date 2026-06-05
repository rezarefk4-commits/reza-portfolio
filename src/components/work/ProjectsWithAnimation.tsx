"use client";

import { useEffect, useRef } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];

    // Set initial state — invisible + translateY + blur
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(52px) scale(0.97)";
      card.style.filter = "blur(5px)";
      card.style.transition = "none"; // no transition on initial set
      card.style.willChange = "opacity, transform, filter";
    });

    const observers: IntersectionObserver[] = [];

    cards.forEach((card, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Small delay so the initial style is painted first
            const delay = 60 + i * 140; // stagger 140ms per card
            setTimeout(() => {
              card.style.transition = [
                `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                `transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
                `filter 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
              ].join(", ");
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
              card.style.filter = "blur(0)";
            }, 20);

            obs.unobserve(card);
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
      );
      obs.observe(card);
      observers.push(obs);
    });

    // Fallback: force-show all after 2.5s in case observer never fires
    const fallback = setTimeout(() => {
      cards.forEach((card) => {
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
        card.style.filter = "blur(0)";
      });
    }, 2500);

    return () => {
      observers.forEach((o) => o.disconnect());
      clearTimeout(fallback);
    };
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
