"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;        // ms
  type?: "up" | "left" | "scale";
  style?: CSSProperties;
}

/**
 * Wraps children in a div that fades in when scrolled into view.
 * Uses IntersectionObserver — zero dependencies, instant.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  type = "up",
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealClass =
      type === "left" ? "reveal-left" : type === "scale" ? "reveal-scale" : "reveal";
    el.classList.add(revealClass);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, type]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
