import Link from "next/link";
import { MessageCircle, BarChart3, Users, Clock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

const recursos = [
  {
    icon: MessageCircle,
    titulo: "Lembretes automáticos por WhatsApp",
    descricao: "Seus clientes recebem lembrete 3 dias antes, no dia do vencimento e no dia seguinte se atrasar — sem você precisar cobrar manualmente.",
  },
  {
    icon: Users,
    titulo: "Gestão de clientes e cobranças",
    descricao: "Cadastre clientes, crie cobranças recorrentes e acompanhe tudo num painel simples, feito pra quem não tem tempo a perder.",
  },
  {
    icon: BarChart3,
    titulo: "Relatórios e dashboard",
    descricao: "Veja quanto está pendente, pago e vencido, com relatórios por período pra fechar o mês com clareza.",
  },
  {
    icon: Clock,
    titulo: "Equipe com múltiplos usuários",
    descricao: "Convide sua equipe pra ajudar a gerenciar as cobranças da sua empresa, cada um com seu próprio login.",
  },
];

export default async function LandingPage() {
  const planos = await prisma.plano.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } });

  return (
    <div className="bg-white">
      <MarketingNavbar />

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight max-w-3xl mx-auto">
            Pare de cobrar cliente no braço.
            <span className="text-emerald-600"> Deixe o WhatsApp fazer isso por você.</span>
          </h1>
          <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto">
            CobraFácil organiza suas cobranças e envia lembretes automáticos por WhatsApp, pra você receber em dia sem precisar ficar cobrando ninguém.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/registro">
              <Button size="lg">Começar grátis por 14 dias<ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/precos">
              <Button size="lg" variant="outline">Ver preços</Button>
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">Sem cartão de crédito para testar.</p>
        </div>
      </section>

      <section id="recursos" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Tudo que você precisa pra receber em dia</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {recursos.map((r) => (
              <Card key={r.titulo}>
                <CardContent className="p-6 flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <r.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{r.titulo}</p>
                    <p className="text-sm text-slate-500 mt-1">{r.descricao}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {planos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Planos para todo tamanho de negócio</h2>
            <p className="text-slate-500 mt-2">Comece grátis por 14 dias, sem compromisso.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {planos.map((p) => (
              <Card key={p.id} className={p.slug === "professional" ? "border-emerald-300 ring-1 ring-emerald-200" : ""}>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="font-bold text-slate-800">{p.nome}</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {formatCurrency(Number(p.precoMensal))}<span className="text-sm text-slate-400 font-normal">/mês</span>
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{p.maxClientes === -1 ? "Clientes ilimitados" : `${p.maxClientes} clientes`}</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{p.maxCobrancasMes === -1 ? "Cobranças ilimitadas" : `${p.maxCobrancasMes} cobranças/mês`}</li>
                  </ul>
                  <Link href="/registro" className="block">
                    <Button className="w-full" variant={p.slug === "professional" ? "default" : "outline"}>Começar grátis</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link href="/precos" className="text-emerald-600 font-medium text-sm hover:underline">Ver comparação completa dos planos →</Link>
          </p>
        </section>
      )}

      <section className="bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pronto para parar de perder tempo cobrando?</h2>
          <p className="text-emerald-50 mt-3">Crie sua conta grátis e mande sua primeira cobrança em minutos.</p>
          <Link href="/registro" className="inline-block mt-6">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">Começar agora</Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
