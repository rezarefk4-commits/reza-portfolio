"use client";

import { useState, useRef } from "react";
import { Column, Row, Text, Button } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";

interface UploadedFile {
  name: string;
  url: string;
  type: "image" | "video" | "pdf" | "other";
  size: number;
}

interface ImageUploadProps {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  autoSaveSettingsKey?: string;
  /** Allow picking multiple files at once */
  multiple?: boolean;
  /** Callback when multiple files uploaded — returns all URLs */
  onMultipleChange?: (urls: string[]) => void;
}

function detectType(name: string, mime: string): UploadedFile["type"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  return "other";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileIcon = ({ type }: { type: UploadedFile["type"] }) => {
  if (type === "pdf") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
  if (type === "video") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
  if (type === "image") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  );
};

const typeColor: Record<UploadedFile["type"], string> = {
  image: "#3ecf8e",
  video: "#818cf8",
  pdf:   "#ef4444",
  other: "#94a3b8",
};

export function ImageUpload({
  bucket,
  value,
  onChange,
  accept = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar",
  label,
  autoSaveSettingsKey,
  multiple = true,
  onMultipleChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = value ? value.split("?")[0] : "";
  const isPdf = displayUrl.endsWith(".pdf");
  const isVideo = /\.(mp4|webm|mov|ogg)$/.test(displayUrl);
  const isImage = !isPdf && !isVideo;
  const previewUrl = displayUrl && isImage ? `${displayUrl}?t=${Math.floor(Date.now() / 30000)}` : "";

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    setProgress((p) => ({ ...p, [file.name]: 10 }));

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      setError(`${file.name}: ${uploadError.message}`);
      setProgress((p) => { const n = { ...p }; delete n[file.name]; return n; });
      return null;
    }

    setProgress((p) => ({ ...p, [file.name]: 80 }));

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Log to media
    supabase.from("media").insert([{
      name: file.name, url: publicUrl, type: file.type,
      size: file.size, bucket, path, created_at: new Date().toISOString(),
    }]).then(() => {});

    setProgress((p) => ({ ...p, [file.name]: 100 }));
    setTimeout(() => setProgress((p) => { const n = { ...p }; delete n[file.name]; return n; }), 1200);

    return publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (!fileArr.length) return;
    setUploading(true);
    setError("");
    setSaved(false);

    const urls: string[] = [];
    const newUploaded: UploadedFile[] = [];

    for (const file of fileArr) {
      const url = await uploadFile(file);
      if (url) {
        urls.push(url);
        newUploaded.push({
          name: file.name,
          url,
          type: detectType(file.name, file.type),
          size: file.size,
        });
      }
    }

    if (urls.length > 0) {
      // Primary value = first uploaded file
      const primaryUrl = `${urls[0]}?t=${Date.now()}`;
      onChange(primaryUrl);
      setUploadedFiles((prev) => [...prev, ...newUploaded]);

      // Callback for multiple
      if (onMultipleChange && urls.length > 1) {
        onMultipleChange(urls.map((u) => `${u}?t=${Date.now()}`));
      }

      // Auto-save settings
      if (autoSaveSettingsKey) {
        const supabase = createClient();
        const { data: rows } = await supabase.from("settings").select("id")
          .order("updated_at", { ascending: false }).limit(1);
        if (rows?.length) {
          const { error: saveErr } = await supabase.from("settings")
            .update({ [autoSaveSettingsKey]: urls[0], updated_at: new Date().toISOString() })
            .eq("id", rows[0].id);
          if (!saveErr) { setSaved(true); setTimeout(() => setSaved(false), 4000); }
        }
      }
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const progressEntries = Object.entries(progress);

  return (
    <Column gap="m">
      {label && <Text variant="label-strong-s">{label}</Text>}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--brand-background-strong)" : displayUrl ? "var(--brand-alpha-medium)" : "var(--neutral-alpha-medium)"}`,
          borderRadius: 12,
          padding: displayUrl ? 12 : 28,
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          transition: "border-color 0.2s, background 0.2s",
          background: dragOver
            ? "color-mix(in srgb, var(--brand-background-strong) 6%, transparent)"
            : "var(--neutral-alpha-weak)",
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          position: "relative",
        }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 8, objectFit: "contain" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : displayUrl && isPdf ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <Text variant="body-default-s" onBackground="neutral-weak">PDF terupload ✓</Text>
          </div>
        ) : displayUrl && isVideo ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <Text variant="body-default-s" onBackground="neutral-weak">Video terupload ✓</Text>
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-on-background-weak)" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="16 16 12 12 8 16"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {uploading ? "Mengunggah..." : dragOver ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Gambar, Video, PDF, Dokumen, ZIP · {multiple ? "Bisa beberapa file sekaligus" : "1 file"}
            </Text>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Progress bars */}
      {progressEntries.length > 0 && (
        <Column gap="6">
          {progressEntries.map(([name, pct]) => (
            <div key={name}>
              <Row horizontal="between" style={{ marginBottom: 3 }}>
                <Text variant="body-default-xs" onBackground="neutral-weak" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{name}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">{pct}%</Text>
              </Row>
              <div style={{ height: 4, borderRadius: 99, background: "var(--neutral-alpha-weak)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 99,
                  background: pct === 100 ? "var(--brand-background-strong)" : "var(--brand-alpha-strong)",
                  transition: "width 0.3s ease",
                }} />
              </div>
            </div>
          ))}
        </Column>
      )}

      {/* Uploaded file list */}
      {uploadedFiles.length > 0 && (
        <Column gap="6">
          <Text variant="label-default-xs" onBackground="neutral-weak">File terupload ({uploadedFiles.length})</Text>
          {uploadedFiles.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 12px", borderRadius: 8,
              background: "var(--neutral-alpha-weak)",
              border: "1px solid var(--neutral-alpha-medium)",
            }}>
              <span style={{ color: typeColor[f.type], flexShrink: 0 }}>
                <FileIcon type={f.type} />
              </span>
              <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--neutral-on-background-strong)" }}>
                {f.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--neutral-on-background-weak)", flexShrink: 0 }}>
                {formatSize(f.size)}
              </span>
              <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, color: "var(--neutral-on-background-weak)" }}
                onClick={(e) => e.stopPropagation()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          ))}
        </Column>
      )}

      {/* URL input */}
      <Row gap="m" vertical="center">
        <input
          type="text"
          value={displayUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau paste URL langsung..."
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
          <Button size="s" variant="tertiary" onClick={() => { onChange(""); setUploadedFiles([]); setSaved(false); }}>
            Hapus
          </Button>
        )}
      </Row>

      {saved && (
        <Row gap="8" vertical="center">
          <Text style={{ fontSize: 14 }}>✅</Text>
          <Text variant="body-default-s" onBackground="brand-weak">Tersimpan otomatis!</Text>
        </Row>
      )}
      {error && (
        <Row gap="8" vertical="center">
          <Text style={{ fontSize: 14 }}>❌</Text>
          <Text variant="body-default-s" onBackground="danger-strong">{error}</Text>
        </Row>
      )}
    </Column>
  );
}
