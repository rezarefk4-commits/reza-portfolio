"use client";

import { useEffect } from "react";

interface BlogViewTrackerProps {
  blogId: string;
}

export function BlogViewTracker({ blogId }: BlogViewTrackerProps) {
  useEffect(() => {
    if (!blogId) return;

    fetch("/api/track-blog-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blog_id: blogId }),
    }).catch(() => {});
  }, [blogId]);

  return null;
}
