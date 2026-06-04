import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title_id, thumbnail, gallery, published")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const projects = (data || []).map((p) => ({
    slug: p.slug,
    title: p.title_id,
    thumbnail_raw: p.thumbnail,
    thumbnail_type: typeof p.thumbnail,
    thumbnail_length: p.thumbnail?.length ?? 0,
    thumbnail_starts_with: p.thumbnail?.substring(0, 80) ?? null,
    has_query_string: p.thumbnail?.includes("?") ?? false,
    gallery_count: Array.isArray(p.gallery) ? p.gallery.length : 0,
    gallery_first: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0]?.substring(0, 80) : null,
  }));

  const html = `<!DOCTYPE html>
<html>
<head><title>Debug Thumbnail</title>
<style>
  body { font-family: monospace; background: #0d1117; color: #e6edf3; padding: 20px; }
  h1 { color: #58a6ff; }
  .project { border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin: 12px 0; }
  .title { font-size: 16px; font-weight: bold; color: #ffa657; margin-bottom: 8px; }
  .field { margin: 4px 0; }
  .label { color: #8b949e; }
  .value { color: #7ee787; word-break: break-all; }
  .null { color: #f85149; }
  img { max-width: 320px; border: 1px solid #30363d; border-radius: 4px; margin-top: 8px; display: block; }
  .error { color: #f85149; font-size: 11px; }
</style>
</head>
<body>
<h1>🔍 Debug Thumbnail — ${projects.length} projects</h1>
${error ? `<p style="color:red">DB Error: ${JSON.stringify(error)}</p>` : ""}
${projects.map(p => `
<div class="project">
  <div class="title">${p.title} (${p.slug})</div>
  <div class="field"><span class="label">thumbnail_raw: </span>
    <span class="${p.thumbnail_raw ? "value" : "null"}">${p.thumbnail_raw ?? "NULL / KOSONG"}</span>
  </div>
  <div class="field"><span class="label">has_query_string: </span><span class="value">${p.has_query_string}</span></div>
  <div class="field"><span class="label">gallery_count: </span><span class="value">${p.gallery_count}</span></div>
  ${p.thumbnail_raw ? `
  <div class="field"><span class="label">Test load gambar:</span></div>
  <img src="${p.thumbnail_raw}" alt="test" onerror="this.nextElementSibling.textContent='❌ GAGAL LOAD — '+this.src; this.style.display='none'">
  <div class="error"></div>
  <div class="field" style="margin-top:8px"><span class="label">Via proxy:</span></div>
  <img src="/api/image-proxy?url=${encodeURIComponent(p.thumbnail_raw)}" alt="proxy test" onerror="this.nextElementSibling.textContent='❌ Proxy juga GAGAL'; this.style.display='none'">
  <div class="error"></div>
  ` : ""}
</div>`).join("")}
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
