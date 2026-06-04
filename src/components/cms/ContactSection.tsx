"use client";

import { useState } from "react";
import { Column, Row, Text, RevealFx } from "@once-ui-system/core";
import type { SiteSettings } from "@/lib/types";
import type { ReactNode } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const icons: Record<string, ReactNode> = {
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

interface ContactSectionProps {
  settings?: SiteSettings | null;
}

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  // Email dari CMS, fallback ke placeholder
  const recipientEmail = settings?.social_email || "";

  const handleSubmit = async () => {
    if (!name || !senderEmail || !message) return;
    setFormState("sending");

    // Buka mailto dengan data form terisi
    const body = `Nama: ${name}\nEmail: ${senderEmail}\n\n${message}`;
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject || "Pesan dari Portfolio")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    setTimeout(() => setFormState("sent"), 800);
    setTimeout(() => setFormState("idle"), 3500);
  };

  // Sosial links dari settings
  const socialLinks = [
    settings?.social_github   && { label: "GitHub",    href: settings.social_github,    icon: icons.github },
    settings?.social_linkedin && { label: "LinkedIn",  href: settings.social_linkedin,  icon: icons.linkedin },
    settings?.social_instagram&& { label: "Instagram", href: settings.social_instagram, icon: icons.instagram },
  ].filter(Boolean) as { label: string; href: string; icon: ReactNode }[];

  return (
    <RevealFx translateY="12" delay={0.1} fillWidth>
      <style>{`
        @keyframes contactPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
        .cf-input{
          width:100%;padding:11px 14px;border-radius:10px;font-size:14px;
          background:var(--neutral-background-medium);
          border:1px solid var(--neutral-alpha-weak);
          color:var(--neutral-on-background-strong);
          outline:none;transition:border-color .18s,box-shadow .18s;
          font-family:inherit;
        }
        .cf-input:focus{border-color:var(--brand-alpha-medium);box-shadow:0 0 0 3px var(--brand-alpha-weak);}
        .cf-input::placeholder{color:var(--neutral-on-background-weak);}
        .cf-textarea{resize:vertical;min-height:120px;}
        .cf-submit{
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 32px;border-radius:12px;
          font-size:15px;font-weight:600;cursor:pointer;
          background:var(--brand-background-strong);
          color:var(--brand-on-background-strong);
          border:none;transition:opacity .18s,transform .18s,box-shadow .18s;
          box-shadow:0 2px 16px var(--brand-alpha-medium);
        }
        .cf-submit:hover:not(:disabled){opacity:.88;transform:translateY(-1px);box-shadow:0 6px 24px var(--brand-alpha-medium);}
        .cf-submit:disabled{opacity:.55;cursor:not-allowed;}
        .cf-social-link{
          display:inline-flex;align-items:center;gap:8px;
          padding:9px 16px;border-radius:10px;
          text-decoration:none;font-size:13px;font-weight:500;
          border:1px solid var(--neutral-alpha-weak);
          background:var(--neutral-background-medium);
          color:var(--neutral-on-background-strong);
          transition:border-color .18s,background .18s,transform .18s;
        }
        .cf-social-link:hover{border-color:var(--neutral-alpha-medium);background:var(--neutral-alpha-weak);transform:translateY(-1px);}
        .cf-label{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--neutral-on-background-weak);margin-bottom:6px;}
      `}</style>

      <Column
        fillWidth
        gap="xl"
        paddingY="80"
        paddingX="l"
        style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}
      >
        {/* Header */}
        <Column gap="12" align="center" horizontal="center">
          <Row gap="8" vertical="center">
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--brand-background-strong)",
              animation: "contactPulse 2.4s ease-in-out infinite",
              display: "inline-block",
            }}/>
            <Text variant="label-default-xs" onBackground="neutral-weak"
              style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Tersedia untuk kolaborasi
            </Text>
          </Row>

          <Text variant="display-strong-m" style={{ textAlign: "center" }}>
            Mari Terhubung
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak"
            style={{ textAlign: "center", maxWidth: 420, lineHeight: 1.65 }}>
            Punya proyek menarik atau ingin berdiskusi? Kirim pesan dan saya
            akan merespons secepatnya.
          </Text>
        </Column>

        {/* Contact Form Card */}
        <Column
          gap="l"
          border="neutral-alpha-weak"
          radius="l"
          padding="l"
          background="surface"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Nama + Email baris */}
          <Row gap="m" s={{ direction: "column" }}>
            <Column flex={1} gap="0">
              <label className="cf-label">{icons.user} Nama Lengkap</label>
              <input
                className="cf-input"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Column>
            <Column flex={1} gap="0">
              <label className="cf-label">{icons.email} Email Anda</label>
              <input
                className="cf-input"
                type="email"
                placeholder="email@anda.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
            </Column>
          </Row>

          {/* Subjek */}
          <Column gap="0">
            <label className="cf-label">{icons.message} Subjek</label>
            <input
              className="cf-input"
              type="text"
              placeholder="Topik pesan Anda"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Column>

          {/* Pesan */}
          <Column gap="0">
            <label className="cf-label">{icons.message} Pesan</label>
            <textarea
              className="cf-input cf-textarea"
              placeholder="Ceritakan proyek atau ide Anda di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Column>

          {/* Submit */}
          <Row horizontal="end" vertical="center" gap="12">
            {recipientEmail && (
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Kirim ke: <span style={{ color: "var(--brand-on-background-medium)" }}>{recipientEmail}</span>
              </Text>
            )}
            <button
              className="cf-submit"
              onClick={handleSubmit}
              disabled={!name || !senderEmail || !message || formState === "sending"}
            >
              {icons.send}
              {formState === "sending" ? "Membuka..." : formState === "sent" ? "✓ Terkirim!" : "Kirim Pesan"}
            </button>
          </Row>
        </Column>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <Column gap="12" align="center" horizontal="center">
            <Text variant="label-default-xs" onBackground="neutral-weak"
              style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Atau temukan saya di
            </Text>
            <Row gap="8" wrap horizontal="center">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="cf-social-link">
                  {s.icon}{s.label}
                </a>
              ))}
            </Row>
          </Column>
        )}

        <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textAlign: "center" }}>
          Makassar, Indonesia · Remote friendly
        </Text>
      </Column>
    </RevealFx>
  );
}
