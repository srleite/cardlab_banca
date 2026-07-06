"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/schemas";

export type ProfileActionState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    shopName: formData.get("shopName") || undefined,
    bio: formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      shop_name: parsed.data.shopName,
      bio: parsed.data.bio,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: "Erro ao salvar perfil. Tente novamente." };
  }

  revalidatePath("/perfil");
  revalidatePath("/", "layout"); // atualiza display_name na nav
  return { ok: true };
}
