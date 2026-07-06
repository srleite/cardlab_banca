"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { deleteAuctionAction } from "./actions";

export function DeleteButton({ id, cardName }: { id: string; cardName: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
        aria-label={`Remover leilão de ${cardName}`}
      >
        🗑
      </Button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Confirmar remoção"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="w-full max-w-md rounded-lg p-6 shadow-xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-hover)", color: "var(--text-primary)" }}
      >
        <h2 className="text-lg font-semibold">Remover este leilão?</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          &ldquo;{cardName}&rdquo; será removido permanentemente. Esta ação não
          pode ser desfeita.
        </p>

        <form action={deleteAuctionAction} className="mt-4 flex justify-end gap-2">
          <input type="hidden" name="id" value={id} />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirming(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="danger">
            Remover
          </Button>
        </form>
      </div>
    </div>
  );
}
