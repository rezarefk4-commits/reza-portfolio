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

  // Clean URL for display (strip cache buster)
  const displayUrl = value ? value.split("?")[0] : "";

  // Detect media type of the stored file
  const fileExt = displayUrl.split("?")[0].toLowerCase();
  const isPdf = fileExt.endsWith(".pdf");
  const isVideoFile = /\.(mp4|webm|mov|ogg)$/.test(fileExt);
  const isImageFile = !isPdf && !isVideoFile;

  // Preview URL with cache buster to force fresh load (only for images)
  const previewUrl = displayUrl && isImageFile
    ? `${displayUrl}?t=${Math.floor(Date.now() / 30000)}`
    : "";

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      setError(`Upload gagal: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Update state with fresh URL
    onChange(`${publicUrl}?t=${Date.now()}`);

    // Log to media table (non-blocking)
    supabase.from("media").insert([{
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
      bucket,
      path,
      created_at: new Date().toISOString(),
    }]).then(() => {});

    // Auto-save to settings if key provided
    if (autoSaveSettingsKey) {
      const { data: rows } = await supabase
        .from("settings")
        .select("id")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (rows && rows.length > 0) {
        const { error: saveErr } = await supabase
          .from("settings")
          .update({
            [autoSaveSettingsKey]: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", rows[0].id);

        if (!saveErr) {
          setSaved(true);
          setTimeout(() => setSaved(false), 4000);
        }
      }
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isImage = accept.includes("image") || accept === "image/*";

  return (
    <Column gap="m">
      {label && <Text variant="label-strong-s">{label}</Text>}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${displayUrl ? "var(--brand-alpha-medium)" : "var(--neutral-alpha-medium)"}`,
          borderRadius: 12,
          padding: displayUrl ? 12 : 24,
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          transition: "border-color 0.2s, background 0.2s",
          background: "var(--neutral-alpha-weak)",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {previewUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxHeight: 220,
              maxWidth: "100%",
              borderRadius: 8,
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => {
              // If image fails to load, show placeholder
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : displayUrl && isPdf ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <Text variant="body-default-s" onBackground="neutral-weak">PDF terupload ✓</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak" style={{ wordBreak: "break-all", textAlign: "center", maxWidth: 280 }}>
              {displayUrl.split("/").pop()}
            </Text>
          </div>
        ) : displayUrl && isVideoFile ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <Text variant="body-default-s" onBackground="neutral-weak">Video terupload ✓</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak" style={{ wordBreak: "break-all", textAlign: "center", maxWidth: 280 }}>
              {displayUrl.split("/").pop()}
            </Text>
          </div>
        ) : (
          <>
            <Text style={{ fontSize: 36 }}>{uploading ? "⏳" : "📁"}</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {uploading ? "Mengunggah..." : "Klik atau seret file ke sini"}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              JPG, PNG, WebP{!isImage ? ", PDF, MP4" : ""}
            </Text>
          </>
        )}

        {uploading && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "var(--neutral-alpha-medium)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
          }}>
            <Text variant="body-default-m">Mengunggah...</Text>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset input so same file can be re-selected
            e.target.value = "";
          }}
        />
      </div>

      {/* URL text input */}
      <Row gap="m" vertical="center">
        <input
          type="text"
          value={displayUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau paste URL gambar langsung..."
          style={{
            flex: 1,
            background: "var(--neutral-background-medium)",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "var(--neutral-on-background-strong)",
            fontSize: 13,
            fontFamily: "monospace",
          }}
        />
        {value && (
          <Button size="s" variant="tertiary" onClick={() => { onChange(""); setSaved(false); }}>
            Hapus
          </Button>
        )}
      </Row>

      {/* Status messages */}
      {saved && (
        <Row gap="8" vertical="center">
          <Text style={{ fontSize: 16 }}>✅</Text>
          <Text variant="body-default-s" onBackground="brand-weak">
            Tersimpan otomatis ke database!
          </Text>
        </Row>
      )}
      {error && (
        <Row gap="8" vertical="center">
          <Text style={{ fontSize: 16 }}>❌</Text>
          <Text variant="body-default-s" onBackground="danger-strong">
            {error}
          </Text>
        </Row>
      )}
    </Column>
  );
}
