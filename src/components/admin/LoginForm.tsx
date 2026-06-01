"use client";

import { useState } from "react";
import { Button, Column, Input, Text } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/reza-control");
    router.refresh();
  };

  return (
    <Column gap="m" fillWidth>
      <Column gap="s" fillWidth>
        <Text variant="label-strong-s">Email</Text>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </Column>
      <Column gap="s" fillWidth>
        <Text variant="label-strong-s">Password</Text>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleLogin();
          }}
        />
      </Column>
      {error && (
        <Text variant="body-default-s" onBackground="danger-strong">
          {error}
        </Text>
      )}
      <Button
        fillWidth
        variant="primary"
        size="m"
        onClick={handleLogin}
        loading={loading}
      >
        Masuk
      </Button>
    </Column>
  );
}
