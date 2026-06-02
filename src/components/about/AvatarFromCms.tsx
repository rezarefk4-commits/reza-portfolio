"use client";

import { Avatar } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import { person } from "@/resources";
import { useEffect, useState } from "react";

export function AvatarFromCms() {
  const [src, setSrc] = useState(person.avatar);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("settings")
      .select("avatar")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.avatar) {
          // strip stale cache buster, add fresh one
          const base = data.avatar.split("?")[0];
          setSrc(`${base}?t=${Date.now()}`);
        }
      });
  }, []);

  return <Avatar src={src} size="xl" />;
}
