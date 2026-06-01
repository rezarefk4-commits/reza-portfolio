"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Column, Row, Text, Button, IconButton, Line } from "@once-ui-system/core";
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/reza-control/login");
    router.refresh();
  };

  return (
    <Row fillWidth style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Column
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
        background="surface"
        border="neutral-alpha-weak"
        paddingY="l"
        style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 10 }}
      >
        <Row
          paddingX="l"
          paddingBottom="m"
          vertical="center"
          horizontal={collapsed ? "center" : "between"}
        >
          {!collapsed && (
            <Text variant="heading-strong-m" onBackground="brand-medium">
              Reza Control
            </Text>
          )}
          <IconButton
            icon={collapsed ? "chevronRight" : "chevronLeft"}
            variant="ghost"
            size="s"
            onClick={() => setCollapsed(!collapsed)}
          />
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
                onClick={() => router.push(item.href)}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                {!collapsed && <span className={styles.label}>{item.label}</span>}
              </button>
            );
          })}
        </Column>

        <Line background="neutral-alpha-weak" />

        <Column paddingX="8" paddingTop="m" gap="8">
          {!collapsed && (
            <Text
              variant="body-default-xs"
              onBackground="neutral-weak"
              paddingX="8"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "160px",
              }}
            >
              {user.email}
            </Text>
          )}
          <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
            <span className={styles.icon}>🚪</span>
            {!collapsed && <span className={styles.label}>Keluar</span>}
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
        }}
        padding="xl"
      >
        {children}
      </Column>
    </Row>
  );
}
