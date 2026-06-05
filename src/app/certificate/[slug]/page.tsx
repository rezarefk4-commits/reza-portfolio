export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import {
  Column, Heading, Text, SmartLink, Row, Button, Meta, Line,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getCertificateBySlug, getCertificates } from "@/lib/db";
import { Metadata } from "next";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ScrollToHash } from "@/components";

function safeDate(d: string | null | undefined, fmt: string, opts?: Parameters<typeof format>[2]): string {
  if (!d) return "—";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return format(date, fmt, opts);
  } catch { return "—"; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug).catch(() => null);
  if (!cert) return {};
  return Meta.generate({
    title: cert.title_id,
    description: cert.description_id || `Sertifikat dari ${cert.issuer}`,
    baseURL,
    image: cert.thumbnail || `/api/og/generate?title=${encodeURIComponent(cert.title_id)}`,
    path: `/certificate/${cert.id}`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug).catch(() => null);
  if (!cert) notFound();

  // Ambil sertifikat lain untuk seksi "Sertifikat Lainnya"
  const allCerts = await getCertificates().catch(() => []);
  const otherCerts = allCerts.filter((c) => c.id !== cert.id).slice(0, 3);

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <Column maxWidth="s" gap="12" horizontal="center" align="center">
        <SmartLink href="/about#certificates">
          <Text variant="label-strong-m">← Kembali ke Sertifikat</Text>
        </SmartLink>

        <Text variant="body-default-xs" onBackground="neutral-weak">
          {safeDate(cert.issue_date, "MMMM yyyy", { locale: localeId })}
        </Text>

        <Heading variant="display-strong-m" style={{ textAlign: "center", lineHeight: 1.2 }}>
          {cert.title_id}
        </Heading>

        {/* Issuer badge */}
        <span style={{
          padding: "4px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
          background: "var(--brand-alpha-weak)", color: "var(--brand-on-background-medium)",
          border: "1px solid var(--brand-alpha-medium)", letterSpacing: "0.02em",
        }}>
          {cert.issuer}
        </span>
      </Column>

      {/* ── Tombol Aksi ─────────────────────────────────────────────── */}
      {cert.pdf && (
        <Row gap="12" horizontal="center" wrap>
          <Button
            href={cert.pdf}
            target="_blank"
            variant="primary"
            size="m"
            prefixIcon="download"
          >
            Unduh Sertifikat (PDF)
          </Button>
        </Row>
      )}

      {/* ── Thumbnail ───────────────────────────────────────────────── */}
      {cert.thumbnail && (
        <div style={{
          width: "100%", borderRadius: 16, overflow: "hidden",
          border: "1px solid var(--neutral-alpha-weak)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.thumbnail}
            alt={cert.title_id}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}

      {/* ── Info Card ───────────────────────────────────────────────── */}
      <div style={{
        width: "100%", borderRadius: 16,
        border: "1px solid var(--neutral-alpha-weak)",
        background: "var(--neutral-background-medium)",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <Text variant="label-strong-m" onBackground="neutral-weak">Detail Sertifikat</Text>
        <Line background="neutral-alpha-weak" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          <div>
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: 4 }}>
              Penerbit
            </Text>
            <Text variant="label-strong-s">{cert.issuer}</Text>
          </div>
          <div>
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: 4 }}>
              Tanggal Terbit
            </Text>
            <Text variant="label-strong-s">
              {safeDate(cert.issue_date, "d MMMM yyyy", { locale: localeId })}
            </Text>
          </div>
          {cert.title_en && cert.title_en !== cert.title_id && (
            <div>
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: 4 }}>
                Judul (EN)
              </Text>
              <Text variant="label-strong-s">{cert.title_en}</Text>
            </div>
          )}
        </div>
      </div>

      {/* ── Deskripsi ───────────────────────────────────────────────── */}
      {cert.description_id && (
        <Column maxWidth="s" style={{ margin: "0 auto", width: "100%" }} gap="12">
          <Text variant="label-strong-m" onBackground="neutral-weak">Deskripsi</Text>
          <Text variant="body-default-l" onBackground="neutral-weak" style={{ lineHeight: 1.75 }}>
            {cert.description_id}
          </Text>
          {cert.description_en && cert.description_en !== cert.description_id && (
            <Text variant="body-default-m" onBackground="neutral-weak"
              style={{ lineHeight: 1.75, fontStyle: "italic", opacity: 0.7 }}>
              {cert.description_en}
            </Text>
          )}
        </Column>
      )}

      {/* ── Sertifikat Lainnya ───────────────────────────────────────── */}
      {otherCerts.length > 0 && (
        <Column fillWidth gap="24" marginTop="24">
          <Line maxWidth="40" />
          <Heading as="h2" variant="heading-strong-xl">Sertifikat Lainnya</Heading>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}>
            {otherCerts.map((c) => (
              <a key={c.id} href={`/certificate/${c.id}`}
                style={{ textDecoration: "none", display: "block" }}>
                <div className="cert-card" style={{
                  borderRadius: 12, overflow: "hidden",
                  border: "1px solid var(--neutral-alpha-weak)",
                  background: "var(--neutral-background-medium)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  {c.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnail} alt={c.title_id}
                      style={{ width: "100%", height: 110, objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "12px 14px" }}>
                    <Text variant="label-strong-s" style={{ marginBottom: 2 }}>{c.title_id}</Text>
                    <Text variant="label-default-xs" onBackground="brand-weak">{c.issuer}</Text>
                    <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginTop: 4 }}>
                      {safeDate(c.issue_date, "MMMM yyyy", { locale: localeId })}
                    </Text>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Column>
      )}

      <ScrollToHash />
    </Column>
  );
}
