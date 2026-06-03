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
import {
  getCertificates,
  getAboutEducation,
  getAboutExperiences,
  getAboutSkills,
  getAboutOrganizations,
} from "@/lib/db";
import { format } from "date-fns";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AvatarFromCms } from "@/components/about/AvatarFromCms";
import { SkillsMarquee } from "@/components/about/SkillsMarquee";

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

  const structure = [
    { title: about.intro.title,     display: about.intro.display,     items: [] },
    { title: about.work.title,      display: true,                     items: [] },
    { title: about.studies.title,   display: true,                     items: [] },
    { title: "Keahlian",            display: true,                     items: [] },
    { title: "Organisasi",          display: organizations.length > 0, items: [] },
    { title: "Sertifikat",          display: certificates.length > 0,  items: [] },
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

        {/* ── Avatar Sidebar ──────────────────────────────────────────── */}
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

          {/* ── Nama + Social ───────────────────────────────────────── */}
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

          {/* ── Intro ──────────────────────────────────────────────── */}
          {about.intro.display && (
            <ScrollReveal delay={80}>
              <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
                {about.intro.description}
              </Column>
            </ScrollReveal>
          )}

          {/* ══════════════════════════════════════════════════════════
              PENGALAMAN KERJA — Timeline style
          ══════════════════════════════════════════════════════════ */}
          <ScrollReveal delay={100}>
            <Row fillWidth vertical="center" gap="m" marginBottom="l">
              <div style={{ width: 4, height: 28, borderRadius: 2, background: "var(--brand-background-strong)", flexShrink: 0 }} />
              <Heading as="h2" id={about.work.title} variant="display-strong-s">
                {about.work.title}
              </Heading>
            </Row>
          </ScrollReveal>

          <Column fillWidth gap="0" marginBottom="48" style={{ position: "relative" }}>
            {/* Vertical timeline line */}
            <div style={{
              position: "absolute", left: 19, top: 8, bottom: 8, width: 2,
              background: "linear-gradient(to bottom, var(--brand-alpha-medium), var(--neutral-alpha-weak))",
              borderRadius: 2,
            }} />

            {(experiences.length > 0 ? experiences : about.work.experiences).map((exp, i) => {
              const isCms = experiences.length > 0;
              return (
                <ScrollReveal key={isCms ? (exp as typeof experiences[0]).id : i} delay={i * 80}>
                  <Row fillWidth gap="l" paddingBottom="32">
                    {/* Timeline dot */}
                    <div style={{ position: "relative", flexShrink: 0, paddingTop: 4 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: i === 0 ? "var(--brand-background-strong)" : "var(--neutral-background-strong)",
                        border: `2px solid ${i === 0 ? "var(--brand-background-strong)" : "var(--neutral-alpha-medium)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, zIndex: 1, position: "relative",
                        boxShadow: i === 0 ? "0 0 12px var(--brand-alpha-medium)" : "none",
                      }}>
                        💼
                      </div>
                    </div>

                    {/* Content */}
                    <Column flex={1} gap="8" paddingTop="4">
                      <Row fillWidth horizontal="between" vertical="start" wrap gap="8">
                        <Text variant="heading-strong-l">
                          {isCms ? (exp as typeof experiences[0]).company : (exp as typeof about.work.experiences[0]).company}
                        </Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak"
                          style={{ background: "var(--neutral-alpha-weak)", padding: "3px 10px", borderRadius: 99, flexShrink: 0 }}>
                          {isCms ? (exp as typeof experiences[0]).timeframe : (exp as typeof about.work.experiences[0]).timeframe}
                        </Text>
                      </Row>
                      <Text variant="body-default-s" onBackground="brand-weak">
                        {isCms ? (exp as typeof experiences[0]).role_id : (exp as typeof about.work.experiences[0]).role}
                      </Text>
                      {isCms
                        ? (exp as typeof experiences[0]).description_id && (
                            <Text variant="body-default-m" onBackground="neutral-weak">
                              {(exp as typeof experiences[0]).description_id}
                            </Text>
                          )
                        : (exp as typeof about.work.experiences[0]).achievements?.map((a: React.ReactNode, j: number) => (
                            <Text as="li" variant="body-default-m" key={j} style={{ listStyle: "none", paddingLeft: 12, borderLeft: "2px solid var(--neutral-alpha-weak)" }}>
                              {a}
                            </Text>
                          ))
                      }
                    </Column>
                  </Row>
                </ScrollReveal>
              );
            })}
          </Column>

          {/* ══════════════════════════════════════════════════════════
              PENDIDIKAN — Card dengan glow + logo animasi
          ══════════════════════════════════════════════════════════ */}
          <ScrollReveal delay={120}>
            <Row fillWidth vertical="center" gap="m" marginBottom="l">
              <div style={{ width: 4, height: 28, borderRadius: 2, background: "var(--accent-background-strong)", flexShrink: 0 }} />
              <Heading as="h2" id={about.studies.title} variant="display-strong-s">
                {about.studies.title}
              </Heading>
            </Row>
          </ScrollReveal>

          <Column fillWidth gap="l" marginBottom="48">
            {educations.length > 0 ? (
              educations.map((edu, i) => (
                <ScrollReveal key={edu.id} delay={i * 80}>
                  <div style={{
                    borderRadius: 16, overflow: "hidden",
                    border: "1px solid var(--neutral-alpha-weak)",
                    background: "var(--neutral-background-medium)",
                    position: "relative",
                  }}>
                    {/* Top accent bar */}
                    <div style={{
                      height: 4,
                      background: "linear-gradient(90deg, var(--brand-background-strong), var(--accent-background-strong))",
                    }} />
                    <div style={{ padding: "24px" }}>
                      <Row gap="l" vertical="center" wrap>
                        {/* Logo with float+glow animation */}
                        <div style={{ flexShrink: 0 }}>
                          {edu.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={edu.logo} alt={edu.university_name}
                              className="university-logo"
                              style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 12 }} />
                          ) : (
                            <div className="university-logo" style={{
                              width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                              background: "var(--brand-alpha-weak)",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                            }}>🎓</div>
                          )}
                        </div>
                        <Column gap="8" flex={1}>
                          <Text variant="heading-strong-xl">{edu.university_name}</Text>
                          <Row gap="8" wrap>
                            <span style={{
                              fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                              background: "var(--brand-alpha-weak)", color: "var(--brand-on-background-medium)",
                            }}>{edu.degree}</span>
                            <span style={{
                              fontSize: 12, padding: "3px 10px", borderRadius: 99,
                              background: "var(--neutral-alpha-weak)", color: "var(--neutral-on-background-weak)",
                            }}>{edu.year_start} – {edu.year_end || "Sekarang"}</span>
                          </Row>
                          <Text variant="body-default-m" onBackground="neutral-weak">
                            {edu.faculty && <><strong>{edu.faculty}</strong> · </>}{edu.major}
                          </Text>
                        </Column>
                      </Row>
                      {edu.description_id && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--neutral-alpha-weak)" }}>
                          <Text variant="body-default-m" onBackground="neutral-weak">{edu.description_id}</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              about.studies.institutions.map((inst, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div style={{
                    borderRadius: 16, overflow: "hidden",
                    border: "1px solid var(--neutral-alpha-weak)",
                    background: "var(--neutral-background-medium)",
                  }}>
                    <div style={{ height: 4, background: "linear-gradient(90deg, var(--brand-background-strong), var(--accent-background-strong))" }} />
                    <div style={{ padding: 24 }}>
                      <Row gap="12" vertical="center">
                        <span style={{ fontSize: 40 }}>🎓</span>
                        <Column gap="4">
                          <Text variant="heading-strong-l">{inst.name}</Text>
                          <Text variant="body-default-m" onBackground="neutral-weak">{inst.description}</Text>
                        </Column>
                      </Row>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </Column>

          {/* ══════════════════════════════════════════════════════════
              KEAHLIAN — Marquee logo running horizontal
          ══════════════════════════════════════════════════════════ */}
          <ScrollReveal delay={140}>
            <Row fillWidth vertical="center" gap="m" marginBottom="l">
              <div style={{ width: 4, height: 28, borderRadius: 2, background: "#22d3ee", flexShrink: 0 }} />
              <Heading as="h2" id="keahlian" variant="display-strong-s">Keahlian</Heading>
            </Row>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <Column fillWidth marginBottom="48" gap="m">
              {skills.length > 0 ? (
                <SkillsMarquee initialSkills={skills} />
              ) : (
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Belum ada keahlian yang ditambahkan.
                </Text>
              )}
            </Column>
          </ScrollReveal>

          {/* ══════════════════════════════════════════════════════════
              ORGANISASI — Compact list dengan garis kiri warna
          ══════════════════════════════════════════════════════════ */}
          {organizations.length > 0 && (
            <>
              <ScrollReveal delay={180}>
                <Row fillWidth vertical="center" gap="m" marginBottom="l">
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: "#a78bfa", flexShrink: 0 }} />
                  <Heading as="h2" id="organisasi" variant="display-strong-s">Organisasi</Heading>
                </Row>
              </ScrollReveal>
              <Column fillWidth gap="m" marginBottom="48">
                {organizations.map((org, i) => (
                  <ScrollReveal key={org.id} delay={i * 60}>
                    <Row fillWidth gap="m" padding="m"
                      style={{
                        borderRadius: 12,
                        border: "1px solid var(--neutral-alpha-weak)",
                        background: "var(--neutral-background-medium)",
                        borderLeft: "4px solid #a78bfa",
                      }}
                      vertical="center">
                      {org.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={org.logo} alt={org.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: "contain", flexShrink: 0 }} />
                      ) : (
                        <span style={{ fontSize: 28, flexShrink: 0 }}>🏛️</span>
                      )}
                      <Column flex={1} gap="4">
                        <Text variant="heading-strong-m">{org.name}</Text>
                        <Text variant="body-default-s" onBackground="brand-weak">{org.role_id}</Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">{org.year}</Text>
                      </Column>
                    </Row>
                  </ScrollReveal>
                ))}
              </Column>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════
              SERTIFIKAT — Grid cards
          ══════════════════════════════════════════════════════════ */}
          {certificates.length > 0 && (
            <>
              <ScrollReveal delay={200}>
                <Row fillWidth vertical="center" gap="m" marginBottom="l">
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: "#f59e0b", flexShrink: 0 }} />
                  <Heading as="h2" id="certificates" variant="display-strong-s">Sertifikat</Heading>
                </Row>
              </ScrollReveal>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
                marginBottom: 48,
              }}>
                {certificates.map((cert, i) => (
                  <ScrollReveal key={cert.id} delay={i * 40}>
                    <a href={`/certificate/${cert.id}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{
                        borderRadius: 12, overflow: "hidden",
                        border: "1px solid var(--neutral-alpha-weak)",
                        background: "var(--neutral-background-medium)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {cert.thumbnail && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cert.thumbnail} alt={cert.title_id}
                            style={{ width: "100%", height: 120, objectFit: "cover" }} />
                        )}
                        <div style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            {!cert.thumbnail && <span style={{ fontSize: 20 }}>🏆</span>}
                            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--neutral-on-background-strong)" }}>
                              {cert.title_id}
                            </span>
                          </div>
                          <span style={{ fontSize: 12, color: "var(--brand-on-background-weak)" }}>
                            {cert.issuer}
                          </span>
                          <div style={{ marginTop: 4, fontSize: 11, color: "var(--neutral-on-background-weak)" }}>
                            {format(new Date(cert.issue_date), "MMMM yyyy")}
                          </div>
                        </div>
                      </div>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}

        </Column>
      </Row>
    </Column>
  );
}
