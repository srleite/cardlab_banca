"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signUpAction, type ActionState } from "./actions";
import { Alert, Button, Card, Input, Label } from "@/components/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Criando conta..." : "Criar conta"}
    </Button>
  );
}

export default function CadastroPage() {
  const [state, action] = useFormState<ActionState, FormData>(
    signUpAction,
    undefined,
  );

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-12">
      <Card className="p-6">
        <h1 className="mb-6 text-xl font-semibold">Criar conta no CardLab</h1>

        <form action={action} className="space-y-4">
          {state?.error && <Alert variant="error">{state.error}</Alert>}

          <div>
            <Label htmlFor="displayName">Nome de exibição</Label>
            <Input
              id="displayName"
              name="displayName"
              maxLength={60}
              required
            />
          </div>

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
            <Label htmlFor="password">Senha (mín. 8 caracteres)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              Tipo de conta
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  defaultChecked
                />
                Comprador (vê leilões)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="accountType" value="shop" />
                Lojista (cria leilões)
              </label>
            </div>
          </fieldset>

          <SubmitButton />
        </form>

        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "var(--purple-light)" }} className="hover:underline">
            Entre
          </Link>
        </p>
      </Card>
    </div>
  );
}
