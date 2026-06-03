import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { SkillsClient } from "@/components/admin/about/SkillsClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Keahlian – Reza Control" };

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export default async function SkillsPage() {
  let data = [];
  try {
    const supabase = await createClient();
    const r = await supabase.from("about_skills").select("*").order("sort_order");
    data = r.data ?? [];
  } catch { data = []; }
  return (
    <Column fillWidth gap="xl">
      <Row gap="8" vertical="center">
        <Button href="/reza-control/about" variant="tertiary" size="s" prefixIcon="chevronLeft">Back</Button>
        <Row gap="12" vertical="center">
          <div style={{ width:36,height:36,borderRadius:10,background:"var(--brand-alpha-weak)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--brand-on-background-strong)",flexShrink:0 }}>
            <ZapIcon />
          </div>
          <Heading variant="display-strong-m">Keahlian Teknis</Heading>
        </Row>
      </Row>
      <SkillsClient initialData={data} />
    </Column>
  );
}
