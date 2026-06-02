import {
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
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
import { getCertificates, getAboutEducation, getAboutExperiences, getAboutSkills, getAboutOrganizations } from "@/lib/db";
import { format } from "date-fns";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AvatarFromCms } from "@/components/about/AvatarFromCms";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default async function About() {
  const [certificates, educations, experiences, skills, organizations] = await Promise.all([
    getCertificates().catch(() => []),
    getAboutEducation().catch(() => []),
    getAboutExperiences().catch(() => []),
    getAboutSkills().catch(() => []),
    getAboutOrganizations().catch(() => []),
  ]);

  // Use CMS data if available, else fallback to static content.tsx
  const displayExperiences = experiences.length > 0 ? experiences : about.work.experiences;
  const displayEducations  = educations.length > 0  ? educations  : null;
  const displaySkills      = skills.length > 0      ? skills      : about.technical.skills;

  const structure = [
    { title: about.intro.title,      display: about.intro.display,         items: [] },
    { title: about.work.title,       display: true,                         items: [] },
    { title: about.studies.title,    display: true,                         items: [] },
    { title: about.technical.title,  display: true,                         items: [] },
    { title: "Organisasi",           display: organizations.length > 0,     items: [] },
    { title: "Sertifikat",           display: certificates.length > 0,      items: [] },
  ];

  return (
    <Column maxWidth="m">
      <Schema as="webPage" baseURL={baseURL} title={about.title} description={about.description}
        path={about.path} image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{ name: person.name, url: `${baseURL}${about.path}`, image: `${baseURL}${person.avatar}` }} />

      {about.tableOfContent.display && (
        <Column left="0" style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed" paddingLeft="24" gap="32" s={{ hide: true }}>
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center">

        {/* ── Avatar sidebar ─────────────────────────────────────── */}
        {about.avatar.display && (
          <Column className={styles.avatar} top="64" fitHeight position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160" paddingX="l" paddingBottom="xl" gap="m" flex={3} horizontal="center">
            <ScrollReveal type="scale">
              <AvatarFromCms />
            </ScrollReveal>
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              <Text variant="body-default-s">{person.location}</Text>
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((lang, i) => <Tag key={i} size="l">{lang}</Tag>)}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>

          {/* ── Header + Social ─────────────────────────────────── */}
          <ScrollReveal>
            <Column id={about.intro.title} fillWidth minHeight="160" vertical="center" marginBottom="32">
              <Heading className={styles.textAlign} variant="display-strong-xl">{person.name}</Heading>
              <Text className={styles.textAlign} variant="display-default-xs" onBackground="neutral-weak">
                {person.role}
              </Text>
              {social.length > 0 && (
                <Row className={styles.blockAlign} paddingTop="20" paddingBottom="8"
                  gap="8" wrap horizontal="center" fitWidth data-border="rounded">
                  {social.filter((s) => s.essential).map((item) =>
                    item.link ? (
                      <React.Fragment key={item.name}>
                        <Row s={{ hide: true }}>
                          <Button href={item.link} prefixIcon={item.icon} label={item.name}
                            size="s" weight="default" variant="secondary" />
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

          {/* ── Intro ──────────────────────────────────────────── */}
          {about.intro.display && (
            <ScrollReveal delay={80}>
              <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
                {about.intro.description}
              </Column>
            </ScrollReveal>
          )}

          {/* ── Pengalaman Kerja ────────────────────────────────── */}
          <ScrollReveal delay={100}>
            <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
              {about.work.title}
            </Heading>
          </ScrollReveal>
          <Column fillWidth gap="l" marginBottom="40">
            {experiences.length > 0 ? (
              experiences.map((exp, i) => (
                <ScrollReveal key={exp.id} delay={i * 80}>
                  <Column fillWidth gap="8" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
                    <Row fillWidth horizontal="between" vertical="center" wrap gap="8">
                      <Text variant="heading-strong-l">{exp.company}</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">{exp.timeframe}</Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="brand-weak">
                      {exp.role_id}
                    </Text>
                    {exp.description_id && (
                      <Text variant="body-default-m" onBackground="neutral-weak">{exp.description_id}</Text>
                    )}
                  </Column>
                </ScrollReveal>
              ))
            ) : (
              about.work.experiences.map((exp, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <Column fillWidth gap="8" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
                    <Row fillWidth horizontal="between" vertical="center" wrap gap="8">
                      <Text variant="heading-strong-l">{exp.company}</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">{exp.timeframe}</Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="brand-weak">{exp.role}</Text>
                    <Column as="ul" gap="8">
                      {exp.achievements.map((a, j) => (
                        <Text as="li" variant="body-default-m" key={j}>{a}</Text>
                      ))}
                    </Column>
                  </Column>
                </ScrollReveal>
              ))
            )}
          </Column>

          {/* ── Pendidikan ──────────────────────────────────────── */}
          <ScrollReveal delay={120}>
            <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
              {about.studies.title}
            </Heading>
          </ScrollReveal>
          <Column fillWidth gap="l" marginBottom="40">
            {educations.length > 0 ? (
              educations.map((edu, i) => (
                <ScrollReveal key={edu.id} delay={i * 80}>
                  <Column fillWidth gap="12" border="neutral-alpha-weak" radius="l" padding="l"
                    background="surface" style={{ position: "relative", overflow: "hidden" }}>
                    {/* Subtle gradient bg */}
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
                      background: "linear-gradient(135deg, var(--brand-alpha-weak) 0%, transparent 60%)",
                    }} />
                    <Row gap="l" vertical="center" wrap>
                      {/* Logo with glow animation */}
                      {edu.logo && (
                        <div style={{ flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={edu.logo} alt={edu.university_name}
                            className="university-logo"
                            style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 12 }}
                          />
                        </div>
                      )}
                      {!edu.logo && (
                        <div className="university-logo" style={{
                          width: 72, height: 72, borderRadius: 12, flexShrink: 0,
                          background: "var(--brand-alpha-weak)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 32,
                        }}>🎓</div>
                      )}
                      <Column gap="4" flex={1}>
                        <Text variant="heading-strong-l">{edu.university_name}</Text>
                        <Text variant="body-default-m" onBackground="brand-weak">
                          {edu.faculty} · {edu.major}
                        </Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          {edu.degree} · {edu.year_start}–{edu.year_end}
                        </Text>
                      </Column>
                    </Row>
                    {edu.description_id && (
                      <>
                        <Line background="neutral-alpha-weak" />
                        <Text variant="body-default-m" onBackground="neutral-weak">
                          {edu.description_id}
                        </Text>
                      </>
                    )}
                  </Column>
                </ScrollReveal>
              ))
            ) : (
              about.studies.institutions.map((inst, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <Column fillWidth gap="8" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
                    <Row gap="12" vertical="center">
                      <Text style={{ fontSize: 28 }}>🎓</Text>
                      <Text variant="heading-strong-l">{inst.name}</Text>
                    </Row>
                    <Text variant="body-default-m" onBackground="neutral-weak">{inst.description}</Text>
                  </Column>
                </ScrollReveal>
              ))
            )}
          </Column>

          {/* ── Keahlian Teknis ─────────────────────────────────── */}
          <ScrollReveal delay={140}>
            <Heading as="h2" id={about.technical.title} variant="display-strong-s" marginBottom="40">
              {about.technical.title}
            </Heading>
          </ScrollReveal>
          <Column fillWidth gap="l" marginBottom="40">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 70}>
                  <Column fillWidth gap="8" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
                    <Row gap="8" vertical="center">
                      {skill.icon && <Text style={{ fontSize: 22 }}>{skill.icon}</Text>}
                      <Text variant="heading-strong-m">{skill.title_id}</Text>
                    </Row>
                    {skill.description_id && (
                      <Text variant="body-default-m" onBackground="neutral-weak">{skill.description_id}</Text>
                    )}
                  </Column>
                </ScrollReveal>
              ))
            ) : (
              about.technical.skills.map((skill, i) => (
                <ScrollReveal key={i} delay={i * 70}>
                  <Column fillWidth gap="8" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
                    <Text variant="heading-strong-m">{skill.title}</Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">{skill.description}</Text>
                  </Column>
                </ScrollReveal>
              ))
            )}
          </Column>

          {/* ── Organisasi ──────────────────────────────────────── */}
          {organizations.length > 0 && (
            <>
              <ScrollReveal delay={160}>
                <Heading as="h2" id="organisasi" variant="display-strong-s" marginBottom="m">
                  Organisasi
                </Heading>
              </ScrollReveal>
              <Column fillWidth gap="m" marginBottom="40">
                {organizations.map((org, i) => (
                  <ScrollReveal key={org.id} delay={i * 60}>
                    <Card fillWidth border="neutral-alpha-weak" background="surface" radius="m" padding="m">
                      <Row fillWidth gap="m" vertical="center">
                        {org.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={org.logo} alt={org.name}
                            style={{ width: 48, height: 48, borderRadius: 8, objectFit: "contain", flexShrink: 0 }} />
                        ) : (
                          <Text style={{ fontSize: 28, flexShrink: 0 }}>🏛️</Text>
                        )}
                        <Column gap="4" flex={1}>
                          <Text variant="heading-strong-m">{org.name}</Text>
                          <Text variant="body-default-s" onBackground="brand-weak">{org.role_id}</Text>
                          <Text variant="body-default-xs" onBackground="neutral-weak">{org.year}</Text>
                        </Column>
                      </Row>
                      {org.description_id && (
                        <Text variant="body-default-s" onBackground="neutral-weak" style={{ marginTop: 8 }}>
                          {org.description_id}
                        </Text>
                      )}
                    </Card>
                  </ScrollReveal>
                ))}
              </Column>
            </>
          )}

          {/* ── Sertifikat ──────────────────────────────────────── */}
          {certificates.length > 0 && (
            <>
              <ScrollReveal delay={180}>
                <Heading as="h2" id="certificates" variant="display-strong-s" marginBottom="m">
                  Sertifikat
                </Heading>
              </ScrollReveal>
              <Column fillWidth gap="m" marginBottom="40">
                {certificates.map((cert, i) => (
                  <ScrollReveal key={cert.id} delay={i * 60}>
                    <Card href={`/certificate/${cert.id}`} fillWidth border="neutral-alpha-weak"
                      background="surface" radius="m" padding="m" transition="micro-medium">
                      <Row fillWidth gap="m" vertical="center">
                        {cert.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cert.thumbnail} alt={cert.title_id}
                            style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
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
            </>
          )}

        </Column>
      </Row>
    </Column>
  );
}
