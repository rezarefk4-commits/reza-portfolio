"use client";

import { useState } from "react";

interface EduLogoImgProps {
  src: string;
  alt: string;
  shimmerDelay: number; // 1–4
}

/**
 * Client component untuk logo pendidikan.
 * Mendeteksi bentuk gambar saat onLoad — jika rasio mendekati 1:1 (bulat/kotak),
 * wrapper berubah jadi lingkaran; logo persegi panjang tetap rounded-square.
 * Shimmer looping natural dengan delay agar tiap card tidak sync.
 */
export function EduLogoImg({ src, alt, shimmerDelay }: EduLogoImgProps) {
  const [isRound, setIsRound] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / (img.naturalHeight || 1);
    // Jika proporsi mendekati persegi (0.85–1.15) → anggap bulat/badge
    if (ratio >= 0.85 && ratio <= 1.15) {
      setIsRound(true);
    }
  };

  const delayMap: Record<number, string> = {
    1: "0.4s",
    2: "0.8s",
    3: "1.2s",
    4: "1.6s",
  };
  const delay = delayMap[shimmerDelay] ?? "0s";

  return (
    <>
      <style>{`
        @keyframes eduShimmerSweep {
          0%   { transform: translateX(-130%) rotate(15deg); }
          100% { transform: translateX(130%) rotate(15deg); }
        }
      `}</style>
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: isRound ? "50%" : 14,
          background: "color-mix(in srgb, var(--neutral-on-background-strong) 5%, transparent)",
          flexShrink: 0,
          overflow: "hidden",
          border: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)",
          boxShadow: [
            "0 2px 8px color-mix(in srgb, var(--neutral-on-background-strong) 6%, transparent)",
            "inset 0 1px 0 color-mix(in srgb, white 10%, transparent)",
          ].join(", "),
          transition: "border-radius 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: isRound ? 6 : 8,
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Shimmer sweep overlay */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, transparent 30%, color-mix(in srgb, white 28%, transparent) 50%, transparent 70%)",
            animation: `eduShimmerSweep 2.8s cubic-bezier(0.45, 0, 0.55, 1) ${delay} infinite`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    </>
  );
}
