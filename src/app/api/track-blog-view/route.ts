import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blog_id } = body;

    if (!blog_id) {
      return NextResponse.json({ ok: false, error: "blog_id required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Same visitor ID pattern as visitor_analytics
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";
    const visitorId = btoa(`${ip}-${ua}`).slice(0, 64);

    await supabase.from("blog_views").insert([
      {
        blog_id,
        visitor_id: visitorId,
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
