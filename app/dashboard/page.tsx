import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Badge, Button, Card } from "@/components/ui";
import { Countdown } from "@/components/countdown";
import { formatBRL, GAME_LABEL } from "@/lib/format";
import { DeleteButton } from "./delete-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/dashboard");

  const supabase = createClient();

  // Verifica papel shop
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  const isShop = roles?.some((r) => r.role === "shop") ?? false;

  if (!isShop) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <Card className="p-8">
          <h1 className="text-xl font-semibold">Dashboard de Lojista</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Sua conta não tem permissão de lojista. Entre em contato com o
            administrador para promover sua conta a vendedor.
          </p>
        </Card>
      </div>
    );
  }

  // Lista leilões do shop
  const { data: auctions } = await supabase
    .from("auctions")
    .select("*")
    .eq("shop_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Leilões</h1>
        <Link href="/dashboard/novo">
          <Button>+ Novo Leilão</Button>
        </Link>
      </header>

      {!auctions || auctions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl">📦</div>
          <p className="mt-4" style={{ color: "var(--text-muted)" }}>
            Você ainda não tem leilões. Cadastre sua primeira carta para começar.
          </p>
          <Link href="/dashboard/novo">
            <Button className="mt-4">+ Novo Leilão</Button>
          </Link>
        </Card>
      ) : (
        <Card>
          <ul style={{ borderColor: "var(--border)" }} className="divide-y divide-[color:var(--border)]">
            {auctions.map((a) => (
              <li key={a.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded" style={{ background: "var(--bg-elevated)" }}>
                  <Image
                    src={a.image_url}
                    alt={a.card_name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{a.card_name}</p>
                    <Badge>{a.status}</Badge>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {GAME_LABEL[a.game]} · {a.condition} ·{" "}
                    <Countdown endsAt={a.ends_at} />
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium" style={{ color: "var(--gold)" }}>{formatBRL(a.starting_price)}</p>
                  {a.current_bid && (
                    <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                      lance: {formatBRL(a.current_bid)}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <Link
                    href={`/leiloes/${a.id}`}
                    className="transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    aria-label="Ver"
                  >
                    👁
                  </Link>
                  <Link
                    href={`/dashboard/editar/${a.id}`}
                    className="transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    aria-label="Editar"
                  >
                    ✏️
                  </Link>
                  <DeleteButton id={a.id} cardName={a.card_name} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
