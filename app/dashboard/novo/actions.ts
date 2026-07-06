"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { newAuctionSchema } from "@/lib/schemas";

export type NewAuctionState = { error?: string } | undefined;

export async function createAuctionAction(
  _prev: NewAuctionState,
  formData: FormData,
): Promise<NewAuctionState> {
  // FormData carrega tudo como string — convertemos números antes de validar
  const parsed = newAuctionSchema.safeParse({
    game: formData.get("game"),
    cardName: formData.get("cardName"),
    imageUrl: formData.get("imageUrl"),
    description: formData.get("description") || undefined,
    condition: formData.get("condition"),
    startingPrice: Number(formData.get("startingPrice")),
    durationDays: Number(formData.get("durationDays")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada." };

  const endsAt = new Date(
    Date.now() + parsed.data.durationDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error } = await supabase.from("auctions").insert({
    shop_id: user.id,
    game: parsed.data.game,
    card_name: parsed.data.cardName,
    description: parsed.data.description,
    condition: parsed.data.condition,
    image_url: parsed.data.imageUrl,
    starting_price: parsed.data.startingPrice,
    status: "active", // MVP: publica direto, não passa por "draft"
    ends_at: endsAt,
  });

  if (error) {
    // RLS bloqueia se o usuário não tem role 'shop'
    if (error.code === "42501" || error.message.includes("policy")) {
      return { error: "Sua conta não tem permissão para criar leilões." };
    }
    return { error: "Erro ao criar leilão. Tente novamente." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/leiloes");
  redirect("/dashboard");
}
