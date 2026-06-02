"use client";

import { useState } from "react";
import { Column, Row, Text, Button, Input, Line, Card } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { AboutEducation } from "@/lib/types";

interface Props { initialData: AboutEducation[]; }

const empty = (): Omit<AboutEducation, "id" | "created_at" | "updated_at"> => ({
  university_name: "",
  faculty: "",
  major: "",
  degree: "S1",
  year_start: new Date().getFullYear().toString(),
  year_end: "",
  logo: "",
  description_id: "",
  description_en: "",
  sort_order: 0,
});

export function EducationClient({ initialData }: Props) {
  const [items, setItems]     = useState<AboutEducation[]>(initialData);
  const [editing, setEditing] = useState<Partial<AboutEducation> | null>(null);
  const [isNew, setIsNew]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");

  const set = (k: string, v: unknown) => setEditing((e) => e ? { ...e, [k]: v } : e);

  const handleSave = async () => {
    if (!editing?.university_name) { setMsg("Nama universitas wajib diisi."); return; }
    setLoading(true); setMsg("");
    const supabase = createClient();
    const payload = { ...editing, updated_at: new Date().toISOString() };

    if (isNew) {
      const { data, error } = await supabase.from("about_education")
        .insert([{ ...payload, created_at: new Date().toISOString() }])
        .select().single();
      if (error) { setMsg(error.message); }
      else { setItems((p) => [...p, data]); setEditing(null); }
    } else {
      const { error } = await supabase.from("about_education")
        .update(payload).eq("id", editing.id!);
      if (error) { setMsg(error.message); }
      else { setItems((p) => p.map((x) => x.id === editing.id ? { ...x, ...editing } as AboutEducation : x)); setEditing(null); }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pendidikan ini?")) return;
    const supabase = createClient();
    await supabase.from("about_education").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const inputStyle = {
    background: "var(--neutral-background-medium)",
    border: "1px solid var(--neutral-alpha-medium)",
    borderRadius: 8, padding: "10px 12px",
    color: "var(--neutral-on-background-strong)",
    fontSize: 14, width: "100%", fontFamily: "inherit",
  };

  // ── Form ───────────────────────────────────────────────────────────────────
  if (editing !== null) return (
    <Column fillWidth gap="l" paddingBottom="80">
      <Column gap="m" border="neutral-alpha-weak" radius="l" padding="l" background="surface">
        <Text variant="label-strong-m">{isNew ? "Tambah Pendidikan Baru" : "Edit Pendidikan"}</Text>
        <Line background="neutral-alpha-weak" />

        <Column gap="s">
          <Text variant="label-strong-s">Nama Universitas *</Text>
          <Input id="uni" value={editing.university_name ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("university_name", e.target.value)}
            placeholder="Universitas Hasanuddin" />
        </Column>

        <Row gap="m" s={{ direction: "column" }}>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Fakultas</Text>
            <Input id="faculty" value={editing.faculty ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("faculty", e.target.value)}
              placeholder="Fakultas Teknik" />
          </Column>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Jurusan / Program Studi</Text>
            <Input id="major" value={editing.major ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("major", e.target.value)}
              placeholder="Teknik Informatika" />
          </Column>
        </Row>

        <Row gap="m" s={{ direction: "column" }}>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Jenjang</Text>
            <select value={editing.degree ?? "S1"} onChange={(e) => set("degree", e.target.value)} style={inputStyle}>
              {["D3","S1","S2","S3","Profesi","Vokasi"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </Column>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Tahun Masuk</Text>
            <Input id="ys" value={editing.year_start ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("year_start", e.target.value)}
              placeholder="2020" />
          </Column>
          <Column gap="s" flex={1}>
            <Text variant="label-strong-s">Tahun Lulus</Text>
            <Input id="ye" value={editing.year_end ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("year_end", e.target.value)}
              placeholder="2024 / Sekarang" />
          </Column>
        </Row>

        <Column gap="s">
          <Text variant="label-strong-s">Deskripsi (Indonesia)</Text>
          <textarea value={editing.description_id ?? ""} onChange={(e) => set("description_id", e.target.value)}
            rows={3} placeholder="Fokus studi, prestasi, kegiatan..." style={{ ...inputStyle, resize: "vertical" }} />
        </Column>
        <Column gap="s">
          <Text variant="label-strong-s">Description (English)</Text>
          <textarea value={editing.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)}
            rows={3} placeholder="Focus of study, achievements..." style={{ ...inputStyle, resize: "vertical" }} />
        </Column>
      </Column>

      {/* Logo kampus */}
      <Column gap="m" border="neutral-alpha-weak" radius="l" padding="l" background="surface">
        <Text variant="label-strong-m">Logo Kampus</Text>
        <Line background="neutral-alpha-weak" />
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Logo akan tampil dengan animasi glow + float di halaman About.
        </Text>
        <ImageUpload bucket="logos" value={editing.logo ?? ""}
          onChange={(url) => set("logo", url)} />
      </Column>

      {msg && <Text variant="body-default-s" onBackground="danger-strong">{msg}</Text>}

      <Row gap="m" wrap>
        <Button onClick={handleSave} variant="primary" size="m" loading={loading}>
          {isNew ? "Tambah" : "Simpan"}
        </Button>
        <Button onClick={() => setEditing(null)} variant="secondary" size="m">Batal</Button>
        {!isNew && (
          <Button onClick={() => handleDelete(editing.id!)} variant="danger" size="m"
            style={{ marginLeft: "auto" }}>Hapus</Button>
        )}
      </Row>
    </Column>
  );

  // ── List ───────────────────────────────────────────────────────────────────
  return (
    <Column fillWidth gap="m">
      <Button onClick={() => { setEditing(empty()); setIsNew(true); }}
        variant="primary" size="m" prefixIcon="plus">
        Tambah Pendidikan
      </Button>

      {items.length === 0 && (
        <Card border="neutral-alpha-weak" background="surface" padding="xl" radius="l">
          <Column gap="m" horizontal="center" align="center">
            <Text style={{ fontSize: 48 }}>🎓</Text>
            <Text variant="heading-strong-m">Belum ada data pendidikan</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Tambah universitas, jurusan, dan logo kampus Anda.
            </Text>
          </Column>
        </Card>
      )}

      {items.map((edu) => (
        <Card key={edu.id} fillWidth border="neutral-alpha-weak" background="surface"
          padding="m" radius="l" onClick={() => { setEditing(edu); setIsNew(false); }}
          style={{ cursor: "pointer" }}>
          <Row fillWidth gap="m" vertical="center">
            {edu.logo
              ? <img src={edu.logo} alt={edu.university_name}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: "contain", flexShrink: 0 }} />
              : <Text style={{ fontSize: 28, flexShrink: 0 }}>🎓</Text>
            }
            <Column flex={1} gap="4">
              <Text variant="heading-strong-m">{edu.university_name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {edu.faculty} · {edu.major}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {edu.degree} · {edu.year_start}–{edu.year_end || "Sekarang"}
              </Text>
            </Column>
            <Text variant="body-default-xs" onBackground="neutral-weak">Edit →</Text>
          </Row>
        </Card>
      ))}
    </Column>
  );
}
