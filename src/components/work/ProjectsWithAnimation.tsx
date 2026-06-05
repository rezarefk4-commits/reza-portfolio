"use client";

import { useEffect, Children, isValidElement, useRef } from "react";

export function ProjectsWithAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>(".card-scroll-hidden")
    );

    const observers: IntersectionObserver[] = [];

    wrappers.forEach((wrapper) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            wrapper.classList.add("card-scroll-visible");
            obs.unobserve(wrapper);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      obs.observe(wrapper);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
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
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <div className="card-scroll-hidden">{child}</div>
        ) : child
      )}
    </div>
  );
}
