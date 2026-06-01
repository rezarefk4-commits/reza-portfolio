"use client";

import { Card, Column, Media, Row, Avatar, Text } from "@once-ui-system/core";
import { person } from "@/resources";
import { useLang } from "@/lib/lang-context";
import type { Blog } from "@/lib/types";
import { format } from "date-fns";

interface CmsPostProps {
  post: Blog;
  thumbnail: boolean;
  direction?: "row" | "column";
}

export default function CmsPost({ post, thumbnail, direction }: CmsPostProps) {
  const { lang } = useLang();
  const title = lang === "en" ? post.title_en : post.title_id;
  const description = lang === "en" ? post.description_en : post.description_id;

  return (
    <Card
      fillWidth
      key={post.slug}
      href={`/blog/${post.slug}`}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.thumbnail && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={post.thumbnail}
          alt={"Thumbnail of " + title}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{person.name}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {format(new Date(post.created_at), "d MMM yyyy")}
            </Text>
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {title}
          </Text>
          {description && (
            <Text variant="label-strong-s" onBackground="neutral-weak">
              {description.slice(0, 100)}
              {description.length > 100 ? "..." : ""}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
