"use client";

import { Column, Text } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { Project } from "@/lib/types";

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  const { lang } = useLang();
  const content = lang === "en" ? project.content_en : project.content_id;
  const description = lang === "en" ? project.description_en : project.description_id;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ── Description block ────────────────────────────────── */}
      {description && (
        <div style={{
          padding: "28px 32px",
          borderRadius: 18,
          background: "var(--neutral-background-medium)",
          border: "1px solid var(--neutral-alpha-weak)",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Accent bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
            background: "linear-gradient(to bottom, var(--brand-background-strong), transparent)",
            borderRadius: "18px 0 0 18px",
          }} />

          {/* Label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--brand-alpha-weak)", border: "1px solid var(--brand-alpha-medium)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--brand-on-background-strong)" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-on-background-strong)", opacity: 0.8 }}>
              {lang === "en" ? "Overview" : "Tentang Proyek"}
            </span>
          </div>

          <p style={{
            fontSize: 15.5,
            lineHeight: 1.75,
            color: "var(--neutral-on-background-medium)",
            margin: 0,
            fontWeight: 400,
          }}>
            {description}
          </p>
        </div>
      )}

      {/* ── Rich content ─────────────────────────────────────── */}
      {content && (
        <div
          className="cms-content project-detail-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* ── Content styles ───────────────────────────────────── */}
      <style>{`
        .project-detail-content {
          font-size: 15px;
          line-height: 1.8;
          color: var(--neutral-on-background-medium);
        }

        /* Headings */
        .project-detail-content h1,
        .project-detail-content h2,
        .project-detail-content h3,
        .project-detail-content h4 {
          color: var(--neutral-on-background-strong);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 2rem 0 0.75rem;
          line-height: 1.25;
        }
        .project-detail-content h1 { font-size: 1.65rem; }
        .project-detail-content h2 {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--neutral-alpha-weak);
          margin-top: 2.5rem;
        }
        .project-detail-content h2::before {
          content: "";
          display: block;
          width: 4px;
          height: 18px;
          border-radius: 99px;
          background: var(--brand-background-strong);
          flex-shrink: 0;
        }
        .project-detail-content h3 { font-size: 1.05rem; }
        .project-detail-content h4 { font-size: 0.95rem; font-weight: 600; }

        /* Paragraphs */
        .project-detail-content p {
          margin: 0 0 1rem;
          color: var(--neutral-on-background-medium);
        }
        .project-detail-content p:last-child { margin-bottom: 0; }

        /* Lists */
        .project-detail-content ul,
        .project-detail-content ol {
          margin: 0.5rem 0 1.2rem;
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .project-detail-content li {
          color: var(--neutral-on-background-medium);
          line-height: 1.7;
        }
        .project-detail-content ul li::marker { color: var(--brand-background-strong); }
        .project-detail-content ol li::marker { color: var(--brand-on-background-strong); font-weight: 700; }

        /* Strong / em */
        .project-detail-content strong { color: var(--neutral-on-background-strong); font-weight: 700; }
        .project-detail-content em { color: var(--neutral-on-background-medium); font-style: italic; }

        /* Code inline */
        .project-detail-content code:not(pre code) {
          font-family: "JetBrains Mono", "Fira Code", monospace;
          font-size: 12.5px;
          padding: 2px 7px;
          border-radius: 5px;
          background: var(--neutral-alpha-weak);
          border: 1px solid var(--neutral-alpha-medium);
          color: var(--brand-on-background-strong);
        }

        /* Code block */
        .project-detail-content pre {
          margin: 1.2rem 0;
          border-radius: 14px;
          background: var(--neutral-background-strong);
          border: 1px solid var(--neutral-alpha-weak);
          padding: 20px 22px;
          overflow-x: auto;
        }
        .project-detail-content pre code {
          font-family: "JetBrains Mono", "Fira Code", monospace;
          font-size: 13px;
          line-height: 1.7;
          color: var(--neutral-on-background-medium);
        }

        /* Blockquote */
        .project-detail-content blockquote {
          margin: 1.5rem 0;
          padding: 16px 20px;
          border-left: 3px solid var(--brand-background-strong);
          background: var(--brand-alpha-weak);
          border-radius: 0 12px 12px 0;
          color: var(--neutral-on-background-medium);
          font-style: italic;
        }
        .project-detail-content blockquote p { margin: 0; }

        /* Links */
        .project-detail-content a {
          color: var(--brand-on-background-strong);
          text-decoration: underline;
          text-decoration-color: var(--brand-alpha-medium);
          text-underline-offset: 3px;
          transition: color 0.18s;
        }
        .project-detail-content a:hover { color: var(--neutral-on-background-strong); }

        /* Images in content */
        .project-detail-content img {
          width: 100%;
          border-radius: 12px;
          margin: 1rem 0;
          display: block;
          border: 1px solid var(--neutral-alpha-weak);
        }

        /* Tables */
        .project-detail-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.2rem 0;
          font-size: 14px;
        }
        .project-detail-content th {
          background: var(--neutral-background-strong);
          color: var(--neutral-on-background-strong);
          font-weight: 700;
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--neutral-alpha-medium);
        }
        .project-detail-content td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--neutral-alpha-weak);
          color: var(--neutral-on-background-medium);
          vertical-align: top;
        }
        .project-detail-content tr:last-child td { border-bottom: none; }
        .project-detail-content tr:hover td { background: var(--neutral-alpha-weak); }

        /* HR */
        .project-detail-content hr {
          border: none;
          border-top: 1px solid var(--neutral-alpha-weak);
          margin: 2rem 0;
        }

        /* Callout (TipTap custom) */
        .project-detail-content .callout {
          display: flex;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          margin: 1.2rem 0;
          background: var(--neutral-background-medium);
          border: 1px solid var(--neutral-alpha-weak);
        }
        .project-detail-content .callout-icon {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .project-detail-content .callout-content { flex: 1; line-height: 1.6; }

        @media (max-width: 600px) {
          .project-detail-content { font-size: 14.5px; }
          .project-detail-content h2 { font-size: 1.15rem; }
          .project-detail-content pre { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
