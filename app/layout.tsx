import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "CardLab — Leilão de cartas colecionáveis",
  description: "Magic, Pokémon TCG e One Piece TCG em um só lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="cardlab-footer">
          CardLab · Trabalho de Estágio · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
