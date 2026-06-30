"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, Plus, Search, Phone, Mail, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPhone } from "@/lib/utils";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  cpf: string | null;
  _count: { cobrancas: number };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/clientes?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setClientes(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchClientes, 300);
    return () => clearTimeout(t);
  }, [fetchClientes]);

  async function deletar(id: string, nome: string) {
    if (!confirm(`Desativar cliente "${nome}"?`)) return;
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    fetchClientes();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <Link href="/clientes/novo">
          <Button><Plus className="h-4 w-4" />Novo Cliente</Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : clientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum cliente encontrado</p>
            <p className="text-slate-400 text-sm mt-1">Comece cadastrando seu primeiro cliente</p>
            <Link href="/clientes/novo" className="mt-4">
              <Button size="sm"><Plus className="h-4 w-4" />Cadastrar cliente</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {clientes.map((c) => (
            <Card key={c.id} className="hover:border-emerald-200 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-emerald-700 font-semibold text-sm">
                        {c.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{c.nome}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />{formatPhone(c.telefone)}
                        </span>
                        {c.email && (
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />{c.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary">{c._count.cobrancas} cobranças</Badge>
                    <Link href={`/clientes/${c.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => deletar(c.id, c.nome)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
