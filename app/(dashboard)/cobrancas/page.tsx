"use client";
import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Plus, Search, CheckCircle, Trash2, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate, getDaysUntil } from "@/lib/utils";

interface Cobranca {
  id: string;
  descricao: string;
  valor: string;
  vencimento: string;
  status: string;
  cliente: { id: string; nome: string; telefone: string };
}

const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "pendente" as const },
  PAGO: { label: "Pago", variant: "pago" as const },
  VENCIDO: { label: "Vencido", variant: "vencido" as const },
  CANCELADO: { label: "Cancelado", variant: "cancelado" as const },
};

function CobrancasList() {
  const searchParams = useSearchParams();
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [loading, setLoading] = useState(true);

  const fetchCobrancas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status) params.set("status", status);
    const res = await fetch(`/api/cobrancas?${params}`);
    const data = await res.json();
    setCobrancas(data);
    setLoading(false);
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(fetchCobrancas, 300);
    return () => clearTimeout(t);
  }, [fetchCobrancas]);

  async function marcarPago(id: string) {
    await fetch(`/api/cobrancas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAGO" }),
    });
    fetchCobrancas();
  }

  async function deletar(id: string) {
    if (!confirm("Excluir esta cobrança?")) return;
    await fetch(`/api/cobrancas/${id}`, { method: "DELETE" });
    fetchCobrancas();
  }

  async function enviarWpp(id: string) {
    const res = await fetch("/api/whatsapp/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cobrancaId: id }),
    });
    const data = await res.json();
    alert(res.ok ? "Mensagem enviada com sucesso! ✅" : `Erro: ${data.error}`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cobranças</h1>
          <p className="text-slate-500 text-sm mt-0.5">{cobrancas.length} cobrança(s)</p>
        </div>
        <Link href="/cobrancas/nova">
          <Button><Plus className="h-4 w-4" />Nova Cobrança</Button>
        </Link>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar cobrança ou cliente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status || "TODOS"} onValueChange={(v) => setStatus(v === "TODOS" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendentes</SelectItem>
            <SelectItem value="VENCIDO">Vencidas</SelectItem>
            <SelectItem value="PAGO">Pagas</SelectItem>
            <SelectItem value="CANCELADO">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : cobrancas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileText className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhuma cobrança encontrada</p>
            <Link href="/cobrancas/nova" className="mt-4">
              <Button size="sm"><Plus className="h-4 w-4" />Nova cobrança</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cobrancas.map((c) => {
            const cfg = statusConfig[c.status as keyof typeof statusConfig];
            const dias = getDaysUntil(c.vencimento);
            return (
              <Card key={c.id} className={`hover:border-emerald-200 transition-colors ${c.status === "VENCIDO" ? "border-red-200 bg-red-50/30" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800">{c.cliente.nome}</p>
                        <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
                        {c.status === "PENDENTE" && dias === 0 && <Badge variant="vencido">Vence hoje!</Badge>}
                        {c.status === "PENDENTE" && dias > 0 && dias <= 3 && <Badge variant="pendente">Em {dias} dia(s)</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{c.descricao}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Vencimento: {formatDate(c.vencimento)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <p className="font-bold text-slate-800 text-lg">{formatCurrency(c.valor)}</p>
                      <div className="flex gap-1">
                        <Link href={`/cobrancas/${c.id}`}>
                          <Button variant="ghost" size="icon" title="Ver detalhes"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        {c.status !== "PAGO" && c.status !== "CANCELADO" && (
                          <>
                            <Button variant="ghost" size="icon" title="Enviar WhatsApp" onClick={() => enviarWpp(c.id)}>
                              <MessageCircle className="h-4 w-4 text-emerald-600" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Marcar como pago" onClick={() => marcarPago(c.id)}>
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" title="Excluir" onClick={() => deletar(c.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CobrancasPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>}>
      <CobrancasList />
    </Suspense>
  );
}
