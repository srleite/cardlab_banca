"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction, type ProfileActionState } from "./actions";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";
import type { Profile } from "@/types/database";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}

export function ProfileForm({
  profile,
  isShop,
}: {
  profile: Profile;
  isShop: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useFormState<ProfileActionState, FormData>(
    updateProfileAction,
    undefined,
  );

  // Quando salva com sucesso, sai do modo de edição
  if (state?.ok && editing) {
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="space-y-4">
        {state?.ok && (
          <Alert variant="success">Perfil atualizado com sucesso.</Alert>
        )}

        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="font-medium" style={{ color: "var(--text-dim)" }}>Nome de exibição</dt>
            <dd>{profile.display_name || "—"}</dd>
          </div>

          {isShop && (
            <div>
              <dt className="font-medium" style={{ color: "var(--text-dim)" }}>Nome da loja</dt>
              <dd>{profile.shop_name ?? "—"}</dd>
            </div>
          )}

          <div>
            <dt className="font-medium" style={{ color: "var(--text-dim)" }}>Bio</dt>
            <dd className="whitespace-pre-line">{profile.bio ?? "—"}</dd>
          </div>
        </dl>

        <Button variant="secondary" onClick={() => setEditing(true)}>
          ✎ Editar
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state && !state.ok && <Alert variant="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="displayName">Nome de exibição *</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={profile.display_name ?? ""}
          maxLength={60}
          required
        />
      </div>

      {isShop && (
        <div>
          <Label htmlFor="shopName">Nome da loja</Label>
          <Input
            id="shopName"
            name="shopName"
            defaultValue={profile.shop_name ?? ""}
            maxLength={80}
          />
        </div>
      )}

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={2000}
          rows={4}
        />
        <p className="mt-1 text-xs" style={{ color: "var(--text-dim)" }}>Máximo 2000 caracteres.</p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditing(false)}
        >
          Cancelar
        </Button>
        <SaveButton />
      </div>
    </form>
  );
}
