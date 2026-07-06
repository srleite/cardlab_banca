"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteAuctionAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = createClient();
  // RLS já garante que só o dono shop ou admin pode deletar.
  // Se a política bloquear, o delete retorna sem erro mas afetando 0 linhas.
  const { error } = await supabase.from("auctions").delete().eq("id", id);

  if (error) {
    // TODO PEDRO (T2): surfaçar o erro na UI (ver TAREFAS_PEDRO.md).
    // Por ora é silencioso — o usuário só vê a página recarregar.
    console.error("Falha ao deletar leilão:", error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/leiloes");
}
