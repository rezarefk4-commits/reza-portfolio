"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Column, Row, Text, Line } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import styles from "./AdminShell.module.scss";

interface AdminShellProps {
  children: React.ReactNode;
  user: User;
}

// Clean SVG icons — single color, adaptive
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
      <circle cx="12" cy="8" r="5"/><path d="M9 21v-4l3 1 3-1v4"/><path d="M6 13.18A7 7 0 0 0 5 17v4"/><path d="M18 13.18A7 7 0 0 1 19 17v4"/>
    </svg>
  ),
  blogs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
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
};

const navItems = [
  { href: "/reza-control",              label: "Dashboard",    icon: Icons.dashboard },
  { href: "/reza-control/projects",     label: "Projects",     icon: Icons.projects },
  { href: "/reza-control/certificates", label: "Certificates", icon: Icons.certificates },
  { href: "/reza-control/blogs",        label: "Blogs",        icon: Icons.blogs },
  { href: "/reza-control/media",        label: "Media",        icon: Icons.media },
  { href: "/reza-control/analytics",    label: "Analytics",    icon: Icons.analytics },
  { href: "/reza-control/about",        label: "About CMS",    icon: Icons.about },
  { href: "/reza-control/settings",     label: "Settings",     icon: Icons.settings },
  { href: "/reza-control/account",      label: "Account",      icon: Icons.account },
];

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/reza-control/login");
    router.refresh();
  };

  const navigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <Row fillWidth style={{ minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <Column
        className={`${styles.sidebar} ${(!mobileOpen && collapsed) ? styles.collapsed : ""} ${mobileOpen ? styles.mobileVisible : ""}`}
        background="surface"
        border="neutral-alpha-weak"
        paddingY="l"
      >
        {/* Sidebar header */}
        <Row
          paddingX="m"
          paddingBottom="m"
          vertical="center"
          horizontal={collapsed && !mobileOpen ? "center" : "between"}
        >
          {(!collapsed || mobileOpen) && (
            <Column gap="2">
              <Text variant="label-strong-m" onBackground="brand-medium">Reza Control</Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">CMS Dashboard</Text>
            </Column>
          )}
          <button
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className={styles.collapseBtn}
            aria-label="Toggle sidebar"
          >
            {collapsed && !mobileOpen ? Icons.chevronRight : Icons.chevronLeft}
          </button>
        </Row>

        <Line background="neutral-alpha-weak" marginBottom="8" />

        {/* Nav items */}
        <Column flex={1} paddingY="4" gap="2" paddingX="8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/reza-control"
                ? pathname === "/reza-control"
                : pathname.startsWith(item.href);

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <span className={styles.icon}>{item.icon}</span>
                {(!collapsed || mobileOpen) && (
                  <span className={styles.label}>{item.label}</span>
                )}
                {isActive && (!collapsed || mobileOpen) && (
                  <span className={styles.activeIndicator} />
                )}
              </button>
            );
          })}
        </Column>

        <Line background="neutral-alpha-weak" marginTop="8" />

        {/* Footer: email + logout */}
        <Column paddingX="8" paddingTop="m" gap="4">
          {(!collapsed || mobileOpen) && (
            <div style={{
              padding: "8px 12px", borderRadius: 8,
              background: "var(--neutral-alpha-weak)", marginBottom: 4,
            }}>
              <Text variant="body-default-xs" onBackground="neutral-weak"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                {user.email}
              </Text>
            </div>
          )}
          <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}
            title={collapsed && !mobileOpen ? "Keluar" : undefined}>
            <span className={styles.icon}>{Icons.logout}</span>
            {(!collapsed || mobileOpen) && <span className={styles.label}>Keluar</span>}
          </button>
        </Column>
      </Column>

      {/* Main Content */}
      <Column
        flex={1}
        className={styles.mainContent}
        style={{
          marginLeft: collapsed ? "64px" : "224px",
          transition: "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
        padding="xl"
      >
        {children}
      </Column>

      {/* Mobile FAB */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? Icons.close : Icons.menu}
      </button>
    </Row>
  );
}
