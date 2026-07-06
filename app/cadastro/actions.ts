"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/schemas";

export type ActionState = { error?: string } | undefined;

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
    accountType: formData.get("accountType"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, displayName, accountType } = parsed.data;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Falha ao criar conta." };
  }

  if (accountType === "shop") {
    const admin = createAdminClient();

    const { error: roleError } = await admin
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "shop" });

    if (roleError) {
      console.error("Falha ao atribuir papel shop:", roleError);
      return {
        error:
          "Conta criada, mas não foi possível ativar o perfil de lojista. " +
          "Faça login e procure o administrador para promover sua conta.",
      };
    }
  }

  revalidatePath("/", "layout");

  if (!data.session) {
    redirect("/login?message=confirme-email");
  }

  redirect("/perfil");
}
