"use client";

import { createClient } from "@/lib/supabase/client";
import { person } from "@/resources";
import { useEffect, useState } from "react";

interface SmallAvatarFromCmsProps {
  size?: number; // px, default 32
}

export function SmallAvatarFromCms({ size = 32 }: SmallAvatarFromCmsProps) {
  const [src, setSrc] = useState<string>(person.avatar);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("avatar")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.avatar) setSrc(data.avatar.split("?")[0]);
      });
  }, []);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={person.name}
      width={size}
      height={size}
      onError={(e) => { (e.target as HTMLImageElement).src = person.avatar; }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid var(--neutral-alpha-medium)",
        flexShrink: 0,
      }}
    />
  );
}
