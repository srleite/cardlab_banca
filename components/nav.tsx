
import Link from "next/link";
import { getCurrentUser, createClient } from "@/lib/supabase/server";

export async function Nav() {
  const user = await getCurrentUser();

  let displayName: string | null = null;
  let isShop = false;
  if (user) {
    const supabase = createClient();
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", user.id).single(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
    ]);
    displayName = profile?.display_name ?? null;
    isShop = roles?.some((r) => r.role === "shop") ?? false;
  }

  return (
    <header className="cardlab-nav">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            Card<span style={{ color: "var(--gold)" }}>Lab</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          {/* Jogos dropdown simples */}
          <li>
            <Link
              href="/leiloes?game=magic"
              className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              Magic
            </Link>
          </li>
          <li>
            <Link
              href="/leiloes?game=pokemon"
              className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              Pokémon
            </Link>
          </li>
          <li>
            <Link
              href="/leiloes?game=onepiece"
              className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              One Piece
            </Link>
          </li>
          <li>
            <Link
              href="/leiloes"
              className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              Leilões
            </Link>
          </li>

          {/* Separador */}
          <li aria-hidden className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />

          {user ? (
            <>
              {isShop && (
                <li>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/perfil"
                  className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
                  style={{ color: "var(--purple-light)" }}
                >
                  {displayName ?? "Perfil"}
                </Link>
              </li>
              <li>
                <form action="/logout" method="post">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-md transition-colors hover:bg-white/5 text-sm"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Sair
                  </button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/cadastro"
                  className="btn-gold inline-flex items-center justify-center h-9 px-4 text-sm font-semibold rounded-md"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  Cadastrar
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
