import { NextRequest, NextResponse } from "next/server";

/**
 * Video Proxy — /api/video-proxy?url=<encoded_url>
 *
 * Proxy video dari Supabase Storage dengan dukungan:
 * - HTTP Range requests (wajib untuk video streaming di browser)
 * - CORS headers yang benar
 * - Content-Type yang tepat sesuai ekstensi file
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "Parameter 'url' wajib diisi" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(videoUrl);
  } catch {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  if (parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Hanya HTTPS yang diizinkan" }, { status: 400 });
  }

  const allowedHosts = [".supabase.co", ".supabase.in", "supabase.co"];
  const isAllowed = allowedHosts.some((h) => parsedUrl.hostname.endsWith(h));
  if (!isAllowed) {
    return NextResponse.json({ error: "Domain tidak diizinkan" }, { status: 403 });
  }

  // Deteksi content-type dari ekstensi
  const ext = parsedUrl.pathname.split(".").pop()?.toLowerCase() ?? "";
  const MIME: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    ogg: "video/ogg",
    mkv: "video/x-matroska",
    avi: "video/x-msvideo",
    m4v: "video/mp4",
  };
  const contentType = MIME[ext] ?? "video/mp4";

  // Forward Range header dari browser (penting untuk video seeking)
  const rangeHeader = request.headers.get("range");
  const fetchHeaders: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (compatible; NextJS-Video-Proxy/1.0)",
  };
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  try {
    const upstream = await fetch(videoUrl, {
      headers: fetchHeaders,
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: `Gagal mengambil video: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status }
      );
    }

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    };

    // Forward headers penting dari upstream
    const forwardHeaders = ["content-length", "content-range", "content-encoding"];
    for (const h of forwardHeaders) {
      const v = upstream.headers.get(h);
      if (v) responseHeaders[h] = v;
    }

    const status = upstream.status === 206 ? 206 : 200;
    return new NextResponse(upstream.body, { status, headers: responseHeaders });

  } catch (error) {
    console.error("[video-proxy] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil video dari server" }, { status: 500 });
  }
}
