"use client";

import { createClient } from "@/lib/supabase/client";
import { person } from "@/resources";
import { useEffect, useState } from "react";

export function AvatarFromCms() {
  const [src, setSrc] = useState<string>(person.avatar);
  const [loaded, setLoaded] = useState(false);

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
          // Gunakan URL bersih tanpa cache buster
          const clean = data.avatar.split("?")[0];
          setSrc(clean);
        }
      });
  }, []);

  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid var(--neutral-alpha-medium)",
        background: "var(--neutral-alpha-weak)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={person.name}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          // fallback ke avatar lokal kalau gagal load
          (e.target as HTMLImageElement).src = person.avatar;
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
