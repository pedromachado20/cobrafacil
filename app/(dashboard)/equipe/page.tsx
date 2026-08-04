"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Users, UserPlus, Trash2, Mail, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Membro {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER";
  createdAt: string;
}

interface Convite {
  id: string;
  email: string;
  createdAt: string;
  expiraEm: string;
}

export default function EquipePage() {
  const { data: session } = useSession();
  const isOwner = session?.user?.role === "OWNER";

  const [membros, setMembros] = useState<Membro[]>([]);
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    const [resMembros, resConvites] = await Promise.all([
      fetch("/api/equipe"),
      fetch("/api/convites"),
    ]);
    setMembros(await resMembros.json());
    setConvites(await resConvites.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(carregar, 0);
    return () => clearTimeout(t);
  }, [carregar]);

  async function convidar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    setSucesso("");

    const res = await fetch("/api/convites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao enviar convite.");
    } else if (data.warning) {
      setSucesso(`${data.warning} Link: ${data.link}`);
      setEmail("");
      carregar();
    } else {
      setSucesso(`Convite enviado para ${email}.`);
      setEmail("");
      carregar();
    }
    setEnviando(false);
  }

  async function remover(id: string, nome: string) {
    if (!confirm(`Remover "${nome}" da equipe?`)) return;
    await fetch("/api/equipe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });
    carregar();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Equipe</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerencie quem tem acesso à sua empresa no CobraFácil</p>
      </div>

      {isOwner && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={convidar} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="email@dofuncionario.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={enviando}>
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Convidar
              </Button>
            </form>
            {erro && <p className="text-sm text-red-600 mt-2">{erro}</p>}
            {sucesso && <p className="text-sm text-emerald-600 mt-2">{sucesso}</p>}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {membros.map((m) => (
              <Card key={m.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-emerald-700 font-semibold text-sm">{m.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{m.name}</p>
                      <p className="text-sm text-slate-500 truncate">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={m.role === "OWNER" ? "default" : "secondary"}>
                      {m.role === "OWNER" ? "Dono" : "Membro"}
                    </Badge>
                    {isOwner && m.role === "MEMBER" && (
                      <Button variant="ghost" size="icon" onClick={() => remover(m.id, m.name)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {convites.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />Convites pendentes
              </p>
              {convites.map((c) => (
                <Card key={c.id} className="border-dashed">
                  <CardContent className="p-4 flex items-center justify-between">
                    <p className="text-sm text-slate-600">{c.email}</p>
                    <Badge variant="secondary">Aguardando aceite</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {membros.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center py-16 text-center">
                <Users className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Nenhum membro na equipe ainda</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
