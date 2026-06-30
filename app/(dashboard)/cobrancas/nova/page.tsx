"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Cliente { id: string; nome: string; telefone: string }

function NovaCobrancaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    clienteId: searchParams.get("clienteId") || "",
    descricao: "",
    valor: "",
    vencimento: "",
    observ: "",
  });

  useEffect(() => {
    fetch("/api/clientes").then(r => r.json()).then(setClientes);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/cobrancas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/cobrancas");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/cobrancas"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Cobrança</h1>
          <p className="text-slate-500 text-sm">Registre uma nova cobrança</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Dados da Cobrança</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              {clientes.length === 0 ? (
                <div className="text-sm text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Nenhum cliente cadastrado.{" "}
                  <Link href="/clientes/novo" className="text-emerald-600 font-medium underline">Cadastrar agora</Link>
                </div>
              ) : (
                <Select value={form.clienteId} onValueChange={(v) => setForm(f => ({ ...f, clienteId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome} — {c.telefone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Descrição *</Label>
              <Input name="descricao" placeholder="Ex: Mensalidade Janeiro, Serviço prestado..." value={form.descricao} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Valor (R$) *</Label>
                <Input name="valor" type="number" step="0.01" min="0.01" placeholder="0,00" value={form.valor} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label>Vencimento *</Label>
                <Input name="vencimento" type="date" value={form.vencimento} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea name="observ" placeholder="Instruções de pagamento, detalhes..." value={form.observ} onChange={handleChange} rows={3} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading || !form.clienteId} className="flex-1">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : "Criar Cobrança"}
              </Button>
              <Link href="/cobrancas">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NovaCobrancaPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>}>
      <NovaCobrancaForm />
    </Suspense>
  );
}
