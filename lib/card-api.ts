
import type { GameType } from "@/types/database";

export type CardResult = {
  /** ID externo (referência ao catálogo de origem) */
  externalId: string;
  /** Nome canônico da carta */
  name: string;
  /** Edição/set legível (ex: "Obsidian Flames #199") */
  set: string;
  /** URL absoluta da imagem oficial */
  imageUrl: string;
};

/**
 * Busca cartas no catálogo apropriado para o jogo.
 * Retorna no máximo 10 resultados.
 */
export async function searchCards(
  game: GameType,
  query: string,
): Promise<CardResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  switch (game) {
    case "magic":
      return searchScryfall(trimmed);
    case "pokemon":
      return searchPokemonMock(trimmed);
    case "onepiece":
      return searchOnepieceMock(trimmed);
  }
}

// ============================================================================
// MAGIC — Scryfall (real)
// ============================================================================

type ScryfallCard = {
  id: string;
  name: string;
  set_name: string;
  collector_number: string;
  image_uris?: { normal?: string; large?: string };
  card_faces?: Array<{ image_uris?: { normal?: string } }>;
};

type ScryfallResponse = {
  object: "list" | "error";
  data?: ScryfallCard[];
  details?: string;
};

async function searchScryfall(query: string): Promise<CardResult[]> {
  // /cards/search com order=released e unique=prints retornaria todas as edições.
  const url = new URL("https://api.scryfall.com/cards/search");
  url.searchParams.set("q", query);
  url.searchParams.set("unique", "cards");
  url.searchParams.set("order", "name");

  const res = await fetch(url.toString(), {
  headers: {
    Accept: "application/json",
    "User-Agent": "CardLab/1.0 (trabalho-estagio)",
  },
  next: { revalidate: 60 },
});

  // Scryfall retorna 404 quando não encontra — não é erro fatal.
 if (res.status === 404) return [];
if (res.status === 400) return [];   // query inválida p/ Scryfall = sem resultados
if (!res.ok) {
  throw new Error(`Scryfall respondeu ${res.status}`);
}

  const body = (await res.json()) as ScryfallResponse;
  if (body.object !== "list" || !body.data) return [];

  return body.data.slice(0, 10).map((card) => ({
    externalId: card.id,
    name: card.name,
    set: `${card.set_name} #${card.collector_number}`,
    imageUrl:
      card.image_uris?.normal ??
      card.card_faces?.[0]?.image_uris?.normal ??
      // Fallback: a Scryfall sempre tem uma imagem pequena
      `https://cards.scryfall.io/normal/front/${card.id[0]}/${card.id[1]}/${card.id}.jpg`,
  }));
}

const POKEMON_MOCK: CardResult[] = [
  {
    externalId: "mock-pkm-charizard-ex-199",
    name: "Charizard ex",
    set: "Obsidian Flames #199 (Special Illustration Rare)",
    imageUrl: "https://images.pokemontcg.io/sv3/199_hires.png",
  },
  {
    externalId: "mock-pkm-pikachu-vmax",
    name: "Pikachu VMAX",
    set: "Vivid Voltage #044",
    imageUrl: "https://images.pokemontcg.io/swsh4/44_hires.png",
  },
  {
    externalId: "mock-pkm-mewtwo-gx",
    name: "Mewtwo & Mew GX",
    set: "Unified Minds #222",
    imageUrl: "https://images.pokemontcg.io/sm11/222_hires.png",
  },
  {
    externalId: "mock-pkm-rayquaza-vmax",
    name: "Rayquaza VMAX",
    set: "Evolving Skies #218",
    imageUrl: "https://images.pokemontcg.io/swsh7/218_hires.png",
  },
];

function searchPokemonMock(query: string): CardResult[] {
  const q = query.toLowerCase();
  return POKEMON_MOCK.filter((c) => c.name.toLowerCase().includes(q));
}

const ONEPIECE_MOCK: CardResult[] = [
  {
    externalId: "mock-op-luffy-leader",
    name: "Monkey D. Luffy (Leader)",
    set: "OP01 Romance Dawn · OP01-001",
    imageUrl:
      "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-001.png",
  },
  {
    externalId: "mock-op-zoro",
    name: "Roronoa Zoro",
    set: "OP01 Romance Dawn · OP01-013",
    imageUrl:
      "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-013.png",
  },
  {
    externalId: "mock-op-ace",
    name: "Portgas D. Ace",
    set: "OP02 Paramount War · OP02-013",
    imageUrl:
      "https://en.onepiece-cardgame.com/images/cardlist/card/OP02-013.png",
  },
];

function searchOnepieceMock(query: string): CardResult[] {
  const q = query.toLowerCase();
  return ONEPIECE_MOCK.filter((c) => c.name.toLowerCase().includes(q));
}
