"use client";

import { useEffect, useRef } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];

    const BASE_DELAY = 400; // ms — setelah hero selesai
    const STAGGER    = 150; // ms jeda antar card

    cards.forEach((card, i) => {
      const delay = BASE_DELAY + i * STAGGER;

      // 1. Langsung sembunyikan (sync, sebelum browser paint berikutnya)
      card.style.opacity = "0";
      card.style.transform = "translateY(48px) scale(0.97)";
      card.style.filter = "blur(4px)";

      // 2. Setelah satu frame, pasang transition dan reveal
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.transition = [
            `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            `transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            `filter 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          ].join(", ");
          card.style.opacity = "1";
          card.style.transform = "translateY(0) scale(1)";
          card.style.filter = "blur(0)";
        });
      });
    });

    // Fallback — paksa tampil jika ada yg ketinggalan
    const fallback = setTimeout(() => {
      cards.forEach((card) => {
        card.style.transition = "none";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
        card.style.filter = "blur(0)";
      });
    }, BASE_DELAY + cards.length * STAGGER + 1000);

    return () => clearTimeout(fallback);
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
