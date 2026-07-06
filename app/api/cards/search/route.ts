
import { NextResponse, type NextRequest } from "next/server";
import { searchCards } from "@/lib/card-api";
import { GAMES } from "@/lib/schemas";
import type { GameType } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get("game");
  const q = searchParams.get("q") ?? "";

  if (!game || !GAMES.includes(game as GameType)) {
    return NextResponse.json(
      { error: "Parâmetro 'game' inválido" },
      { status: 400 },
    );
  }

  try {
    const results = await searchCards(game as GameType, q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Falha em searchCards:", err);
    return NextResponse.json(
      { error: "Falha ao consultar catálogo. Tente novamente." },
      { status: 502 },
    );
  }
}
