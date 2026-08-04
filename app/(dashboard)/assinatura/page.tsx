"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CreditCard, Check, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface Plano {
  id: string;
  nome: string;
  precoMensal: string;
  maxClientes: number;
  maxCobrancasMes: number;
  maxUsuarios: number;
  whatsappAtivo: boolean;
}

interface Assinatura {
  status: "TRIAL" | "ATIVA" | "INADIMPLENTE" | "CANCELADA" | "EXPIRADA";
  trialFim: string | null;
  proximaCobranca: string | null;
  plano: Plano;
}

const statusInfo: Record<Assinatura["status"], { label: string; variant: "default" | "pendente" | "vencido" | "cancelado" }> = {
  TRIAL: { label: "Período de teste", variant: "pendente" },
  ATIVA: { label: "Ativa", variant: "default" },
  INADIMPLENTE: { label: "Pagamento pendente", variant: "vencido" },
  CANCELADA: { label: "Cancelada", variant: "cancelado" },
  EXPIRADA: { label: "Teste expirado", variant: "cancelado" },
};

export default function AssinaturaPage() {
  const { data: session } = useSession();
  const isOwner = session?.user?.role === "OWNER";

  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [uso, setUso] = useState({ usoClientes: 0, usoCobrancas: 0 });
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [cnpj, setCnpj] = useState<string | null>(null);
  const [cpfCnpjInput, setCpfCnpjInput] = useState("");

  const carregar = useCallback(async () => {
    try {
      const res = await fetch("/api/assinatura");
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || `Erro ${res.status} ao carregar assinatura.`);
      const data = await res.json();
      setAssinatura(data.assinatura);
      setPlanos(data.planos);
      setUso({ usoClientes: data.usoClientes, usoCobrancas: data.usoCobrancas });
      setCnpj(data.cnpj);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar assinatura.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(carregar, 0);
    return () => clearTimeout(t);
  }, [carregar]);

  async function assinar(planoId: string) {
    if (!cnpj && !cpfCnpjInput.trim()) {
      setErro("Informe o CPF ou CNPJ da empresa antes de assinar.");
      return;
    }

    setProcessando(planoId);
    setErro("");
    const res = await fetch("/api/assinatura/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planoId, cpfCnpj: cnpj || cpfCnpjInput.replace(/\D/g, "") }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao iniciar assinatura.");
      setProcessando(null);
      return;
    }

    if (data.invoiceUrl) window.location.href = data.invoiceUrl;
    else carregar();
    setProcessando(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assinatura</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerencie o plano da sua empresa</p>
      </div>

      {assinatura && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-800">Plano {assinatura.plano.nome}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(Number(assinatura.plano.precoMensal))}/mês</p>
                </div>
              </div>
              <Badge variant={statusInfo[assinatura.status].variant}>{statusInfo[assinatura.status].label}</Badge>
            </div>
            {assinatura.status === "TRIAL" && assinatura.trialFim && (
              <p className="text-sm text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Teste termina em {new Date(assinatura.trialFim).toLocaleDateString("pt-BR")}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 pt-2 border-t border-slate-100">
              <p>Clientes: {uso.usoClientes}{assinatura.plano.maxClientes !== -1 ? ` / ${assinatura.plano.maxClientes}` : ""}</p>
              <p>Cobranças este mês: {uso.usoCobrancas}{assinatura.plano.maxCobrancasMes !== -1 ? ` / ${assinatura.plano.maxCobrancasMes}` : ""}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {erro && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{erro}</div>}

      {isOwner && !cnpj && (
        <Card>
          <CardContent className="p-5 space-y-1.5">
            <Label>CPF ou CNPJ da empresa</Label>
            <Input
              placeholder="Necessário para gerar cobranças no Asaas"
              value={cpfCnpjInput}
              onChange={(e) => setCpfCnpjInput(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {isOwner && (
        <div className="grid gap-4 sm:grid-cols-3">
          {planos.map((p) => {
            const atual = assinatura?.plano.id === p.id && assinatura.status === "ATIVA";
            return (
              <Card key={p.id} className={atual ? "border-emerald-300 ring-1 ring-emerald-200" : ""}>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="font-bold text-slate-800">{p.nome}</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {formatCurrency(Number(p.precoMensal))}<span className="text-sm text-slate-400 font-normal">/mês</span>
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{p.maxClientes === -1 ? "Clientes ilimitados" : `${p.maxClientes} clientes`}</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{p.maxCobrancasMes === -1 ? "Cobranças ilimitadas" : `${p.maxCobrancasMes} cobranças/mês`}</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{p.maxUsuarios === -1 ? "Usuários ilimitados" : `${p.maxUsuarios} usuário(s)`}</li>
                    {p.whatsappAtivo && <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />Lembretes por WhatsApp</li>}
                  </ul>
                  <Button
                    className="w-full"
                    variant={atual ? "outline" : "default"}
                    disabled={atual || processando === p.id}
                    onClick={() => assinar(p.id)}
                  >
                    {processando === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : atual ? "Plano atual" : "Assinar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
