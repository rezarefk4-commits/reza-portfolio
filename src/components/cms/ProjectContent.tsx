"use client";

import { Column, Text } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { Project } from "@/lib/types";

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  const { lang } = useLang();
  const content = lang === "en" ? project.content_en : project.content_id;
  const description = lang === "en" ? project.description_en : project.description_id;
  const title = lang === "en" ? project.title_en : project.title_id;

  return (
    <Column style={{ margin: "auto" }} as="article" maxWidth="xs" gap="m">
      <Text variant="body-default-l" onBackground="neutral-weak">
        {description}
      </Text>
      {content && (
        <div
          className="cms-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </Column>
  );
}
