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

const navItems = [
  { href: "/reza-control", label: "Dashboard", icon: "📊" },
  { href: "/reza-control/projects", label: "Projects", icon: "🗂️" },
  { href: "/reza-control/certificates", label: "Certificates", icon: "🏆" },
  { href: "/reza-control/blogs", label: "Blogs", icon: "📝" },
  { href: "/reza-control/media", label: "Media", icon: "🖼️" },
  { href: "/reza-control/analytics", label: "Analytics", icon: "📈" },
  { href: "/reza-control/settings", label: "Settings", icon: "⚙️" },
  { href: "/reza-control/account", label: "Account", icon: "👤" },
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

  const sidebarOpen = mobileOpen || !collapsed;

  return (
    <Row fillWidth style={{ minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Column
        className={`${styles.sidebar} ${(!mobileOpen && collapsed) ? styles.collapsed : ""}`}
        background="surface"
        border="neutral-alpha-weak"
        paddingY="l"
      >
        <Row
          paddingX="l"
          paddingBottom="m"
          vertical="center"
          horizontal={collapsed && !mobileOpen ? "center" : "between"}
        >
          {(!collapsed || mobileOpen) && (
            <Text variant="heading-strong-m" onBackground="brand-medium">
              Reza Control
            </Text>
          )}
          <button
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--neutral-on-background-weak)",
              fontSize: 18,
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            {collapsed && !mobileOpen ? "›" : "‹"}
          </button>
        </Row>

        <Line background="neutral-alpha-weak" />

        <Column flex={1} paddingY="m" gap="4" paddingX="8">
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
              >
                <span className={styles.icon}>{item.icon}</span>
                {(!collapsed || mobileOpen) && (
                  <span className={styles.label}>{item.label}</span>
                )}
              </button>
            );
          })}
        </Column>

        <Line background="neutral-alpha-weak" />

        <Column paddingX="8" paddingTop="m" gap="8">
          {(!collapsed || mobileOpen) && (
            <Text
              variant="body-default-xs"
              onBackground="neutral-weak"
              paddingX="8"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "180px",
              }}
            >
              {user.email}
            </Text>
          )}
          <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
            <span className={styles.icon}>🚪</span>
            {(!collapsed || mobileOpen) && (
              <span className={styles.label}>Keluar</span>
            )}
          </button>
        </Column>
      </Column>

      {/* Main Content */}
      <Column
        flex={1}
        style={{
          marginLeft: collapsed ? "64px" : "224px",
          transition: "margin-left 0.2s ease",
          minHeight: "100vh",
          maxWidth: "calc(100vw - 64px)",
        }}
        padding="xl"
      >
        {children}
      </Column>

      {/* Mobile FAB toggle */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>
    </Row>
  );
}
