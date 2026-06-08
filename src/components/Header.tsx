"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, gallery } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import styles from "./Header.module.scss";

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
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  // Hide header entirely inside CMS
  if (pathname.startsWith("/reza-control")) return null;

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
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
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Row s={{ hide: true }}>{person.location}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            radius="m-4"
            zIndex={1}
            className={styles.glassNav}
          >
            <Row gap="2" vertical="center" textVariant="body-default-s" suppressHydrationWarning className={styles.navInner}>
              {routes["/"] && (
                <ToggleButton
                  prefixIcon="home"
                  href="/"
                  selected={pathname === "/"}
                  className={`${styles.navBtn} ${pathname === "/" ? styles.navBtnActive : ""}`}
                >
                  <span className={styles.navLabel}>Home</span>
                </ToggleButton>
              )}

              {(routes["/"] && (routes["/about"] || routes["/work"] || routes["/blog"] || routes["/gallery"])) && (
                <div className={styles.divider} />
              )}

              {routes["/about"] && (
                <ToggleButton
                  prefixIcon="person"
                  href="/about"
                  selected={pathname === "/about"}
                  className={`${styles.navBtn} ${pathname === "/about" ? styles.navBtnActive : ""}`}
                >
                  <span className={styles.navLabel}>{about.label}</span>
                </ToggleButton>
              )}

              {routes["/work"] && (
                <ToggleButton
                  prefixIcon="grid"
                  href="/work"
                  selected={pathname.startsWith("/work")}
                  className={`${styles.navBtn} ${pathname.startsWith("/work") ? styles.navBtnActive : ""}`}
                >
                  <span className={styles.navLabel}>{work.label}</span>
                </ToggleButton>
              )}

              {routes["/blog"] && (
                <ToggleButton
                  prefixIcon="book"
                  href="/blog"
                  selected={pathname.startsWith("/blog")}
                  className={`${styles.navBtn} ${pathname.startsWith("/blog") ? styles.navBtnActive : ""}`}
                >
                  <span className={styles.navLabel}>{blog.label}</span>
                </ToggleButton>
              )}

              {routes["/gallery"] && (
                <ToggleButton
                  prefixIcon="gallery"
                  href="/gallery"
                  selected={pathname.startsWith("/gallery")}
                  className={`${styles.navBtn} ${pathname.startsWith("/gallery") ? styles.navBtnActive : ""}`}
                >
                  <span className={styles.navLabel}>{gallery.label}</span>
                </ToggleButton>
              )}

              {display.themeSwitcher && (
                <>
                  <div className={styles.divider} />
                  <ThemeToggle />
                </>
              )}
              <div className={styles.divider} />
              <LangToggle />
            </Row>
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex s={{ hide: true }}>
              {display.time && <TimeDisplay timeZone={person.location} />}
            </Flex>
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
