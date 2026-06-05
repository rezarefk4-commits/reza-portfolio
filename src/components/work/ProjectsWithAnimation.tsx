"use client";

import { useEffect, useRef, Children, cloneElement, isValidElement } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Ambil semua wrapper div.card-hidden
    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>(".card-hidden")
    );

    const BASE_DELAY = 350;
    const STAGGER    = 150;

    wrappers.forEach((wrapper, i) => {
      const delay = BASE_DELAY + i * STAGGER;
      wrapper.style.transitionDelay = `${delay}ms`;
      // Tambah class animate — CSS transition langsung jalan
      wrapper.classList.add("card-animate");
    });

    // Fallback
    const fallback = setTimeout(() => {
      wrappers.forEach((w) => {
        w.style.transition = "none";
        w.style.opacity = "1";
        w.style.transform = "none";
        w.style.filter = "none";
      });
    }, BASE_DELAY + wrappers.length * STAGGER + 1500);

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
      {/* Bungkus tiap card dengan div.card-hidden — class ada sejak SSR */}
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <div className="card-hidden">{child}</div>
        ) : child
      )}
    </div>
  );
}
