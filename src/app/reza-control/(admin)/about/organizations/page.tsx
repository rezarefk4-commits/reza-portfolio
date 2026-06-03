import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { OrganizationsClient } from "@/components/admin/about/OrganizationsClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Organisasi – Reza Control" };

const OrgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default async function OrganizationsPage() {
  let data = [];
  try {
    const supabase = await createClient();
    const r = await supabase.from("about_organizations").select("*").order("sort_order");
    data = r.data ?? [];
  } catch { data = []; }
  return (
    <Column fillWidth gap="xl">
      <Row gap="8" vertical="center">
        <Button href="/reza-control/about" variant="tertiary" size="s" prefixIcon="chevronLeft">Back</Button>
        <Row gap="12" vertical="center">
          <div style={{ width:36,height:36,borderRadius:10,background:"var(--brand-alpha-weak)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--brand-on-background-strong)",flexShrink:0 }}>
            <OrgIcon />
          </div>
          <Heading variant="display-strong-m">Organisasi</Heading>
        </Row>
      </Row>
      <OrganizationsClient initialData={data} />
    </Column>
  );
}
