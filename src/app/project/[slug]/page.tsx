import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Button,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person } from "@/resources";
import { getProjectBySlug, getPublishedProjects } from "@/lib/db";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";
import { ScrollToHash } from "@/components";
import { ProjectContent } from "@/components/cms/ProjectContent";
import { format } from "date-fns";

export async function generateStaticParams() {
  const projects = await getPublishedProjects().catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return Meta.generate({
    title: project.title_id,
    description: project.description_id,
    baseURL,
    image: project.thumbnail || `/api/og/generate?title=${project.title_id}`,
    path: `/project/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`/project/${project.slug}`}
        title={project.title_id}
        description={project.description_id}
        datePublished={project.created_at}
        dateModified={project.updated_at}
        image={project.thumbnail || `/api/og/generate?title=${encodeURIComponent(project.title_id)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {format(new Date(project.created_at), "d MMMM yyyy")}
        </Text>
        <Heading variant="display-strong-m">{project.title_id}</Heading>
        {project.category && (
          <Text variant="label-strong-s" onBackground="brand-weak">
            {project.category}
          </Text>
        )}
      </Column>

      {project.live_demo_url && (
        <Row horizontal="center">
          <Button href={project.live_demo_url} variant="primary" size="m" prefixIcon="link">
            Live Demo
          </Button>
        </Row>
      )}

      {project.thumbnail && (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={project.title_id}
          src={project.thumbnail}
        />
      )}

      {/* Gallery images */}
      {project.gallery && project.gallery.length > 1 && (
        <Row fillWidth gap="12" wrap>
          {project.gallery.slice(1).map((img, i) => (
            <Media
              key={i}
              radius="m"
              alt={`Gallery ${i + 1}`}
              src={img}
              aspectRatio="16 / 9"
              style={{ flex: "1 1 300px" }}
            />
          ))}
        </Row>
      )}

      <ProjectContent project={project} />

      {project.attachment && (
        <Row horizontal="center">
          <Button href={project.attachment} variant="secondary" size="m" prefixIcon="download">
            Download Attachment
          </Button>
        </Row>
      )}

      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Proyek Terkait
        </Heading>
        <Projects exclude={[project.slug]} range={[1, 2]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
