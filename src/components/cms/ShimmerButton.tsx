"use client";

import { useRouter } from "next/navigation";

interface ShimmerButtonProps {
  href: string;
  avatarSrc: string;
  label: string;
  personName: string;
}

export function ShimmerButton({ href, avatarSrc, label, personName }: ShimmerButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="shimmer-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 20px 10px 8px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        color: "var(--neutral-on-background-strong)",
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "inherit",
        transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)";
      }}
    >
      {/* Avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc}
        alt={personName}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {label}
      {/* Arrow icon */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ opacity: 0.6 }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  );
}
