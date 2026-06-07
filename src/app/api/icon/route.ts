import { NextResponse } from "next/server";

const AVATAR_URL =
  "https://baxvcjsensttnkupambu.supabase.co/storage/v1/object/public/avatars/1780364547823-7vnrjoqh2vu.png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get("size") === "512" ? 512 : 192;

  try {
    const res = await fetch(AVATAR_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("fetch failed");
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
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
