"use client";

import { Column } from "@once-ui-system/core";
import { useLang } from "@/lib/lang-context";
import type { Blog } from "@/lib/types";

interface BlogContentProps {
  post: Blog;
}

export function BlogContent({ post }: BlogContentProps) {
  const { lang } = useLang();
  const content = lang === "en" ? post.content_en : post.content_id;

  return (
    <Column as="article" maxWidth="s">
      <div
        className="cms-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Column>
  );
}
