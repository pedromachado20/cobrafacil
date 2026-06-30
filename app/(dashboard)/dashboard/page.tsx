"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, AlertTriangle, Clock, Users, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardData {
  totalPendente: number;
  countPendente: number;
  totalPago: number;
  countPago: number;
  totalVencido: number;
  countVencido: number;
  vencendoHoje: number;
  vencendo7dias: number;
  cobrancasRecentes: Array<{
    id: string;
    descricao: string;
    valor: string;
    vencimento: string;
    status: string;
    cliente: { nome: string };
  }>;
}

const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "pendente" as const },
  PAGO: { label: "Pago", variant: "pago" as const },
  VENCIDO: { label: "Vencido", variant: "vencido" as const },
  CANCELADO: { label: "Cancelado", variant: "cancelado" as const },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Visão geral das suas cobranças</p>
        </div>
        <Link href="/cobrancas/nova">
          <Button>
            <Plus className="h-4 w-4" />
            Nova Cobrança
          </Button>
        </Link>
      </div>

      {/* Alertas */}
      {(data?.vencendoHoje || 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-amber-700 text-sm font-medium">
            <strong>{data?.vencendoHoje}</strong> cobrança(s) vencem <strong>hoje</strong>.{" "}
            <Link href="/cobrancas?status=PENDENTE" className="underline">Ver agora →</Link>
          </p>
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">A Receber</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(data?.totalPendente || 0)}</p>
                <p className="text-xs text-slate-400 mt-1">{data?.countPendente || 0} cobranças pendentes</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Recebido (mês)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(data?.totalPago || 0)}</p>
                <p className="text-xs text-slate-400 mt-1">{data?.countPago || 0} cobranças pagas</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(data?.totalVencido || 0)}</p>
                <p className="text-xs text-slate-400 mt-1">{data?.countVencido || 0} cobranças vencidas</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cobranças recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Cobranças Recentes</CardTitle>
          <Link href="/cobrancas">
            <Button variant="ghost" size="sm" className="gap-1 text-emerald-600">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!data?.cobrancasRecentes?.length ? (
            <div className="text-center py-8 text-slate-400">
              <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Nenhuma cobrança ainda.</p>
              <Link href="/cobrancas/nova">
                <Button variant="outline" size="sm" className="mt-3">Criar primeira cobrança</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.cobrancasRecentes.map((c) => {
                const cfg = statusConfig[c.status as keyof typeof statusConfig];
                return (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">{c.cliente.nome}</p>
                      <p className="text-sm text-slate-500 truncate">{c.descricao}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(c.valor)}</p>
                        <p className="text-xs text-slate-400">{formatDate(c.vencimento)}</p>
                      </div>
                      <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/clientes/novo">
          <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">Novo Cliente</p>
                <p className="text-xs text-slate-500">Cadastrar cliente</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/cobrancas/nova">
          <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Plus className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">Nova Cobrança</p>
                <p className="text-xs text-slate-500">Registrar cobrança</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
