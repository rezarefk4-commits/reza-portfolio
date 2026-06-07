"use client";

import { useEffect } from "react";

interface ProjectViewTrackerProps {
  projectId: string;
}

export function ProjectViewTracker({ projectId }: ProjectViewTrackerProps) {
  useEffect(() => {
    if (!projectId) return;

    fetch("/api/track-project-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
    }).catch(() => {});
  }, [projectId]);

  return null;
}
