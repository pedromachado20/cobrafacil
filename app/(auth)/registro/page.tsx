"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    empresa: "",
    telefone: "",
    chavePix: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg mb-4">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Criar conta</h1>
          <p className="text-slate-500 text-sm mt-1">Comece a cobrar com facilidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Nome completo *</Label>
              <Input name="name" placeholder="João Silva" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Email *</Label>
              <Input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Senha *</Label>
              <Input name="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="space-y-1.5">
              <Label>Empresa</Label>
              <Input name="empresa" placeholder="Minha Empresa" value={form.empresa} onChange={handleChange} />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input name="telefone" placeholder="(11) 99999-9999" value={form.telefone} onChange={handleChange} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Chave PIX</Label>
              <Input name="chavePix" placeholder="CPF, email, telefone ou chave aleatória" value={form.chavePix} onChange={handleChange} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Criando conta...</> : "Criar conta grátis"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
