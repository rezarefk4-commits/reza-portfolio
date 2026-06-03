import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { EducationClient } from "@/components/admin/about/EducationClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Pendidikan – Reza Control" };
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
        <Heading variant="display-strong-m">🎓 Pendidikan</Heading>
      </Row>
      <EducationClient initialData={data} />
    </Column>
  );
}
