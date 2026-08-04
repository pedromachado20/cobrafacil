import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PrecosPage() {
  const planos = await prisma.plano.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Preços simples, sem pegadinha</h1>
          <p className="text-slate-500 mt-3">14 dias grátis em qualquer plano. Cancele quando quiser.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {planos.map((p) => (
            <Card key={p.id} className={p.slug === "professional" ? "border-emerald-300 ring-1 ring-emerald-200 sm:scale-105" : ""}>
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="font-bold text-lg text-slate-800">{p.nome}</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {formatCurrency(Number(p.precoMensal))}<span className="text-sm text-slate-400 font-normal">/mês</span>
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" />{p.maxClientes === -1 ? "Clientes ilimitados" : `Até ${p.maxClientes} clientes`}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" />{p.maxCobrancasMes === -1 ? "Cobranças ilimitadas" : `Até ${p.maxCobrancasMes} cobranças/mês`}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" />{p.maxUsuarios === -1 ? "Usuários ilimitados" : `${p.maxUsuarios} usuário(s) na equipe`}</li>
                  {p.whatsappAtivo && <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" />Lembretes automáticos por WhatsApp</li>}
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" />Relatórios e dashboard</li>
                </ul>
                <Link href="/registro" className="block">
                  <Button className="w-full" variant={p.slug === "professional" ? "default" : "outline"}>Começar grátis</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-12">
          Dúvidas? Fale com a gente pelo WhatsApp após criar sua conta.
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
