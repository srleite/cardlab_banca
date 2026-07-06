"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/schemas";

export type ActionState = { error?: string } | undefined;

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  revalidatePath("/", "layout");

  const redirectTo = (formData.get("redirectTo") as string) || "/perfil";
  redirect(redirectTo);
}
