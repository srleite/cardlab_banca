"use client";

import Link from "next/link";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import {
  Alert,
  Button,
  Card,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import { CONDITIONS } from "@/lib/schemas";
import { CONDITION_LABEL, GAME_LABEL, formatDate } from "@/lib/format";
import type { Auction } from "@/types/database";
import { updateAuctionAction, type EditAuctionState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}

export function EditAuctionForm({ auction }: { auction: Auction }) {
  const [state, action] = useFormState<EditAuctionState, FormData>(
    updateAuctionAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-6">
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      {/* O servidor identifica o leilão por este id (e valida o dono via RLS). */}
      <input type="hidden" name="id" value={auction.id} />

      {/* Carta — identidade fixa do leilão, não editável aqui. */}
      <Card className="p-6">
        <h2 className="mb-4 font-medium">Carta</h2>
        <div className="flex items-start gap-4">
          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded" style={{ background: "var(--bg-elevated)" }}>
            <Image
              src={auction.image_url}
              alt={auction.card_name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{auction.card_name}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{GAME_LABEL[auction.game]}</p>
            <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
              A carta e o jogo não mudam. Para anunciar outra carta, crie um novo
              leilão.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-medium">Detalhes</h2>

        <div>
          <Label htmlFor="condition">Condição *</Label>
          <Select
            id="condition"
            name="condition"
            defaultValue={auction.condition}
            required
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {CONDITION_LABEL[c]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            name="description"
            maxLength={2000}
            rows={3}
            defaultValue={auction.description ?? ""}
            placeholder="Ex: Guardada em sleeve desde o pull. Bordas perfeitas."
          />
        </div>

        <div>
          <Label htmlFor="startingPrice">Preço inicial (R$) *</Label>
          <Input
            id="startingPrice"
            name="startingPrice"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={auction.starting_price}
            required
          />
        </div>

        <div className="rounded-md p-3 text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          Encerra em <strong>{formatDate(auction.ends_at)}</strong>. A data de
          encerramento não pode ser alterada nesta versão.
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/dashboard">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
          <SubmitButton />
        </div>
      </Card>
    </form>
  );
}
