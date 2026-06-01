"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Column, Row, Text, Button, Input, Line } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Certificate } from "@/lib/types";

interface CertificateFormProps {
  certificate?: Certificate;
}

export function CertificateForm({ certificate }: CertificateFormProps) {
  const router = useRouter();
  const isEdit = !!certificate;

  const [form, setForm] = useState({
    title_id: certificate?.title_id ?? "",
    title_en: certificate?.title_en ?? "",
    issuer: certificate?.issuer ?? "",
    description_id: certificate?.description_id ?? "",
    description_en: certificate?.description_en ?? "",
    issue_date: certificate?.issue_date
      ? certificate.issue_date.split("T")[0]
      : new Date().toISOString().split("T")[0],
    thumbnail: certificate?.thumbnail ?? "",
    pdf: certificate?.pdf ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title_id || !form.issuer) {
      setError("Judul (ID) dan penerbit wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const payload = { ...form, updated_at: new Date().toISOString() };
    let err;

    if (isEdit) {
      ({ error: err } = await supabase.from("certificates").update(payload).eq("id", certificate!.id));
    } else {
      ({ error: err } = await supabase.from("certificates").insert([
        { ...payload, created_at: new Date().toISOString() },
      ]));
    }

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/reza-control/certificates");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!certificate) return;
    if (!confirm(`Hapus sertifikat "${certificate.title_id}"?`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("certificates").delete().eq("id", certificate.id);
    router.push("/reza-control/certificates");
    router.refresh();
  };

  return (
    <Column fillWidth gap="xl" paddingBottom="80">
      <Column gap="m" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
        <Text variant="label-strong-m">Informasi Sertifikat</Text>
        <Line background="neutral-alpha-weak" />

        <Row gap="m" s={{ direction: "column" }}>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Judul (Indonesia) *</Text>
            <Input id="title_id" value={form.title_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("title_id", e.target.value)}
              placeholder="Nama sertifikat..." />
          </Column>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Judul (English)</Text>
            <Input id="title_en" value={form.title_en}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("title_en", e.target.value)}
              placeholder="Certificate name..." />
          </Column>
        </Row>

        <Row gap="m" s={{ direction: "column" }}>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Penerbit / Issuer *</Text>
            <Input id="issuer" value={form.issuer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("issuer", e.target.value)}
              placeholder="Google, Coursera, dll..." />
          </Column>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Tanggal Terbit</Text>
            <Input id="issue_date" type="date" value={form.issue_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("issue_date", e.target.value)} />
          </Column>
        </Row>

        <Column gap="s">
          <Text variant="label-strong-s">Deskripsi (Indonesia)</Text>
          <textarea value={form.description_id} onChange={(e) => set("description_id", e.target.value)}
            placeholder="Deskripsi sertifikat..." rows={3}
            style={{ background: "var(--neutral-background-medium)", border: "1px solid var(--neutral-alpha-medium)",
              borderRadius: 8, padding: "10px 12px", color: "var(--neutral-on-background-strong)",
              fontSize: 14, width: "100%", resize: "vertical", fontFamily: "inherit" }} />
        </Column>
        <Column gap="s">
          <Text variant="label-strong-s">Description (English)</Text>
          <textarea value={form.description_en} onChange={(e) => set("description_en", e.target.value)}
            placeholder="Certificate description..." rows={3}
            style={{ background: "var(--neutral-background-medium)", border: "1px solid var(--neutral-alpha-medium)",
              borderRadius: 8, padding: "10px 12px", color: "var(--neutral-on-background-strong)",
              fontSize: 14, width: "100%", resize: "vertical", fontFamily: "inherit" }} />
        </Column>
      </Column>

      <Column gap="m" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
        <Text variant="label-strong-m">Thumbnail</Text>
        <Line background="neutral-alpha-weak" />
        <ImageUpload bucket="certificates" value={form.thumbnail} onChange={(url) => set("thumbnail", url)} />
      </Column>

      <Column gap="m" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
        <Text variant="label-strong-m">File PDF</Text>
        <Line background="neutral-alpha-weak" />
        <ImageUpload bucket="certificates" value={form.pdf} onChange={(url) => set("pdf", url)}
          accept=".pdf" label="Upload PDF sertifikat" />
      </Column>

      {error && <Text variant="body-default-s" onBackground="danger-strong">{error}</Text>}

      <Row gap="m" wrap>
        <Button onClick={handleSubmit} variant="primary" size="m" loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Sertifikat"}
        </Button>
        <Button href="/reza-control/certificates" variant="secondary" size="m">Batal</Button>
        {isEdit && (
          <Button onClick={handleDelete} variant="danger" size="m" loading={deleting}
            style={{ marginLeft: "auto" }}>
            Hapus Sertifikat
          </Button>
        )}
      </Row>
    </Column>
  );
}
