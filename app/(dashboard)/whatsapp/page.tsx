"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, Info, BookOpen, Settings, CheckCircle2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const variaveis = ["{nome}", "{valor}", "{descricao}", "{vencimento}", "{pix}"];

type Aba = "configurar" | "mensagens" | "guia";

function StepItem({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 h-7 w-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{num}</div>
      <div className="flex-1 pb-5 border-b border-slate-100 last:border-0">
        <p className="font-semibold text-slate-800 mb-1">{title}</p>
        <div className="text-sm text-slate-600 space-y-1">{children}</div>
      </div>
    </div>
  );
}

function GuiaZAPI() {
  return (
    <div className="space-y-1">
      <StepItem num={1} title="Criar conta na Z-API">
        <p>Acesse <span className="font-mono bg-slate-100 px-1 rounded">app.z-api.io</span> e clique em <strong>Criar conta grátis</strong>.</p>
        <p className="text-slate-500">A Z-API oferece período de teste gratuito. Para uso contínuo, o plano pago começa em torno de R$ 69/mês.</p>
      </StepItem>
      <StepItem num={2} title="Criar uma instância">
        <p>Após o login, clique em <strong>"Nova Instância"</strong> e dê um nome (ex: <em>MeuNegócio</em>).</p>
      </StepItem>
      <StepItem num={3} title="Conectar o WhatsApp">
        <p>Na sua instância, clique em <strong>"Conectar"</strong>. Um QR Code vai aparecer na tela.</p>
        <p>No seu celular, abra o <strong>WhatsApp → Menu → Aparelhos conectados → Conectar aparelho</strong> e escaneie o QR Code.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
          <p className="text-amber-700 font-medium">⚠️ Importante: o número de WhatsApp conectado será o remetente de todas as mensagens de cobrança.</p>
        </div>
      </StepItem>
      <StepItem num={4} title="Pegar as credenciais">
        <p>Na tela da instância, copie:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>Instance ID</strong> — código longo da instância</li>
          <li><strong>Token</strong> — token de autenticação</li>
          <li><strong>Client-Token</strong> — em <em>Segurança → Client-Token</em></li>
        </ul>
      </StepItem>
      <StepItem num={5} title="Configurar no sistema (Vercel)">
        <p>No painel da Vercel, vá em <strong>Settings → Environment Variables</strong> e adicione:</p>
        <div className="bg-slate-800 text-emerald-400 rounded-lg p-3 mt-2 font-mono text-xs space-y-1">
          <p>ZAPI_INSTANCE_ID=sua_instancia_id</p>
          <p>ZAPI_TOKEN=seu_token</p>
          <p>ZAPI_CLIENT_TOKEN=seu_client_token</p>
          <p>ZAPI_BASE_URL=https://api.z-api.io/instances</p>
        </div>
        <p className="mt-2">Depois clique em <strong>Redeploy</strong> para aplicar.</p>
      </StepItem>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-700">Pronto!</p>
          <p className="text-sm text-emerald-600 mt-0.5">Volte para a aba <strong>Mensagens</strong>, personalize os textos, salve e os disparos automáticos já estarão ativos.</p>
        </div>
      </div>
    </div>
  );
}

