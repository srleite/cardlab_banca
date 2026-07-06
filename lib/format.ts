
const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const DATE_PT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatBRL(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "R$ —";
  return BRL.format(n);
}

export function formatDate(iso: string): string {
  return DATE_PT.format(new Date(iso));
}

export function timeUntil(endsAt: string): {
  text: string;
  isUrgent: boolean;
  isEnded: boolean;
} {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return { text: "encerrado", isUrgent: false, isEnded: true };

  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const isUrgent = ms < 24 * 60 * 60 * 1000; // < 24h

  if (days > 0) return { text: `${days}d ${hours}h`, isUrgent, isEnded: false };
  if (hours > 0)
    return { text: `${hours}h ${minutes}m`, isUrgent, isEnded: false };
  return { text: `${minutes}m`, isUrgent, isEnded: false };
}

export const GAME_LABEL = {
  magic: "Magic",
  pokemon: "Pokémon",
  onepiece: "One Piece",
} as const;

export const CONDITION_LABEL = {
  M: "Mint (M)",
  NM: "Near Mint (NM)",
  SP: "Slightly Played (SP)",
  MP: "Moderately Played (MP)",
  HP: "Heavily Played (HP)",
  DMG: "Damaged (DMG)",
} as const;
