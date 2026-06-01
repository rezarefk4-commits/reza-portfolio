import { notFound } from "next/navigation";
import {
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Button,
  Meta,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getCertificateBySlug, getCertificates } from "@/lib/db";
import { Metadata } from "next";
import { format } from "date-fns";
import { ScrollToHash } from "@/components";

export async function generateStaticParams() {
  const certs = await getCertificates().catch(() => []);
  return certs.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);
  if (!cert) return {};

  return Meta.generate({
    title: cert.title_id,
    description: cert.description_id,
    baseURL,
    image: cert.thumbnail || `/api/og/generate?title=${cert.title_id}`,
    path: `/certificate/${cert.id}`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);

  if (!cert) notFound();

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/about#certificates">
          <Text variant="label-strong-m">Certificates</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {format(new Date(cert.issue_date), "MMMM yyyy")}
        </Text>
        <Heading variant="display-strong-m">{cert.title_id}</Heading>
        <Text variant="label-strong-s" onBackground="brand-weak">
          {cert.issuer}
        </Text>
      </Column>

      {cert.thumbnail && (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={cert.title_id}
          src={cert.thumbnail}
        />
      )}

      {cert.description_id && (
        <Column maxWidth="xs" style={{ margin: "auto" }}>
          <Text variant="body-default-l" onBackground="neutral-weak">
            {cert.description_id}
          </Text>
        </Column>
      )}

      {cert.pdf && (
        <Row horizontal="center">
          <Button href={cert.pdf} variant="secondary" size="m" prefixIcon="download">
            Download Certificate
          </Button>
        </Row>
      )}
      <ScrollToHash />
    </Column>
  );
}
