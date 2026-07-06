import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { EditAuctionForm } from "./edit-auction-form";

export default async function EditarLeilaoPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=/dashboard/editar/${params.id}`);

  const supabase = createClient();

  const { data: auction, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("id", params.id)
    .eq("shop_id", user.id)
    .single();

  if (error || !auction) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← Voltar ao Dashboard
      </Link>

      <h1 className="mt-2 mb-6 text-2xl font-semibold">Editar Leilão</h1>

      <EditAuctionForm auction={auction} />
    </div>
  );
}
