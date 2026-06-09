"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, gallery } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import styles from "./Header.module.scss";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/lang-context";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat(locale, options).format(now));
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { lang } = useLang();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvClicked, setCvClicked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("cv_file")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.cv_file) setCvUrl(data.cv_file);
      });
  }, []);

  const handleCvDownload = () => {
    if (!cvUrl) return;
    setCvClicked(true);
    setTimeout(() => setCvClicked(false), 2000);
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = "CV-Reza-Refka.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (pathname.startsWith("/reza-control")) return null;

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const cvLabel = lang === "en" ? "CV" : "CV";

  return (
    <>
      {/* CV Download Button — fixed top-right, desktop only */}
      {cvUrl && (
        <>
          <style>{`
            @keyframes hcv-bounce {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(2.5px); }
            }
            @keyframes hcv-check {
              from { stroke-dashoffset: 22; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes hcv-pop {
              0%   { transform: scale(0.6); opacity: 0; }
              70%  { transform: scale(1.2); }
              100% { transform: scale(1);   opacity: 1; }
            }
            .hcv-btn {
              position: fixed;
              top: 16px;
              right: 20px;
              z-index: 20;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 7px 14px 7px 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,0.14);
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(20px) saturate(160%);
              -webkit-backdrop-filter: blur(20px) saturate(160%);
              color: var(--neutral-on-background-strong);
              font-size: 12px;
              font-weight: 600;
              font-family: inherit;
              letter-spacing: 0.02em;
              cursor: pointer;
              white-space: nowrap;
              outline: none;
              overflow: hidden;
              isolation: isolate;
              transition: background 0.2s, border-color 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
              box-shadow: 0 1px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
              -webkit-tap-highlight-color: transparent;
            }
            .hcv-btn:hover {
              background: rgba(255,255,255,0.15);
              border-color: rgba(255,255,255,0.28);
              transform: translateY(-1px) scale(1.04);
              box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            }
            .hcv-btn:hover .hcv-icon { animation: hcv-bounce 0.55s ease-in-out infinite; }
            .hcv-btn:active { transform: scale(0.97); }
            .hcv-btn.hcv-ok {
              background: rgba(34,197,94,0.15);
              border-color: rgba(34,197,94,0.35);
              color: rgb(74,222,128);
            }
            .hcv-icon { display: flex; align-items: center; flex-shrink: 0; opacity: 0.80; }
            .hcv-check { stroke-dasharray: 22; stroke-dashoffset: 22; animation: hcv-check 0.35s ease forwards; }
            .hcv-pop { animation: hcv-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            /* light mode */
            [data-theme="light"] .hcv-btn, .light .hcv-btn {
              background: rgba(0,0,0,0.80);
              border-color: rgba(0,0,0,0.70);
              color: #f5f5f5;
              box-shadow: 0 1px 6px rgba(0,0,0,0.20);
            }
            [data-theme="light"] .hcv-btn:hover, .light .hcv-btn:hover {
              background: rgba(0,0,0,0.90);
            }
            [data-theme="light"] .hcv-btn.hcv-ok, .light .hcv-btn.hcv-ok {
              background: #14532d; border-color: #15803d; color: #bbf7d0;
            }
            /* hide on mobile */
            @media (max-width: 768px) { .hcv-btn { display: none; } }
          `}</style>
          <button
            className={`hcv-btn${cvClicked ? " hcv-ok" : ""}`}
            onClick={handleCvDownload}
            type="button"
            aria-label={lang === "en" ? "Download CV" : "Unduh CV"}
          >
            <span className="hcv-icon">
              {cvClicked ? (
                <svg className="hcv-pop" width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline className="hcv-check" points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="hcv-icon" width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </span>
            <span>{cvClicked ? (lang === "en" ? "Saved!" : "Tersimpan!") : (lang === "en" ? "Download CV" : "Unduh CV")}</span>
          </button>
        </>
      )}

      {/* Desktop: top fade mask */}
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      {/* Mobile: bottom fade mask */}
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />

      {/* Header shell — full width, centers the pill */}
      <header
        className={`${styles.headerShell} ${scrolled ? styles.scrolled : ""}`}
        data-border="rounded"
      >
        <nav className={styles.glassNav} suppressHydrationWarning>
          {/* ── Nav links ── */}
          {routes["/"] && (
            <ToggleButton
              prefixIcon="home"
              href="/"
              selected={isActive("/", true)}
              className={`${styles.navBtn} ${isActive("/", true) ? styles.active : ""}`}
            >
              <span className={styles.label}>Home</span>
            </ToggleButton>
          )}

          {routes["/about"] && (
            <>
              <span className={styles.sep} />
              <ToggleButton
                prefixIcon="person"
                href="/about"
                selected={isActive("/about", true)}
                className={`${styles.navBtn} ${isActive("/about", true) ? styles.active : ""}`}
              >
                <span className={styles.label}>{about.label}</span>
              </ToggleButton>
            </>
          )}

          {routes["/work"] && (
            <>
              <span className={styles.sep} />
              <ToggleButton
                prefixIcon="grid"
                href="/work"
                selected={isActive("/work")}
                className={`${styles.navBtn} ${isActive("/work") ? styles.active : ""}`}
              >
                <span className={styles.label}>{work.label}</span>
              </ToggleButton>
            </>
          )}

          {routes["/blog"] && (
            <>
              <span className={styles.sep} />
              <ToggleButton
                prefixIcon="book"
                href="/blog"
                selected={isActive("/blog")}
                className={`${styles.navBtn} ${isActive("/blog") ? styles.active : ""}`}
              >
                <span className={styles.label}>{blog.label}</span>
              </ToggleButton>
            </>
          )}

          {routes["/gallery"] && (
            <>
              <span className={styles.sep} />
              <ToggleButton
                prefixIcon="gallery"
                href="/gallery"
                selected={isActive("/gallery")}
                className={`${styles.navBtn} ${isActive("/gallery") ? styles.active : ""}`}
              >
                <span className={styles.label}>{gallery.label}</span>
              </ToggleButton>
            </>
          )}

          {/* ── Utilities ── */}
          {display.themeSwitcher && (
            <>
              <span className={styles.sep} />
              <ThemeToggle />
            </>
          )}

          <span className={styles.sep} />
          <LangToggle />
        </nav>
      </header>
    </>
  );
};
