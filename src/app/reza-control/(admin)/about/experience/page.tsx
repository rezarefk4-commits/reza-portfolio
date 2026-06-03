import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { ExperienceClient } from "@/components/admin/about/ExperienceClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Pengalaman – Reza Control" };

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/><path d="M2 12h20"/>
  </svg>
);

export default async function ExperiencePage() {
  let data = [];
  try {
    const supabase = await createClient();
    const r = await supabase.from("about_experiences").select("*").order("sort_order");
    data = r.data ?? [];
  } catch { data = []; }
  return (
    <Column fillWidth gap="xl">
      <Row gap="8" vertical="center">
        <Button href="/reza-control/about" variant="tertiary" size="s" prefixIcon="chevronLeft">Back</Button>
        <Row gap="12" vertical="center">
          <div style={{ width:36,height:36,borderRadius:10,background:"var(--brand-alpha-weak)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--brand-on-background-strong)",flexShrink:0 }}>
            <BriefcaseIcon />
          </div>
          <Heading variant="display-strong-m">Pengalaman Kerja</Heading>
        </Row>
      </Row>
      <ExperienceClient initialData={data} />
    </Column>
  );
}
