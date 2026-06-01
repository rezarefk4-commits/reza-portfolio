import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer } = body;

    const supabase = await createClient();

    // Generate simple visitor ID from IP + User-Agent (hashed)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";
    const visitorId = btoa(`${ip}-${ua}`).slice(0, 64);

    await supabase.from("visitor_analytics").insert([
      {
        visitor_id: visitorId,
        page,
        referrer: referrer || null,
        user_agent: ua,
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
