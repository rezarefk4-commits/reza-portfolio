"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AboutSkill } from "@/lib/types";

interface SkillsMarqueeProps {
  initialSkills: AboutSkill[];
}

function MarqueeRow({ skills, reverse = false }: { skills: AboutSkill[]; reverse?: boolean }) {
  const doubled = [...skills, ...skills];

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Edge fade */}
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

      <div style={{
        display: "flex",
        gap: 10,
        width: "max-content",
        animation: `marquee${reverse ? "Reverse" : ""} ${skills.length * 3.5}s linear infinite`,
        willChange: "transform",
      }}>
        {doubled.map((skill, i) => (
          <div key={`${skill.id}-${i}`} className="skill-chip">
            {skill.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={skill.icon}
                alt={skill.title_id}
                className="skill-icon"
              />
            ) : (
              <span className="skill-icon skill-icon-fallback">⚡</span>
            )}
            <span className="skill-label">{skill.title_id}</span>
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

  const half = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, half);
  const row2 = skills.slice(half);
  const finalRow1 = row1.length >= 3 ? row1 : skills;
  const finalRow2 = row2.length >= 3 ? row2 : [...skills].reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .skill-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid var(--neutral-alpha-weak);
          background: var(--neutral-alpha-weak);
          min-width: 60px;
          flex-shrink: 0;
          cursor: default;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      border-color 0.28s ease,
                      background 0.28s ease,
                      box-shadow 0.28s ease;
        }
        .skill-chip:hover {
          transform: scale(1.18) translateY(-2px);
          border-color: color-mix(in srgb, var(--brand-background-strong) 40%, transparent);
          background: color-mix(in srgb, var(--brand-background-strong) 8%, transparent);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--brand-background-strong) 20%, transparent);
        }

        .skill-icon {
          width: 22px;
          height: 22px;
          object-fit: contain;
          filter: grayscale(1) brightness(0.85);
          transition: filter 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
          display: block;
        }
        .skill-chip:hover .skill-icon {
          filter: grayscale(0) brightness(1);
          transform: scale(1.1);
        }

        .skill-icon-fallback {
          font-size: 20px;
          filter: grayscale(1);
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .skill-chip:hover .skill-icon-fallback {
          filter: none;
        }

        .skill-label {
          font-size: 10px;
          font-weight: 500;
          color: var(--neutral-on-background-weak);
          white-space: nowrap;
          transition: color 0.2s;
        }
        .skill-chip:hover .skill-label {
          color: var(--neutral-on-background-strong);
        }
      `}</style>
      <MarqueeRow skills={finalRow1} reverse={false} />
      <MarqueeRow skills={finalRow2} reverse={true} />
    </div>
  );
}
