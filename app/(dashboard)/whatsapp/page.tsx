"use client";
import { useEffect, useState } from "react";
import { MessageCircle, Loader2, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const variaveis = ["{nome}", "{valor}", "{descricao}", "{vencimento}", "{pix}"];

export default function WhatsAppPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/config").then(r => r.json()).then(d => { setConfig(d); setLoading(false); });
  }, []);

  async function salvar() {
    setSaving(true);
    await fetch("/api/whatsapp/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configurar WhatsApp</h1>
          <p className="text-slate-500 text-sm mt-0.5">Personalize as mensagens automáticas</p>
        </div>
        <Button onClick={salvar} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Salvo! ✅" : "Salvar"}
        </Button>
      </div>

      {/* Variáveis disponíveis */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Variáveis disponíveis nas mensagens:</p>
              <div className="flex flex-wrap gap-2">
                {variaveis.map(v => (
                  <code key={v} className="bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">{v}</code>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>Informações que aparecem nas mensagens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome da Empresa</Label>
              <Input value={config?.empresa || ""} onChange={e => setConfig((c: any) => ({...c, empresa: e.target.value}))} placeholder="Minha Empresa" />
            </div>
            <div className="space-y-1.5">
              <Label>Chave PIX</Label>
              <Input value={config?.chavePix || ""} onChange={e => setConfig((c: any) => ({...c, chavePix: e.target.value}))} placeholder="CPF, email ou chave aleatória" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ativo"
              checked={config?.ativo ?? true}
              onChange={e => setConfig((c: any) => ({...c, ativo: e.target.checked}))}
              className="h-4 w-4 accent-emerald-600"
            />
            <Label htmlFor="ativo" className="cursor-pointer">Disparos automáticos ativos</Label>
          </div>
        </CardContent>
      </Card>

      {/* Mensagens */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">3</span>
              Mensagem — 3 Dias Antes do Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config?.msgAntes3dias || ""}
              onChange={e => setConfig((c: any) => ({...c, msgAntes3dias: e.target.value}))}
              rows={4}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">!</span>
              Mensagem — No Dia do Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config?.msgNoDia || ""}
              onChange={e => setConfig((c: any) => ({...c, msgNoDia: e.target.value}))}
              rows={4}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-red-100 text-red-700 text-xs flex items-center justify-center font-bold">!</span>
              Mensagem — 1 Dia Após o Vencimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config?.msgApos1dia || ""}
              onChange={e => setConfig((c: any) => ({...c, msgApos1dia: e.target.value}))}
              rows={4}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pb-6">
        <Button onClick={salvar} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Configurações salvas! ✅" : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
