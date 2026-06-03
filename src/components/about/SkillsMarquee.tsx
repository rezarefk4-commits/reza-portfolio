"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AboutSkill } from "@/lib/types";

interface SkillsMarqueeProps {
  initialSkills: AboutSkill[];
}

function MarqueeRow({ skills, reverse = false }: { skills: AboutSkill[]; reverse?: boolean }) {
  // Duplicate for seamless loop
  const doubled = [...skills, ...skills];

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Edge fade masks */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
        background: "linear-gradient(to right, var(--page-background), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
        background: "linear-gradient(to left, var(--page-background), transparent)",
        pointerEvents: "none",
      }} />

      <div
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
          animation: `marquee${reverse ? "Reverse" : ""} ${skills.length * 3.5}s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((skill, i) => (
          <div
            key={`${skill.id}-${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 14,
              border: "1px solid var(--neutral-alpha-weak)",
              background: "var(--neutral-alpha-weak)",
              backdropFilter: "blur(8px)",
              minWidth: 80,
              flexShrink: 0,
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 18px rgba(99,179,237,0.35), 0 0 40px rgba(99,179,237,0.12)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "rgba(99,179,237,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--neutral-alpha-weak)";
            }}
          >
            {skill.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={skill.icon}
                alt={skill.title_id}
                style={{ width: 36, height: 36, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(99,179,237,0.3))" }}
              />
            ) : (
              <span style={{ fontSize: 32 }}>⚡</span>
            )}
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--neutral-on-background-weak)",
              whiteSpace: "nowrap",
            }}>
              {skill.title_id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsMarquee({ initialSkills }: SkillsMarqueeProps) {
  const [skills, setSkills] = useState<AboutSkill[]>(initialSkills);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("about_skills").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setSkills(data);
    });
  }, []);

  if (skills.length === 0) return null;

  // Split into two rows
  const half = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, half);
  const row2 = skills.slice(half);

  // If only one row worth, use all for both
  const finalRow1 = row1.length >= 3 ? row1 : skills;
  const finalRow2 = row2.length >= 3 ? row2 : [...skills].reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <MarqueeRow skills={finalRow1} reverse={false} />
      <MarqueeRow skills={finalRow2} reverse={true} />
    </div>
  );
}
