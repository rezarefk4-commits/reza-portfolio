import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .limit(3);

  return NextResponse.json({ 
    data,
    error,
    columns: data && data[0] ? Object.keys(data[0]) : [],
    firstProject: data && data[0] ? {
      thumbnail: data[0].thumbnail,
      tools: data[0].tools,
      tools_: (data[0] as Record<string,unknown>)["tools_"],
      gallery: data[0].gallery,
      gallery_: (data[0] as Record<string,unknown>)["gallery_"],
    } : null
  });
}
