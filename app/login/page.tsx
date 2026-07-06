"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signInAction, type ActionState } from "./actions";
import { Alert, Button, Card, Input, Label } from "@/components/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const [state, action] = useFormState<ActionState, FormData>(
    signInAction,
    undefined,
  );

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-semibold">Entrar no CardLab</h1>

        <form action={action} className="space-y-4">
          {state?.error && <Alert variant="error">{state.error}</Alert>}

          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.redirectTo ?? ""}
          />

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Não tem conta?{" "}
          <Link href="/cadastro" style={{ color: "var(--purple-light)" }} className="hover:underline">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}