function GuiaEvolution() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-blue-700">ℹ️ A Evolution API é gratuita e open source, mas requer um servidor próprio (ex: VPS na DigitalOcean, Hostinger, etc.) para hospedar. Ideal para quem quer custo zero de API.</p>
      </div>
      <StepItem num={1} title="Ter um servidor VPS">
        <p>Contrate um VPS com Ubuntu 22.04. Opções acessíveis: <strong>Hostinger VPS</strong> (~R$ 30/mês) ou <strong>DigitalOcean Droplet</strong> (~U$ 6/mês).</p>
      </StepItem>
      <StepItem num={2} title="Instalar a Evolution API">
        <p>No servidor, execute:</p>
        <div className="bg-slate-800 text-emerald-400 rounded-lg p-3 mt-2 font-mono text-xs">
          <p>bash &lt;(curl -fsSL https://evolution-api.com/install)</p>
        </div>
        <p className="mt-1">Siga as instruções do instalador. Acesse a documentação em <span className="font-mono bg-slate-100 px-1 rounded">doc.evolution-api.com</span>.</p>
      </StepItem>
      <StepItem num={3} title="Criar instância e conectar WhatsApp">
        <p>Acesse o painel da Evolution API no seu servidor, crie uma instância e escaneie o QR Code com seu WhatsApp.</p>
      </StepItem>
      <StepItem num={4} title="Configurar no sistema">
        <p>Na Vercel, adicione as variáveis de ambiente com a URL do seu servidor:</p>
        <div className="bg-slate-800 text-emerald-400 rounded-lg p-3 mt-2 font-mono text-xs space-y-1">
          <p>ZAPI_BASE_URL=https://seu-servidor.com/message/sendText</p>
          <p>ZAPI_TOKEN=sua_api_key_evolution</p>
        </div>
        <p className="mt-2 text-amber-600 font-medium">Nota: a Evolution API usa endpoints diferentes. Será necessário ajustar o código de integração.</p>
      </StepItem>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-2"
      >
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {open ? "Ocultar recomendação" : "Qual escolher? Z-API ou Evolution API?"}
      </button>
      {open && (
        <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-slate-600"></th>
                <th className="text-center px-4 py-2 font-medium text-emerald-700">Z-API</th>
                <th className="text-center px-4 py-2 font-medium text-blue-700">Evolution API</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Custo", "~R$ 69/mês", "Gratuito"],
                ["Dificuldade", "Fácil", "Técnico"],
                ["Servidor próprio", "Não precisa", "Necessário"],
                ["Estabilidade", "Alta", "Depende do VPS"],
                ["Suporte", "Sim", "Comunidade"],
                ["Recomendado para", "Iniciantes", "Técnicos/Dev"],
              ].map(([item, zapi, evol]) => (
                <tr key={item} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-slate-600 font-medium">{item}</td>
                  <td className="px-4 py-2 text-center text-slate-700">{zapi}</td>
                  <td className="px-4 py-2 text-center text-slate-700">{evol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function WhatsAppPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aba, setAba] = useState<Aba>("guia");
  const [provider, setProvider] = useState<"zapi" | "evolution">("zapi");

  useEffect(() => {
    fetch("/api/whatsapp/config")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || `Erro ${r.status} ao carregar configuração.`);
        return r.json();
      })
      .then((d) => setConfig(d))
      .catch((e) => setErro(e.message || "Erro ao carregar configuração do WhatsApp."))
      .finally(() => setLoading(false));
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

  if (erro || !config) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {erro || "Não foi possível carregar a configuração do WhatsApp."}
        </div>
      </div>
    );
  }

  const abas: { id: Aba; label: string; icon: React.ReactNode }[] = [
    { id: "guia", label: "Como Configurar", icon: <BookOpen className="h-4 w-4" /> },
    { id: "configurar", label: "Dados da Empresa", icon: <Settings className="h-4 w-4" /> },
    { id: "mensagens", label: "Mensagens", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">WhatsApp</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configuração e mensagens automáticas</p>
        </div>
        {aba !== "guia" && (
          <Button onClick={salvar} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saved ? "Salvo! ✅" : "Salvar"}
          </Button>
        )}
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {abas.map(a => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              aba === a.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {a.icon}{a.label}
          </button>
        ))}
      </div>

      {/* Aba: Guia */}
      {aba === "guia" && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-slate-500 text-sm">Escolha qual serviço você vai usar para enviar as mensagens:</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setProvider("zapi")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${provider === "zapi" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">Z-API</span>
                {provider === "zapi" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              </div>
              <p className="text-xs text-slate-500">Pago · Fácil · Recomendado para iniciantes</p>
              <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Já integrado</span>
            </button>

            <button
              onClick={() => setProvider("evolution")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${provider === "evolution" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">Evolution API</span>
                {provider === "evolution" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500">Gratuito · Técnico · Requer servidor VPS</p>
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Open Source</span>
            </button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {provider === "zapi" ? "Passo a passo — Z-API" : "Passo a passo — Evolution API"}
                <a
                  href={provider === "zapi" ? "https://app.z-api.io" : "https://doc.evolution-api.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-emerald-600 flex items-center gap-1 hover:underline font-normal"
                >
                  <ExternalLink className="h-3 w-3" />
                  Abrir site
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {provider === "zapi" ? <GuiaZAPI /> : <GuiaEvolution />}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Aba: Configurar empresa */}
      {aba === "configurar" && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Aparecem nas mensagens enviadas aos clientes</CardDescription>
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
        </div>
      )}

      {/* Aba: Mensagens */}
      {aba === "mensagens" && (
        <div className="space-y-4 animate-fade-in">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">3</span>
                3 Dias Antes do Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={config?.msgAntes3dias || ""} onChange={e => setConfig((c: any) => ({...c, msgAntes3dias: e.target.value}))} rows={4} className="font-mono text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">!</span>
                No Dia do Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={config?.msgNoDia || ""} onChange={e => setConfig((c: any) => ({...c, msgNoDia: e.target.value}))} rows={4} className="font-mono text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-red-100 text-red-700 text-xs flex items-center justify-center font-bold">!</span>
                1 Dia Após o Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={config?.msgApos1dia || ""} onChange={e => setConfig((c: any) => ({...c, msgApos1dia: e.target.value}))} rows={4} className="font-mono text-sm" />
            </CardContent>
          </Card>

          <div className="flex justify-end pb-6">
            <Button onClick={salvar} disabled={saving} size="lg">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saved ? "Configurações salvas! ✅" : "Salvar Configurações"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
