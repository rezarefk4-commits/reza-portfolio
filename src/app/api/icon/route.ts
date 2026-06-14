import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Fallback jika tidak ada favicon/avatar di settings
const FALLBACK_AVATAR =
  "https://baxvcjsensttnkupambu.supabase.co/storage/v1/object/public/avatars/1780364547823-7vnrjoqh2vu.png";

// no-store: selalu baca dari Supabase, tidak di-cache di edge/CDN
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get("size") === "512" ? 512 : 192;

  let iconUrl = FALLBACK_AVATAR;
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("settings")
      .select("favicon, avatar")
      .single();
    if (settings?.favicon) iconUrl = settings.favicon;
    else if (settings?.avatar) iconUrl = settings.avatar;
  } catch {
    // gunakan fallback
  }

  try {
    // no-store: jangan cache fetch ke Supabase, selalu ambil fresh
    const res = await fetch(iconUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        // no-cache: browser boleh cache tapi harus revalidate setiap kali
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Icon-Size": `${size}`,
      },
    });
  } catch {
    const fallback = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
