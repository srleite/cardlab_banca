import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge, Button, Card } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { formatBRL, GAME_LABEL, CONDITION_LABEL } from "@/lib/format";

export default async function LeilaoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: auction } = await supabase
    .from("auctions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!auction) notFound();

  const { data: shop } = await supabase
    .from("profiles")
    .select("id, shop_name, display_name, bio")
    .eq("id", auction.shop_id)
    .single();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/leiloes"
        className="text-sm hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← Voltar para leilões
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Imagem + descrição */}
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4]" style={{ background: "var(--bg-elevated)" }}>
            <Image
              src={auction.image_url}
              alt={auction.card_name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain"
              priority
            />
          </div>

          {auction.description && (
            <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
              <h2 className="mb-2 font-medium">Descrição</h2>
              <p className="whitespace-pre-line text-sm" style={{ color: "var(--text-muted)" }}>
                {auction.description}
              </p>
            </div>
          )}
        </Card>

        {/* Coluna lateral: preço, prazo, ações */}
        <div className="space-y-4">
          <Card className="p-5">
            <h1 className="text-xl font-semibold">{auction.card_name}</h1>
            <div className="mt-2 flex gap-2">
              <Badge>{GAME_LABEL[auction.game]}</Badge>
              <Badge>{CONDITION_LABEL[auction.condition]}</Badge>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt style={{ color: "var(--text-dim)" }}>Preço inicial</dt>
                <dd className="text-lg font-semibold">
                  {formatBRL(auction.starting_price)}
                </dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-dim)" }}>Lance atual</dt>
                <dd className="text-lg font-semibold" style={{ color: "var(--gold)" }}>
                  {auction.current_bid
                    ? formatBRL(auction.current_bid)
                    : "— (sem lances)"}
                </dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-dim)" }}>Encerra em</dt>
                <dd>
                  <Countdown endsAt={auction.ends_at} />
                </dd>
              </div>
            </dl>

            {/* "Dar lance" desabilitado — preview de feature futura */}
            <Button disabled className="mt-5 w-full" title="Em breve">
              Dar lance (em breve)
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>Vendedor</h2>
            <p className="mt-1 font-medium">
              🏪 {shop?.shop_name ?? shop?.display_name ?? "—"}
            </p>
            {shop?.bio && (
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{shop.bio}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
