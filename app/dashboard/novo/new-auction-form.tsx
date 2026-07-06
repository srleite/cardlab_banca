"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import {
  Alert,
  Button,
  Card,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import { CONDITIONS, DURATIONS_DAYS, GAMES } from "@/lib/schemas";
import { CONDITION_LABEL, GAME_LABEL } from "@/lib/format";
import type { CardResult } from "@/lib/card-api";
import type { GameType } from "@/types/database";
import { createAuctionAction, type NewAuctionState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Publicando..." : "Publicar Leilão"}
    </Button>
  );
}

export function NewAuctionForm() {
  const [game, setGame] = useState<GameType>("magic");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CardResult | null>(null);

  const [state, action] = useFormState<NewAuctionState, FormData>(
    createAuctionAction,
    undefined,
  );

  // Busca com debounce de 350ms.
  // Cancelamento via AbortController evita race condition entre buscas em sequência.
  useEffect(() => {
    if (query.trim().length < 2 || selected) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(
          `/api/cards/search?game=${game}&q=${encodeURIComponent(query)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) {
          setSearchError("Não conseguimos consultar o catálogo agora.");
          setResults([]);
        } else {
          const body = await res.json();
          setResults(body.results ?? []);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setSearchError("Falha de rede. Verifique sua conexão.");
        }
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [game, query, selected]);

  return (
    <form action={action} className="space-y-6">
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <Card className="p-6 space-y-4">
        <h2 className="font-medium">1. Escolha o jogo</h2>
        <div className="flex gap-3">
          {GAMES.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="game"
                value={g}
                checked={game === g}
                onChange={() => {
                  setGame(g);
                  setSelected(null);
                  setResults([]);
                }}
              />
              {GAME_LABEL[g]}
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-medium">2. Buscar carta</h2>

        {selected ? (
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-24 overflow-hidden rounded" style={{ background: "var(--bg-elevated)" }}>
              <Image
                src={selected.imageUrl}
                alt={selected.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{selected.name}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{selected.set}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSelected(null);
                  setQuery("");
                }}
              >
                Trocar carta
              </Button>
            </div>
            <input type="hidden" name="imageUrl" value={selected.imageUrl} />
            <input type="hidden" name="cardName" value={selected.name} />
          </div>
        ) : (
          <>
            <Input
              placeholder={`Digite o nome da carta (${GAME_LABEL[game]})...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />

            {searchError && <Alert variant="warning">{searchError}</Alert>}

            {searching && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Buscando...</p>
            )}

            {!searching && results.length > 0 && (
              <ul className="rounded-md divide-y divide-[color:var(--border)]" style={{ border: "1px solid var(--border)" }}>
                {results.map((card) => (
                  <li
                    key={card.externalId}
                    className="flex items-center gap-3 p-3"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded" style={{ background: "var(--bg-elevated)" }}>
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {card.name}
                      </p>
                      <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                        {card.set}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelected(card)}
                    >
                      Selecionar
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {!searching && query.length >= 2 && results.length === 0 && !searchError && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Nenhuma carta encontrada para &ldquo;{query}&rdquo;.
              </p>
            )}
          </>
        )}
      </Card>

      {selected && (
        <Card className="p-6 space-y-4">
          <h2 className="font-medium">3. Detalhes do leilão</h2>

          <div>
            <Label htmlFor="condition">Condição *</Label>
            <Select id="condition" name="condition" required>
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
              required
            />
          </div>

          <div>
            <Label htmlFor="durationDays">Duração *</Label>
            <Select id="durationDays" name="durationDays" defaultValue="7" required>
              {DURATIONS_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "dia" : "dias"}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <SubmitButton />
          </div>
        </Card>
      )}
    </form>
  );
}
