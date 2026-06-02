"use client";

import { useState, useRef } from "react";
import { Column, Row, Text, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  /** Jika diisi, upload akan langsung auto-save ke tabel settings kolom ini */
  autoSaveSettingsKey?: string;
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  accept = "image/*",
  label,
  autoSaveSettingsKey,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Add cache-buster so browser loads fresh image
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
    onChange(cacheBustedUrl);

    // Log to media table
    await supabase.from("media").insert([{
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
      bucket,
      path,
      created_at: new Date().toISOString(),
    }]);

    // Auto-save to settings if key provided (fixes avatar bug)
    if (autoSaveSettingsKey) {
      const { data: settingsRows } = await supabase
        .from("settings")
        .select("id")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (settingsRows && settingsRows.length > 0) {
        await supabase
          .from("settings")
          .update({
            [autoSaveSettingsKey]: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settingsRows[0].id);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Column gap="m">
      {label && <Text variant="label-strong-s">{label}</Text>}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${value ? "var(--brand-alpha-medium)" : "var(--neutral-alpha-medium)"}`,
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s",
          background: value ? "var(--brand-alpha-weak)" : "var(--neutral-alpha-weak)",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {value ? (
          <img
            src={value}
            alt="Preview"
            style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 8, objectFit: "contain" }}
          />
        ) : (
          <>
            <Text style={{ fontSize: 32 }}>{uploading ? "⏳" : "📁"}</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {uploading ? "Mengunggah..." : "Klik atau seret file ke sini"}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              JPG, PNG, WebP, MP4, PDF
            </Text>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <Row gap="m" vertical="center">
        <input
          type="text"
          value={value.split("?t=")[0]} // strip cache buster from display
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau masukkan URL langsung..."
          style={{
            flex: 1,
            background: "var(--neutral-background-medium)",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "var(--neutral-on-background-strong)",
            fontSize: 13,
          }}
        />
        {value && (
          <Button size="s" variant="tertiary" onClick={() => onChange("")}>
            Hapus
          </Button>
        )}
      </Row>

      {saved && (
        <Text variant="body-default-xs" onBackground="brand-weak">
          ✓ Avatar berhasil diperbarui dan disimpan!
        </Text>
      )}
      {error && (
        <Text variant="body-default-xs" onBackground="danger-strong">
          {error}
        </Text>
      )}
    </Column>
  );
}
