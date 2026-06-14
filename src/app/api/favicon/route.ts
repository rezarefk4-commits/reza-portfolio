import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_AVATAR =
  "https://baxvcjsensttnkupambu.supabase.co/storage/v1/object/public/avatars/1780364547823-7vnrjoqh2vu.png";

export const revalidate = 3600;

export async function GET() {
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
    // use fallback
  }

  try {
    const res = await fetch(iconUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const buf = await res.arrayBuffer();
    const ct = res.headers.get("content-type") || "image/png";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    const fallback = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new NextResponse(fallback, { headers: { "Content-Type": "image/png" } });
  }
}
