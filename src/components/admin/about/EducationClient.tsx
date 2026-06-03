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
  gpa: "",
  field_of_study: "",
  thesis_title: "",
  thesis_goal: "",
  logo: "",
  description_id: "",
  description_en: "",
  sort_order: 0,
});

const inputStyle = {
  background: "var(--neutral-background-medium)",
  border: "1px solid var(--neutral-alpha-medium)",
  borderRadius: 10, padding: "10px 12px",
  color: "var(--neutral-on-background-strong)",
  fontSize: 14, width: "100%", fontFamily: "inherit",
  outline: "none",
};

const labelStyle = {
  fontSize: 12, fontWeight: 600, color: "var(--neutral-on-background-weak)",
  textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 4,
};

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
    await createClient().from("about_education").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  // ── FORM ──────────────────────────────────────────────────────────
  if (editing !== null) return (
    <Column fillWidth gap="m" paddingBottom="80">

      {/* Section: Identitas Kampus */}
      <div style={{ borderRadius: 14, border: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-background-medium)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-alpha-weak)" }}>
          <Text variant="label-strong-s">Identitas Kampus</Text>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={labelStyle}>Nama Universitas *</div>
            <Input id="uni" value={editing.university_name ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("university_name", e.target.value)}
              placeholder="Universitas Hasanuddin" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={labelStyle}>Fakultas</div>
              <Input id="faculty" value={editing.faculty ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("faculty", e.target.value)}
                placeholder="Teknik" />
            </div>
            <div>
              <div style={labelStyle}>Jurusan / Prodi</div>
              <Input id="major" value={editing.major ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("major", e.target.value)}
                placeholder="Teknik Informatika" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <div style={labelStyle}>Jenjang</div>
              <select value={editing.degree ?? "S1"} onChange={(e) => set("degree", e.target.value)} style={inputStyle}>
                {["D3","S1","S2","S3","Profesi","Vokasi"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Tahun Masuk</div>
              <Input id="ys" value={editing.year_start ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("year_start", e.target.value)}
                placeholder="2020" />
            </div>
            <div>
              <div style={labelStyle}>Tahun Lulus</div>
              <Input id="ye" value={editing.year_end ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("year_end", e.target.value)}
                placeholder="2024" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={labelStyle}>IPK</div>
              <Input id="gpa" value={editing.gpa ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("gpa", e.target.value)}
                placeholder="3.85" />
            </div>
            <div>
              <div style={labelStyle}>Rumpun Ilmu</div>
              <Input id="fos" value={editing.field_of_study ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("field_of_study", e.target.value)}
                placeholder="Ilmu Komputer" />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Skripsi */}
      <div style={{ borderRadius: 14, border: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-background-medium)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-alpha-weak)" }}>
          <Text variant="label-strong-s">Skripsi / Tugas Akhir</Text>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={labelStyle}>Judul Skripsi</div>
            <Input id="thesis" value={editing.thesis_title ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("thesis_title", e.target.value)}
              placeholder="Sistem Prediksi ... Menggunakan ..." />
          </div>
          <div>
            <div style={labelStyle}>Tujuan &amp; Manfaat Penelitian</div>
            <textarea value={editing.thesis_goal ?? ""} onChange={(e) => set("thesis_goal", e.target.value)}
              rows={3} placeholder="Penelitian ini bertujuan untuk... Manfaatnya adalah..."
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      </div>

      {/* Section: Logo */}
      <div style={{ borderRadius: 14, border: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-background-medium)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--neutral-alpha-weak)", background: "var(--neutral-alpha-weak)" }}>
          <Text variant="label-strong-s">Logo Kampus</Text>
        </div>
        <div style={{ padding: 16 }}>
          <Text variant="body-default-xs" onBackground="neutral-weak" style={{ marginBottom: 12 }}>
            PNG transparan disarankan. Akan tampil dengan animasi glow di halaman About.
          </Text>
          <ImageUpload bucket="media" value={editing.logo ?? ""} onChange={(url) => set("logo", url)} />
        </div>
      </div>

      {msg && <Text variant="body-default-s" onBackground="danger-strong">{msg}</Text>}

      <Row gap="m" wrap>
        <Button onClick={handleSave} variant="primary" size="m" loading={loading}>
          {isNew ? "Tambah" : "Simpan"}
        </Button>
        <Button onClick={() => setEditing(null)} variant="secondary" size="m">Batal</Button>
        {!isNew && (
          <Button onClick={() => handleDelete(editing.id!)} variant="danger" size="m" style={{ marginLeft: "auto" }}>
            Hapus
          </Button>
        )}
      </Row>
    </Column>
  );

  // ── LIST ──────────────────────────────────────────────────────────
  return (
    <Column fillWidth gap="m">
      <Button onClick={() => { setEditing(empty()); setIsNew(true); }}
        variant="primary" size="m" prefixIcon="plus">
        Tambah Pendidikan
      </Button>

      {items.length === 0 && (
        <Card border="neutral-alpha-weak" background="surface" padding="xl" radius="l">
          <Column gap="m" horizontal="center" align="center">
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--brand-alpha-weak)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-on-background-medium)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <Text variant="heading-strong-m">Belum ada data pendidikan</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Tambah universitas, jurusan, dan detail akademik.
            </Text>
          </Column>
        </Card>
      )}

      {items.map((edu) => (
        <div key={edu.id} onClick={() => { setEditing(edu); setIsNew(false); }}
          style={{
            borderRadius: 14, border: "1px solid var(--neutral-alpha-weak)",
            background: "var(--neutral-background-medium)", cursor: "pointer", overflow: "hidden",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-alpha-medium)"; e.currentTarget.style.boxShadow = "0 2px 12px var(--brand-alpha-weak)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--neutral-alpha-weak)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ height: 3, background: "linear-gradient(90deg, var(--brand-background-strong), var(--accent-background-strong), transparent)" }} />
          <div style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
            {edu.logo
              ? <img src={edu.logo} alt={edu.university_name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "contain", flexShrink: 0, background: "var(--neutral-alpha-weak)", padding: 6 }} />
              : <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--brand-alpha-weak)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--brand-on-background-medium)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text variant="heading-strong-m">{edu.university_name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {edu.major} · {edu.degree} · {edu.year_start}–{edu.year_end || "Sekarang"}
                {edu.gpa ? ` · IPK ${edu.gpa}` : ""}
              </Text>
            </div>
            <div style={{ flexShrink: 0, color: "var(--neutral-on-background-weak)", fontSize: 18 }}>›</div>
          </div>
        </div>
      ))}
    </Column>
  );
}
