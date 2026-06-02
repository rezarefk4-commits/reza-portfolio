import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
  Card,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";
import { getCertificates } from "@/lib/db";
import { format } from "date-fns";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AvatarFromCms } from "@/components/about/AvatarFromCms";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default async function About() {
  const certificates = await getCertificates().catch(() => []);

  const structure = [
    { title: about.intro.title, display: about.intro.display, items: [] },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((e) => e.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((i) => i.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((s) => s.title),
    },
    { title: "Sertifikat", display: certificates.length > 0, items: [] },
  ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {/* ── Avatar sidebar ─────────────────────────────────────────── */}
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <ScrollReveal type="scale">
              <AvatarFromCms />
            </ScrollReveal>
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              <Text variant="body-default-s">{person.location}</Text>
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((lang, i) => (
                  <Tag key={i} size="l">{lang}</Tag>
                ))}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>

          {/* ── Intro ──────────────────────────────────────────────── */}
          <ScrollReveal>
            <Column
              id={about.intro.title}
              fillWidth
              minHeight="160"
              vertical="center"
              marginBottom="32"
            >
              {about.calendar.display && (
                <Row
                  fitWidth
                  border="brand-alpha-medium"
                  background="brand-alpha-weak"
                  radius="full"
                  padding="4"
                  gap="8"
                  marginBottom="m"
                  vertical="center"
                  className={styles.blockAlign}
                  style={{ backdropFilter: "blur(var(--static-space-1))" }}
                >
                  <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                  <Row paddingX="8">Schedule a call</Row>
                  <IconButton
                    href={about.calendar.link}
                    data-border="rounded"
                    variant="secondary"
                    icon="chevronRight"
                  />
                </Row>
              )}
              <Heading className={styles.textAlign} variant="display-strong-xl">
                {person.name}
              </Heading>
              <Text className={styles.textAlign} variant="display-default-xs" onBackground="neutral-weak">
                {person.role}
              </Text>
              {social.length > 0 && (
                <Row
                  className={styles.blockAlign}
                  paddingTop="20"
                  paddingBottom="8"
                  gap="8"
                  wrap
                  horizontal="center"
                  fitWidth
                  data-border="rounded"
                >
                  {social
                    .filter((item) => item.essential)
                    .map((item) =>
                      item.link ? (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button href={item.link} prefixIcon={item.icon} label={item.name} size="s" weight="default" variant="secondary" />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton size="l" href={item.link} icon={item.icon} variant="secondary" />
                          </Row>
                        </React.Fragment>
                      ) : null
                    )}
                </Row>
              )}
            </Column>
          </ScrollReveal>

          {/* ── Intro text ─────────────────────────────────────────── */}
          {about.intro.display && (
            <ScrollReveal delay={80}>
              <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
                {about.intro.description}
              </Column>
            </ScrollReveal>
          )}

          {/* ── Work Experience ────────────────────────────────────── */}
          {about.work.display && about.work.experiences.length > 0 && (
            <ScrollReveal delay={100}>
              <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
                {about.work.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.work.experiences.map((exp, i) => (
                  <ScrollReveal key={i} delay={i * 80}>
                    <Column fillWidth>
                      <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                        <Text id={exp.company} variant="heading-strong-l">{exp.company}</Text>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">{exp.timeframe}</Text>
                      </Row>
                      <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">{exp.role}</Text>
                      <Column as="ul" gap="16">
                        {exp.achievements.map((achievement, j) => (
                          <Text as="li" variant="body-default-m" key={j}>{achievement}</Text>
                        ))}
                      </Column>
                    </Column>
                  </ScrollReveal>
                ))}
              </Column>
            </ScrollReveal>
          )}

          {/* ── Education ─────────────────────────────────────────── */}
          {about.studies.display && about.studies.institutions.length > 0 && (
            <ScrollReveal delay={120}>
              <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((inst, i) => (
                  <ScrollReveal key={i} delay={i * 80}>
                    <Column
                      fillWidth
                      gap="8"
                      border="neutral-alpha-weak"
                      radius="m"
                      padding="l"
                      background="surface"
                    >
                      <Row gap="12" vertical="center">
                        <Text style={{ fontSize: 28 }}>🎓</Text>
                        <Column gap="4">
                          <Text id={inst.name} variant="heading-strong-l">{inst.name}</Text>
                        </Column>
                      </Row>
                      <Line background="neutral-alpha-weak" />
                      <Text variant="body-default-m" onBackground="neutral-weak">
                        {inst.description}
                      </Text>
                    </Column>
                  </ScrollReveal>
                ))}
              </Column>
            </ScrollReveal>
          )}

          {/* ── Technical Skills ──────────────────────────────────── */}
          {about.technical.display && about.technical.skills.length > 0 && (
            <ScrollReveal delay={140}>
              <Heading as="h2" id={about.technical.title} variant="display-strong-s" marginBottom="40">
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.technical.skills.map((skill, i) => (
                  <ScrollReveal key={i} delay={i * 70}>
                    <Column
                      fillWidth
                      gap="8"
                      border="neutral-alpha-weak"
                      radius="m"
                      padding="l"
                      background="surface"
                    >
                      <Text id={skill.title} variant="heading-strong-m">
                        {skill.title}
                      </Text>
                      <Text variant="body-default-m" onBackground="neutral-weak">
                        {skill.description}
                      </Text>
                      {skill.images && skill.images.length > 0 && (
                        <Row gap="12" wrap>
                          {skill.images.map((img, j) => (
                            <Media key={j} src={img.src} alt={img.alt ?? skill.title} radius="m" />
                          ))}
                        </Row>
                      )}
                    </Column>
                  </ScrollReveal>
                ))}
              </Column>
            </ScrollReveal>
          )}

          {/* ── Certificates from CMS ─────────────────────────────── */}
          {certificates.length > 0 && (
            <ScrollReveal delay={160}>
              <Heading as="h2" id="certificates" variant="display-strong-s" marginBottom="m">
                Sertifikat
              </Heading>
              <Column fillWidth gap="m" marginBottom="40">
                {certificates.map((cert, i) => (
                  <ScrollReveal key={cert.id} delay={i * 60}>
                    <Card
                      href={`/certificate/${cert.id}`}
                      fillWidth
                      border="neutral-alpha-weak"
                      background="surface"
                      radius="m"
                      padding="m"
                      transition="micro-medium"
                    >
                      <Row fillWidth gap="m" vertical="center">
                        {cert.thumbnail ? (
                          <Media
                            src={cert.thumbnail}
                            alt={cert.title_id}
                            width={80}
                            height={60}
                            radius="s"
                            style={{ flexShrink: 0 }}
                          />
                        ) : (
                          <Text style={{ fontSize: 32, flexShrink: 0 }}>🏆</Text>
                        )}
                        <Column gap="4" flex={1}>
                          <Text variant="heading-strong-m">{cert.title_id}</Text>
                          <Text variant="body-default-s" onBackground="brand-weak">{cert.issuer}</Text>
                          <Text variant="body-default-xs" onBackground="neutral-weak">
                            {format(new Date(cert.issue_date), "MMMM yyyy")}
                          </Text>
                        </Column>
                      </Row>
                    </Card>
                  </ScrollReveal>
                ))}
              </Column>
            </ScrollReveal>
          )}

        </Column>
      </Row>
    </Column>
  );
}
