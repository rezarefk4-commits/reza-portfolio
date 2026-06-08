"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Text } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AdminShellProps {
  children: React.ReactNode;
  user: User;
}

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  projects: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7a2 2 0 0 1 2-2h4l2 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  certificates: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/><path d="M9 21v-4l3 1 3-1v4"/>
    </svg>
  ),
  blogs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  gallery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  media: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  about: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  account: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  logo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
};

const allNavItems = [
  { href: "/reza-control",              label: "Dashboard",    icon: Icons.dashboard,    group: "main" },
  { href: "/reza-control/projects",     label: "Projects",     icon: Icons.projects,     group: "main" },
  { href: "/reza-control/certificates", label: "Certificates", icon: Icons.certificates, group: "main" },
  { href: "/reza-control/blogs",        label: "Blog Posts",   icon: Icons.blogs,        group: "main" },
  { href: "/reza-control/gallery",      label: "Gallery",      icon: Icons.gallery,      group: "content" },
  { href: "/reza-control/media",        label: "Media",        icon: Icons.media,        group: "content" },
  { href: "/reza-control/analytics",   label: "Analytics",    icon: Icons.analytics,    group: "content" },
  { href: "/reza-control/about",        label: "About Page",   icon: Icons.about,        group: "system" },
  { href: "/reza-control/settings",     label: "Settings",     icon: Icons.settings,     group: "system" },
  { href: "/reza-control/account",      label: "Account",      icon: Icons.account,      group: "system" },
];

