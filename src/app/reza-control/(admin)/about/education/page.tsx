import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { EducationClient } from "@/components/admin/about/EducationClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Pendidikan – Reza Control" };

const GradIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

export default async function EducationPage() {
  let data = [];
  try {
    const supabase = await createClient();
    const r = await supabase.from("about_education").select("*").order("sort_order");
    data = r.data ?? [];
  } catch { data = []; }
  return (
    <Column fillWidth gap="xl">
      <Row gap="8" vertical="center">
        <Button href="/reza-control/about" variant="tertiary" size="s" prefixIcon="chevronLeft">Back</Button>
        <Row gap="12" vertical="center">
          <div style={{ width:36,height:36,borderRadius:10,background:"var(--brand-alpha-weak)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--brand-on-background-strong)",flexShrink:0 }}>
            <GradIcon />
          </div>
          <Heading variant="display-strong-m">Pendidikan</Heading>
        </Row>
      </Row>
      <EducationClient initialData={data} />
    </Column>
  );
}
