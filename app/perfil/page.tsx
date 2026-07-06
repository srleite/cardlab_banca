import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { ProfileForm } from "./profile-form";
import { formatDate } from "@/lib/format";

export default async function PerfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/perfil");

  const supabase = createClient();
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  if (!profile) {
    // Caso extremo: profile não foi criado pela trigger. Erro do banco.
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="p-6">
          <p className="text-red-600">
            Não conseguimos carregar seu perfil. Saia e entre novamente.
          </p>
        </Card>
      </div>
    );
  }

  const isShop = roles?.some((r) => r.role === "shop") ?? false;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Meu Perfil</h1>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full font-semibold"
            style={{ background: "var(--gold-dim)", color: "var(--gold)" }}
          >
            {(profile.display_name?.charAt(0) ?? user.email?.charAt(0) ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{profile.display_name || "Sem nome cadastrado"}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Membro desde {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        <ProfileForm profile={profile} isShop={isShop} />
      </Card>
    </div>
  );
}
