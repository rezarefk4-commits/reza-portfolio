"use client";

import {
  Heading,
  Text,
  Button,
  RevealFx,
  Column,
  Row,
} from "@once-ui-system/core";
import { about, person } from "@/resources";
import { useLang } from "@/lib/lang-context";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

export function HeroSection({ settings: initialSettings }: HeroSectionProps) {
  const { lang } = useLang();
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);
  const [avatarSrc, setAvatarSrc] = useState<string>(person.avatar);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
          if (data.avatar) {
            // URL bersih tanpa cache buster — pakai img tag langsung
            setAvatarSrc(data.avatar.split("?")[0]);
          }
        }
      });
  }, []);

  const heroHeadline = settings
    ? lang === "en" ? settings.hero_headline_en : settings.hero_headline_id
    : "Membangun solusi digital yang bermakna";

  const heroDescription = settings
    ? lang === "en" ? settings.hero_description_en : settings.hero_description_id
    : "Saya Reza, seorang developer yang bersemangat membangun aplikasi web, mobile, dan visualisasi data.";

  const ctaText = settings
    ? lang === "en" ? settings.hero_cta_text_en : settings.hero_cta_text_id
    : "About Me";

  const ctaLink = settings?.hero_cta_link || about.path;

  return (
    <Column fillWidth horizontal="center" gap="m">
      <Column maxWidth="s" horizontal="center" align="center">
        <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
          <Heading wrap="balance" variant="display-strong-l">
            {heroHeadline}
          </Heading>
        </RevealFx>
        <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
          <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
            {heroDescription}
          </Text>
        </RevealFx>
        <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
          <Button
            id="about"
            data-border="rounded"
            href={ctaLink}
            variant="secondary"
            size="m"
            weight="default"
            arrowIcon
          >
            <Row gap="8" vertical="center" paddingRight="4">
              {/* Pakai img biasa, bukan next/image, agar URL Supabase langsung render */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt={person.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginLeft: "-0.75rem",
                  marginRight: 8,
                  border: "1px solid var(--neutral-alpha-medium)",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = person.avatar;
                }}
              />
              {ctaText}
            </Row>
          </Button>
        </RevealFx>
      </Column>
    </Column>
  );
}
