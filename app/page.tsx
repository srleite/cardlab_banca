import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge, Button, Card } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import Image from "next/image";
import { formatBRL, GAME_LABEL } from "@/lib/format";

export default async function HomePage() {
  const supabase = createClient();
  const { data: featured } = await supabase
    .from("auctions")
    .select("id, game, card_name, condition, image_url, starting_price, current_bid, ends_at")
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: true })
    .limit(4);

  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <span className="accent-line mx-auto" />
          <h1 className="text-3xl font-bold sm:text-4xl">
            Leilões de cartas colecionáveis
          </h1>
          <p className="mx-auto mt-3 max-w-xl" style={{ color: "var(--text-muted)" }}>
            Magic, Pokémon TCG e One Piece TCG em um só lugar. Encontre cartas
            de lojas verificadas.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/leiloes">
              <Button size="lg">Ver leilões</Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" variant="secondary">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="section-title mb-0">Encerrando em breve</h2>
          <Link
            href="/leiloes"
            className="text-sm hover:underline"
            style={{ color: "var(--purple-light)" }}
          >
            Ver todos →
          </Link>
        </div>

        {!featured || featured.length === 0 ? (
          <Card className="p-10 text-center" style={{ color: "var(--text-muted)" }}>
            Sem leilões ativos no momento.
          </Card>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a) => (
              <li key={a.id}>
                <Link href={`/leiloes/${a.id}`} className="block focus-ring">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-[3/4]" style={{ background: "var(--bg-elevated)" }}>
                      <Image
                        src={a.image_url}
                        alt={a.card_name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="truncate font-medium">{a.card_name}</p>
                      <div className="mt-1 flex gap-1 text-xs">
                        <Badge>{GAME_LABEL[a.game]}</Badge>
                        <Badge>{a.condition}</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="font-semibold" style={{ color: "var(--gold)" }}>
                          {formatBRL(a.current_bid ?? a.starting_price)}
                        </span>
                        <Countdown endsAt={a.ends_at} />
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
