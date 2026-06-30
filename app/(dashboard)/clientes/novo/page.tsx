"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cpf: "", endereco: "", observ: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/clientes");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/clientes">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Novo Cliente</h1>
          <p className="text-slate-500 text-sm">Preencha os dados do cliente</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Dados do Cliente</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Nome completo *</Label>
                <Input name="nome" placeholder="João Silva" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label>Telefone / WhatsApp *</Label>
                <Input name="telefone" placeholder="(21) 99999-9999" value={form.telefone} onChange={handleChange} required />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="joao@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label>CPF</Label>
                <Input name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label>Endereço</Label>
                <Input name="endereco" placeholder="Rua, número, bairro" value={form.endereco} onChange={handleChange} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Observações</Label>
                <Textarea name="observ" placeholder="Informações adicionais sobre o cliente" value={form.observ} onChange={handleChange} rows={3} />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : "Salvar Cliente"}
              </Button>
              <Link href="/clientes">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
