"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [invalido, setInvalido] = useState(false);
  const [email, setEmail] = useState("");
  const [empresaNome, setEmpresaNome] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch(`/api/convites/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setEmail(data.email);
        setEmpresaNome(data.empresaNome);
      })
      .catch(() => setInvalido(true))
      .finally(() => setCarregando(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    const res = await fetch(`/api/convites/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao aceitar convite.");
      setEnviando(false);
      return;
    }

    router.push("/login?registered=1");
  }

  if (carregando) {
    return <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />;
  }

  if (invalido) {
    return (
      <div className="w-full max-w-md px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <h1 className="text-xl font-bold text-slate-800">Convite inválido ou expirado</h1>
          <p className="text-slate-500 text-sm mt-2">Peça para o dono da empresa enviar um novo convite.</p>
          <Link href="/login" className="text-emerald-600 font-medium hover:underline text-sm mt-4 inline-block">Ir para o login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg mb-4">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Você foi convidado!</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">Junte-se a <strong>{empresaNome}</strong> no CobraFácil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Nome completo *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
          </div>
          <div className="space-y-1.5">
            <Label>Crie uma senha *</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{erro}</div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={enviando}>
            {enviando ? <><Loader2 className="h-4 w-4 animate-spin" />Entrando...</> : "Aceitar convite e entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
