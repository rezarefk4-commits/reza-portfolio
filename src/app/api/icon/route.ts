import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Fallback icon jika tidak ada favicon di settings
const FALLBACK_AVATAR =
  "https://baxvcjsensttnkupambu.supabase.co/storage/v1/object/public/avatars/1780364547823-7vnrjoqh2vu.png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get("size") === "512" ? 512 : 192;

  // Ambil favicon URL dari settings Supabase
  let iconUrl = FALLBACK_AVATAR;
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("settings")
      .select("favicon, avatar")
      .single();

    // Prioritas: favicon → avatar → fallback hardcode
    if (settings?.favicon) {
      iconUrl = settings.favicon;
    } else if (settings?.avatar) {
      iconUrl = settings.avatar;
    }
  } catch {
    // silently use fallback
  }

  try {
    const res = await fetch(iconUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("fetch failed");
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Icon-Size": `${size}`,
      },
    });
  } catch {
    // Fallback: 1x1 transparent PNG
    const fallback = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new NextResponse(fallback, {
      headers: { "Content-Type": "image/png" },
    });
  }
}
