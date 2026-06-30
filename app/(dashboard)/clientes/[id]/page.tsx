"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "pendente" as const },
  PAGO: { label: "Pago", variant: "pago" as const },
  VENCIDO: { label: "Vencido", variant: "vencido" as const },
  CANCELADO: { label: "Cancelado", variant: "cancelado" as const },
};

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cpf: "", endereco: "", observ: "" });

  useEffect(() => {
    fetch(`/api/clientes/${id}`).then(r => r.json()).then(d => {
      setCliente(d);
      setForm({ nome: d.nome, telefone: d.telefone, email: d.email || "", cpf: d.cpf || "", endereco: d.endereco || "", observ: d.observ || "" });
      setLoading(false);
    });
  }, [id]);

  async function salvar() {
    setSaving(true);
    await fetch(`/api/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEdit(false);
    router.refresh();
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;
  if (!cliente) return <div className="text-center py-20 text-slate-400">Cliente não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/clientes"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{cliente.nome}</h1>
          <p className="text-slate-500 text-sm">{cliente._count.cobrancas} cobrança(s)</p>
        </div>
        <Button variant={edit ? "outline" : "default"} onClick={() => setEdit(!edit)}>
          {edit ? "Cancelar" : "Editar"}
        </Button>
        {edit && (
          <Button onClick={salvar} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Dados do Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {edit ? (
              <div className="space-y-3">
                <div className="space-y-1"><Label>Nome</Label><Input value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} /></div>
                <div className="space-y-1"><Label>Telefone</Label><Input value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))} /></div>
                <div className="space-y-1"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /></div>
                <div className="space-y-1"><Label>CPF</Label><Input value={form.cpf} onChange={e => setForm(f => ({...f, cpf: e.target.value}))} /></div>
                <div className="space-y-1"><Label>Endereço</Label><Input value={form.endereco} onChange={e => setForm(f => ({...f, endereco: e.target.value}))} /></div>
                <div className="space-y-1"><Label>Observações</Label><Textarea value={form.observ} onChange={e => setForm(f => ({...f, observ: e.target.value}))} rows={2} /></div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600"><Phone className="h-3.5 w-3.5 text-slate-400" />{cliente.telefone}</div>
                {cliente.email && <div className="flex items-center gap-2 text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400" />{cliente.email}</div>}
                {cliente.endereco && <div className="flex items-center gap-2 text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" />{cliente.endereco}</div>}
                {cliente.cpf && <div className="text-slate-500">CPF: {cliente.cpf}</div>}
                {cliente.observ && <div className="text-slate-500 bg-slate-50 p-2 rounded">{cliente.observ}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Cobranças</CardTitle>
            <Link href={`/cobrancas/nova?clienteId=${id}`}>
              <Button size="sm" variant="outline">+ Nova</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!cliente.cobrancas?.length ? (
              <p className="text-slate-400 text-sm text-center py-4">Sem cobranças ainda</p>
            ) : (
              <div className="space-y-2">
                {cliente.cobrancas.map((c: any) => {
                  const cfg = statusConfig[c.status as keyof typeof statusConfig];
                  return (
                    <Link key={c.id} href={`/cobrancas/${c.id}`}>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded px-1">
                        <div>
                          <p className="text-sm font-medium text-slate-700">{c.descricao}</p>
                          <p className="text-xs text-slate-400">{formatDate(c.vencimento)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800">{formatCurrency(c.valor)}</span>
                          <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
