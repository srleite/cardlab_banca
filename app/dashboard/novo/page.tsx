import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { NewAuctionForm } from "./new-auction-form";

export default async function NovoLeilaoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/dashboard/novo");

  // Verifica role shop no servidor antes de renderizar o form
  const supabase = createClient();
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const isShop = roles?.some((r) => r.role === "shop") ?? false;
  if (!isShop) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        ← Voltar ao Dashboard
      </Link>

      <h1 className="mt-2 mb-6 text-2xl font-semibold">Novo Leilão</h1>

      <NewAuctionForm />
    </div>
  );
}
