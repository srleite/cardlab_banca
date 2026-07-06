"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateAuctionSchema } from "@/lib/schemas";
import type { Auction } from "@/types/database";

export type EditAuctionState = { error?: string } | undefined;

function canEditAuction(
  auction: Pick<Auction, "current_bid" | "status">,
): { allowed: boolean; reason?: string } {
  if (auction.current_bid != null) {
    return {
      allowed: false,
      reason: "Este leilão já recebeu lances e não pode mais ser editado.",
    };
  }
  if (auction.status !== "active" && auction.status !== "draft") {
    return {
      allowed: false,
      reason: "Apenas leilões ativos ou em rascunho podem ser editados.",
    };
  }
  return { allowed: true };
}

export async function updateAuctionAction(
  _prev: EditAuctionState,
  formData: FormData,
): Promise<EditAuctionState> {
  const parsed = updateAuctionSchema.safeParse({
    id: formData.get("id"),
    condition: formData.get("condition"),
    description: formData.get("description") || undefined,
    startingPrice: Number(formData.get("startingPrice")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const { data: current, error: loadError } = await supabase
    .from("auctions")
    .select("current_bid, status")
    .eq("id", parsed.data.id)
    .eq("shop_id", user.id)
    .single();

  if (loadError || !current) {
    return { error: "Leilão não encontrado." };
  }

  const guard = canEditAuction(current);
  if (!guard.allowed) {
    return { error: guard.reason };
  }

  const { error } = await supabase
    .from("auctions")
    .update({
      condition: parsed.data.condition,
      description: parsed.data.description,
      starting_price: parsed.data.startingPrice,
    })
    .eq("id", parsed.data.id)
    .eq("shop_id", user.id);

  if (error) {
    if (error.code === "42501" || error.message.includes("policy")) {
      return { error: "Você não tem permissão para editar este leilão." };
    }
    if (error.code === "23514" || error.message.includes("já recebeu lances")) {
      return {
        error:
          "Este leilão recebeu um lance enquanto você editava — não é mais possível alterá-lo.",
      };
    }
    return { error: "Erro ao salvar alterações. Tente novamente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/leiloes");
  revalidatePath(`/leiloes/${parsed.data.id}`);
  redirect("/dashboard");
}
