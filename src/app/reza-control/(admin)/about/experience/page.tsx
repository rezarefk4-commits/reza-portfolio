import { Column, Row, Heading, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/server";
import { ExperienceClient } from "@/components/admin/about/ExperienceClient";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Pengalaman – Reza Control" };
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
        <Heading variant="display-strong-m">💼 Pengalaman Kerja</Heading>
      </Row>
      <ExperienceClient initialData={data} />
    </Column>
  );
}
