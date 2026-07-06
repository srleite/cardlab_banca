import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { formatBRL, GAME_LABEL } from "@/lib/format";
import { GAMES } from "@/lib/schemas";
import type { GameType } from "@/types/database";

export default async function LeiloesPage({
  searchParams,
}: {
  searchParams: { game?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("auctions")
    .select("id, game, card_name, condition, image_url, starting_price, current_bid, ends_at, shop_id")
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: true });

  if (searchParams.game && GAMES.includes(searchParams.game as GameType)) {
    query = query.eq("game", searchParams.game as GameType);
  }

  const { data: auctions } = await query;

  const shopIds = [...new Set((auctions ?? []).map((a) => a.shop_id))];
  const { data: profiles } = shopIds.length
    ? await supabase
        .from("profiles")
        .select("id, shop_name, display_name")
        .in("id", shopIds)
    : { data: [] };
  const shopMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.shop_name || p.display_name]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Leilões em andamento</h1>

      {/* Filtros */}
      <nav className="mb-6 flex flex-wrap gap-2">
        <FilterChip label="Todos" href="/leiloes" active={!searchParams.game} />
        {GAMES.map((g) => (
          <FilterChip
            key={g}
            label={GAME_LABEL[g]}
            href={`/leiloes?game=${g}`}
            active={searchParams.game === g}
          />
        ))}
      </nav>

      {!auctions || auctions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl">📭</div>
          <p className="mt-4" style={{ color: "var(--text-muted)" }}>
            Nenhum leilão ativo no momento.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {auctions.map((a) => (
            <li key={a.id}>
              <Link
                href={`/leiloes/${a.id}`}
                className="block focus-ring rounded-lg"
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-[3/4]" style={{ background: "var(--bg-elevated)" }}>
                    <Image
                      src={a.image_url}
                      alt={a.card_name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <p className="truncate font-medium" title={a.card_name}>
                      {a.card_name}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <Badge>{GAME_LABEL[a.game]}</Badge>
                      <Badge>{a.condition}</Badge>
                    </div>
                    <p className="mt-2 font-semibold" style={{ color: "var(--gold)" }}>
                      {formatBRL(a.current_bid ?? a.starting_price)}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <Countdown endsAt={a.ends_at} />
                      <span className="truncate" style={{ color: "var(--text-dim)" }}>
                        {shopMap.get(a.shop_id) ?? "—"}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link href={href} className={active ? "filter-chip active" : "filter-chip"}>
      {label}
    </Link>
  );
}
