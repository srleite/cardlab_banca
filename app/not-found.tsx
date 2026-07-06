import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8 text-center">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          O recurso que você procurou não existe ou foi removido.
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button>Voltar ao início</Button>
        </Link>
      </Card>
    </div>
  );
}