// Bottom nav: 4 utama + burger
const bottomPrimary = allNavItems.slice(0, 4);

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryList | MediaQueryListEvent) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/reza-control/login");
    router.refresh();
  };

  const navigate = (href: string) => {
    router.push(href);
    setDrawerOpen(false);
  };

  const isActive = (href: string) =>
    href === "/reza-control"
      ? pathname === "/reza-control"
      : pathname.startsWith(href);

  const currentPage = allNavItems.find((i) =>
    i.href === "/reza-control"
      ? pathname === "/reza-control"
      : pathname.startsWith(i.href)
  );

  /* ─────────────────────── MOBILE ─────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "var(--page-background)" }}>
        <style>{`
          @keyframes drawerIn {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          @keyframes overlayIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes adminTabPop {
            0%   { transform: scale(0.88); }
            60%  { transform: scale(1.08); }
            100% { transform: scale(1); }
          }

          /* Bottom nav item */
          .mob-nav-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            flex: 1;
            padding: 8px 4px 6px;
            border: none;
            background: transparent;
            cursor: pointer;
            position: relative;
            -webkit-tap-highlight-color: transparent;
            transition: color 0.15s ease;
          }
          .mob-nav-btn.active {
            color: var(--brand-on-background-strong);
            animation: adminTabPop 0.25s cubic-bezier(0.34,1.56,0.64,1);
          }
          .mob-nav-btn:not(.active) {
            color: var(--neutral-on-background-weak);
          }
          .mob-nav-label {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 0.02em;
            line-height: 1;
            font-family: inherit;
          }
          .mob-nav-dot {
            position: absolute;
            top: 6px;
            width: 20px; height: 3px;
            border-radius: 0 0 3px 3px;
            background: var(--brand-solid-strong, #6366f1);
            left: 50%;
            transform: translateX(-50%);
          }

          /* Drawer grid items */
          .drawer-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 14px 8px;
            border-radius: 14px;
            border: 1px solid transparent;
            cursor: pointer;
            background: var(--neutral-alpha-weak);
            color: var(--neutral-on-background-medium);
            transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
            -webkit-tap-highlight-color: transparent;
            font-family: inherit;
          }
          .drawer-item.active {
            background: var(--brand-alpha-weak);
            color: var(--brand-on-background-strong);
            border-color: var(--brand-alpha-medium);
          }
          .drawer-item:active { transform: scale(0.94); }
          .drawer-label {
            font-size: 10px;
            font-weight: 600;
            text-align: center;
            line-height: 1.2;
            font-family: inherit;
          }
        `}</style>

        {/* ── Top Header bar ── */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "color-mix(in srgb, var(--neutral-background-strong) 85%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--neutral-alpha-weak)",
        }}>
          {/* Logo + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "var(--brand-background-strong)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", flexShrink: 0,
            }}>
              {Icons.logo}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--neutral-on-background-strong)", lineHeight: 1 }}>
                Reza Control
              </div>
              <div style={{ fontSize: 10, color: "var(--neutral-on-background-weak)", lineHeight: 1, marginTop: 2 }}>
                {currentPage?.label ?? "CMS"}
              </div>
            </div>
          </div>

          {/* Hamburger → opens full drawer */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 10,
              border: "1px solid var(--neutral-alpha-medium)",
              background: drawerOpen ? "var(--neutral-alpha-medium)" : "transparent",
              color: "var(--neutral-on-background-strong)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {drawerOpen ? Icons.close : Icons.menu}
          </button>
        </div>

        {/* ── Full menu drawer (slide up) ── */}
        {drawerOpen && (
          <>
            {/* Overlay */}
            <div
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                zIndex: 98,
                animation: "overlayIn 0.2s ease",
              }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <div style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 99,
              background: "var(--neutral-background-strong)",
              borderRadius: "24px 24px 0 0",
              paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
              animation: "drawerIn 0.28s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.25)",
              border: "1px solid var(--neutral-alpha-weak)",
              borderBottom: "none",
            }}>
              {/* Drag handle */}
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: "var(--neutral-alpha-medium)",
                margin: "12px auto 16px",
              }} />

              {/* User info */}
              <div style={{
                margin: "0 16px 16px",
                padding: "12px 14px",
                borderRadius: 14,
                background: "var(--neutral-alpha-weak)",
                border: "1px solid var(--neutral-alpha-weak)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--brand-alpha-medium)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-on-background-strong)",
                  fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {user.email?.[0]?.toUpperCase() ?? "R"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--neutral-on-background-strong)", lineHeight: 1.3 }}>
                    Admin
                  </div>
                  <div style={{
                    fontSize: 11, color: "var(--neutral-on-background-weak)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Group: Main */}
              <div style={{ padding: "0 16px 8px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                  Konten
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {allNavItems.filter(i => i.group === "main").map((item) => (
                    <button key={item.href} className={`drawer-item${isActive(item.href) ? " active" : ""}`} onClick={() => navigate(item.href)}>
                      {item.icon}
                      <span className="drawer-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group: Content */}
              <div style={{ padding: "0 16px 8px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                  Media & Data
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {allNavItems.filter(i => i.group === "content").map((item) => (
                    <button key={item.href} className={`drawer-item${isActive(item.href) ? " active" : ""}`} onClick={() => navigate(item.href)}>
                      {item.icon}
                      <span className="drawer-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group: System */}
              <div style={{ padding: "0 16px 8px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--neutral-on-background-weak)", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
                  Sistem
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {allNavItems.filter(i => i.group === "system").map((item) => (
                    <button key={item.href} className={`drawer-item${isActive(item.href) ? " active" : ""}`} onClick={() => navigate(item.href)}>
                      {item.icon}
                      <span className="drawer-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div style={{ padding: "8px 16px 0" }}>
                <div style={{ height: 1, background: "var(--neutral-alpha-weak)", marginBottom: 12 }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    padding: "12px 16px", borderRadius: 14,
                    border: "1px solid var(--danger-alpha-medium)",
                    background: "var(--danger-alpha-weak)",
                    color: "var(--danger-on-background-medium)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {Icons.logout}
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Main Content ── */}
        <div style={{
          flex: 1,
          padding: "16px 16px 96px", // 96px = bottom nav space
          overflowX: "hidden",
        }}>
          {children}
        </div>

        {/* ── Bottom Navigation Bar ── */}
        <nav style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 50,
          height: "calc(60px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "color-mix(in srgb, var(--neutral-background-strong) 90%, transparent)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderTop: "1px solid var(--neutral-alpha-weak)",
          display: "flex",
          alignItems: "stretch",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        }}>
          {bottomPrimary.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                className={`mob-nav-btn${active ? " active" : ""}`}
                onClick={() => navigate(item.href)}
              >
                {active && <div className="mob-nav-dot" />}
                {item.icon}
                <span className="mob-nav-label">{item.label}</span>
              </button>
            );
          })}

          {/* Menu button */}
          <button
            className={`mob-nav-btn${drawerOpen ? " active" : ""}`}
            onClick={() => setDrawerOpen((v) => !v)}
            style={{ color: drawerOpen ? "var(--brand-on-background-strong)" : "var(--neutral-on-background-weak)" }}
          >
            {drawerOpen ? Icons.close : Icons.menu}
            <span className="mob-nav-label">Menu</span>
          </button>
        </nav>
      </div>
    );
  }

  /* ─────────────────────── DESKTOP ────────────────────────────── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-background)" }}>
      <style>{`
        @keyframes sidebarIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cms-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
          background: none;
          border: none;
          color: var(--neutral-on-background-weak);
          font-size: 13px;
          font-weight: 500;
          width: 100%;
          text-align: left;
          font-family: inherit;
          transition: background 0.14s, color 0.14s, transform 0.14s;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .cms-nav-item:hover {
          background: color-mix(in srgb, var(--neutral-on-background-strong) 6%, transparent);
          color: var(--neutral-on-background-strong);
          transform: translateX(2px);
        }
        .cms-nav-item.active {
          background: color-mix(in srgb, var(--brand-background-strong) 12%, transparent) !important;
          color: var(--brand-on-background-strong) !important;
          font-weight: 600;
        }
        .cms-nav-item.logout-btn { color: var(--danger-on-background-weak); }
        .cms-nav-item.logout-btn:hover {
          background: var(--danger-alpha-weak);
          color: var(--danger-on-background-strong);
          transform: none;
        }
        .cms-group-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--neutral-on-background-weak);
          padding: 8px 12px 4px;
          opacity: 0.55;
        }
      `}</style>

      {/* ── Sidebar ── */}
      <div
        style={{
          position: "fixed",
          left: 12, top: 12, bottom: 12,
          width: collapsed ? 60 : 220,
          transition: "width 0.26s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 100,
          borderRadius: 20,
          background: "color-mix(in srgb, var(--neutral-background-strong) 72%, transparent)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 9%, transparent)",
          boxShadow: `
            0 8px 40px color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent),
            0 2px 8px color-mix(in srgb, var(--neutral-on-background-strong) 4%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)
          `,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "sidebarIn 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "12px 8px" }}>

          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: "4px 6px 10px",
            gap: 8,
          }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: "var(--brand-background-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", flexShrink: 0,
                }}>
                  {Icons.logo}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--brand-on-background-strong)", lineHeight: 1.1 }}>
                    Reza Control
                  </div>
                  <div style={{ fontSize: 9, color: "var(--neutral-on-background-weak)", letterSpacing: "0.04em" }}>
                    CMS Panel
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: 8,
                background: "none",
                border: "1px solid color-mix(in srgb, var(--neutral-on-background-strong) 10%, transparent)",
                cursor: "pointer",
                color: "var(--neutral-on-background-weak)",
                transition: "background 0.15s, color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--neutral-alpha-weak)"; e.currentTarget.style.color = "var(--neutral-on-background-strong)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--neutral-on-background-weak)"; }}
            >
              {collapsed ? Icons.chevronRight : Icons.chevronLeft}
            </button>
          </div>

          <div style={{ height: 1, background: "color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)", margin: "0 4px 6px" }} />

          {/* Nav groups */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Group: Konten */}
            {!collapsed && <div className="cms-group-label">Konten</div>}
            {allNavItems.filter(i => i.group === "main").map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  className={`cms-nav-item${active ? " active" : ""}`}
                  onClick={() => navigate(item.href)}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                >
                  <span style={{ flexShrink: 0, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                  {active && !collapsed && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-background-strong)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}

            {/* Group: Media */}
            {!collapsed && <div className="cms-group-label" style={{ marginTop: 6 }}>Media & Data</div>}
            {collapsed && <div style={{ height: 6 }} />}
            {allNavItems.filter(i => i.group === "content").map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  className={`cms-nav-item${active ? " active" : ""}`}
                  onClick={() => navigate(item.href)}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                >
                  <span style={{ flexShrink: 0, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                  {active && !collapsed && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-background-strong)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}

            {/* Group: Sistem */}
            {!collapsed && <div className="cms-group-label" style={{ marginTop: 6 }}>Sistem</div>}
            {collapsed && <div style={{ height: 6 }} />}
            {allNavItems.filter(i => i.group === "system").map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  className={`cms-nav-item${active ? " active" : ""}`}
                  onClick={() => navigate(item.href)}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                >
                  <span style={{ flexShrink: 0, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                  {active && !collapsed && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-background-strong)", flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ height: 1, background: "color-mix(in srgb, var(--neutral-on-background-strong) 8%, transparent)", margin: "6px 4px" }} />

          {/* Footer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {!collapsed && (
              <div style={{
                padding: "7px 12px", borderRadius: 8, marginBottom: 2,
                background: "color-mix(in srgb, var(--neutral-on-background-strong) 5%, transparent)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: "var(--brand-alpha-medium)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-on-background-strong)",
                  fontSize: 10, fontWeight: 700,
                }}>
                  {user.email?.[0]?.toUpperCase() ?? "R"}
                </div>
                <Text variant="body-default-xs" onBackground="neutral-weak"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  {user.email}
                </Text>
              </div>
            )}
            <button
              className="cms-nav-item logout-btn"
              onClick={handleLogout}
              title={collapsed ? "Sign Out" : undefined}
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <span style={{ flexShrink: 0, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {Icons.logout}
              </span>
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 84 : 244,
        transition: "margin-left 0.26s cubic-bezier(0.4,0,0.2,1)",
        padding: "24px 24px 24px 0",
        minHeight: "100vh",
        maxWidth: `calc(100vw - ${collapsed ? 84 : 244}px)`,
      }}>
        {children}
      </div>
    </div>
  );
}
