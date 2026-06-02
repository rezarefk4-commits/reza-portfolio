"use client";

import { Row, IconButton, Text } from "@once-ui-system/core";
import { person, social as staticSocial } from "@/resources";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import styles from "./Footer.module.scss";

interface SocialItem {
  name: string;
  icon: string;
  link: string;
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { lang } = useLang();

  const [footerTextId, setFooterTextId] = useState("Dibuat dengan ❤️ di Makassar");
  const [footerTextEn, setFooterTextEn] = useState("Made with ❤️ in Makassar");
  const [socialLinks, setSocialLinks] = useState<SocialItem[]>(
    staticSocial.filter((s) => s.link).map((s) => ({ name: s.name, icon: s.icon, link: s.link }))
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("footer_text_id, footer_text_en, social_github, social_linkedin, social_instagram, social_twitter, social_email")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (!data) return;

        if (data.footer_text_id) setFooterTextId(data.footer_text_id);
        if (data.footer_text_en) setFooterTextEn(data.footer_text_en);

        // Build social links from CMS
        const links: SocialItem[] = [];
        if (data.social_github)    links.push({ name: "GitHub",    icon: "github",    link: data.social_github });
        if (data.social_linkedin)  links.push({ name: "LinkedIn",  icon: "linkedin",  link: data.social_linkedin });
        if (data.social_instagram) links.push({ name: "Instagram", icon: "instagram", link: data.social_instagram });
        if (data.social_twitter)   links.push({ name: "Twitter",   icon: "x",         link: data.social_twitter });
        if (data.social_email)     links.push({ name: "Email",     icon: "email",     link: `mailto:${data.social_email}` });

        if (links.length > 0) setSocialLinks(links);
      });
  }, []);

  const footerText = lang === "en" ? footerTextEn : footerTextId;

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{ direction: "column", horizontal: "center", align: "center" }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak"> / {footerText}</Text>
        </Text>
        <Row gap="16">
          {socialLinks.map((item) => (
            <IconButton
              key={item.name}
              href={item.link}
              icon={item.icon}
              tooltip={item.name}
              size="s"
              variant="ghost"
            />
          ))}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
