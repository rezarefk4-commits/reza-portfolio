"use client";

import { useState } from "react";
import { Column, Row, Text, Button, Input, Card, Line } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AccountClientProps {
  user: User | null;
}

export function AccountClient({ user }: AccountClientProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Password tidak cocok atau kosong.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });

    if (err) {
      setError(err.message);
    } else {
      setMessage("Password berhasil diubah!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <Column fillWidth gap="xl" style={{ maxWidth: 480 }}>
      {/* Profile Info */}
      <Column gap="m" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
        <Text variant="label-strong-m">Informasi Akun</Text>
        <Line background="neutral-alpha-weak" />
        <Column gap="8">
          <Row gap="12">
            <Text variant="label-strong-s" onBackground="neutral-weak" style={{ minWidth: 80 }}>Email</Text>
            <Text variant="body-default-m">{user?.email}</Text>
          </Row>
          <Row gap="12">
            <Text variant="label-strong-s" onBackground="neutral-weak" style={{ minWidth: 80 }}>User ID</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak" style={{ fontFamily: "monospace" }}>
              {user?.id?.slice(0, 20)}...
            </Text>
          </Row>
          <Row gap="12">
            <Text variant="label-strong-s" onBackground="neutral-weak" style={{ minWidth: 80 }}>Dibuat</Text>
            <Text variant="body-default-m">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    timeZone: "Asia/Makassar",
                  })
                : "-"}
            </Text>
          </Row>
        </Column>
      </Column>

      {/* Change Password */}
      <Column gap="m" border="neutral-alpha-weak" radius="m" padding="l" background="surface">
        <Text variant="label-strong-m">Ubah Password</Text>
        <Line background="neutral-alpha-weak" />
        <Column gap="s">
          <Text variant="label-strong-s">Password Baru</Text>
          <Input
            id="new_password"
            type="password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
          />
        </Column>
        <Column gap="s">
          <Text variant="label-strong-s">Konfirmasi Password</Text>
          <Input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
          />
        </Column>
        {error && (
          <Text variant="body-default-s" onBackground="danger-strong">{error}</Text>
        )}
        {message && (
          <Text variant="body-default-s" onBackground="brand-weak">✓ {message}</Text>
        )}
        <Button onClick={handleChangePassword} variant="primary" size="m" loading={loading}>
          Ubah Password
        </Button>
      </Column>
    </Column>
  );
}
