"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "pendente" as const },
  PAGO: { label: "Pago", variant: "pago" as const },
  VENCIDO: { label: "Vencido", variant: "vencido" as const },
  CANCELADO: { label: "Cancelado", variant: "cancelado" as const },
};

export default function CobrancaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cobranca, setCobranca] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetch(`/api/cobrancas/${id}`).then(r => r.json()).then(d => { setCobranca(d); setLoading(false); });
  }, [id]);

  async function mudarStatus(status: string) {
    setUpdatingStatus(true);
    await fetch(`/api/cobrancas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const res = await fetch(`/api/cobrancas/${id}`);
    setCobranca(await res.json());
    setUpdatingStatus(false);
  }

  async function enviarWpp() {
    setSending(true);
    const res = await fetch("/api/whatsapp/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cobrancaId: id }),
    });
    const data = await res.json();
    setSending(false);
    alert(res.ok ? "Mensagem enviada com sucesso! ✅" : `Erro: ${data.error}`);
    const updated = await fetch(`/api/cobrancas/${id}`);
    setCobranca(await updated.json());
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;
  if (!cobranca) return <div className="text-center py-20 text-slate-400">Cobrança não encontrada.</div>;

  const cfg = statusConfig[cobranca.status as keyof typeof statusConfig];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/cobrancas"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">{cobranca.descricao}</h1>
            <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
          </div>
          <p className="text-slate-500 text-sm">{cobranca.cliente.nome}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Detalhes</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Valor</span><span className="font-bold text-slate-800 text-base">{formatCurrency(cobranca.valor)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Vencimento</span><span className="font-medium">{formatDate(cobranca.vencimento)}</span></div>
            {cobranca.pagoEm && <div className="flex justify-between"><span className="text-slate-500">Pago em</span><span className="text-emerald-600 font-medium">{formatDate(cobranca.pagoEm)}</span></div>}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status</span>
              <Select value={cobranca.status} onValueChange={mudarStatus} disabled={updatingStatus}>
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="PAGO">Pago</SelectItem>
                  <SelectItem value="VENCIDO">Vencido</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cobranca.observ && (
              <div><p className="text-slate-500 mb-1">Observações</p><p className="bg-slate-50 rounded p-2 text-slate-600">{cobranca.observ}</p></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-slate-800">{cobranca.cliente.nome}</p>
            <p className="text-slate-500">{cobranca.cliente.telefone}</p>
            {cobranca.cliente.email && <p className="text-slate-500">{cobranca.cliente.email}</p>}
            <div className="pt-3">
              {cobranca.status !== "PAGO" && cobranca.status !== "CANCELADO" && (
                <Button onClick={enviarWpp} disabled={sending} className="w-full gap-2">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Enviar via WhatsApp
                </Button>
              )}
              {cobranca.status === "PENDENTE" && (
                <Button variant="outline" className="w-full mt-2 text-emerald-600 border-emerald-300" onClick={() => mudarStatus("PAGO")}>
                  <CheckCircle className="h-4 w-4" />Marcar como Pago
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de lembretes */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Histórico de Mensagens WhatsApp</CardTitle></CardHeader>
        <CardContent>
          {!cobranca.lembretes?.length ? (
            <p className="text-slate-400 text-sm text-center py-4">Nenhuma mensagem enviada ainda.</p>
          ) : (
            <div className="space-y-2">
              {cobranca.lembretes.map((l: any) => (
                <div key={l.id} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${l.sucesso ? "bg-emerald-50" : "bg-red-50"}`}>
                  {l.sucesso ? <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                  <div className="flex-1">
                    <p className={l.sucesso ? "text-emerald-700" : "text-red-600"}>
                      {l.tipo === "ANTES_3_DIAS" ? "Lembrete 3 dias antes" : l.tipo === "NO_DIA" ? "Lembrete no vencimento" : "Lembrete após vencimento"} —{" "}
                      {l.sucesso ? "Enviado com sucesso" : `Falhou: ${l.erro}`}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{formatDate(l.enviadoEm)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
