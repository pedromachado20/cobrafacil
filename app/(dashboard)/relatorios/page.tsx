"use client";
import { useState, useRef } from "react";
import { BarChart3, Printer, Download, Search, TrendingUp, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "pendente" as const },
  PAGO: { label: "Pago", variant: "pago" as const },
  VENCIDO: { label: "Vencido", variant: "vencido" as const },
  CANCELADO: { label: "Cancelado", variant: "cancelado" as const },
};

function getPrimeiroDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function getHoje() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function RelatoriosPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [inicio, setInicio] = useState(getPrimeiroDiaMes());
  const [fim, setFim] = useState(getHoje());
  const [status, setStatus] = useState("TODOS");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function buscar() {
    setLoading(true);
    const params = new URLSearchParams({ inicio, fim, status });
    const res = await fetch(`/api/relatorios?${params}`);
    const data = await res.json();
    setResultado(data);
    setLoading(false);
  }

  function imprimir() {
    window.print();
  }

  function exportarCSV() {
    if (!resultado) return;
    const header = ["Cliente", "Telefone", "Descrição", "Valor", "Vencimento", "Status", "Pago Em"];
    const rows = resultado.cobrancas.map((c: any) => [
      c.cliente.nome,
      c.cliente.telefone,
      c.descricao,
      Number(c.valor).toFixed(2),
      formatDate(c.vencimento),
      c.status,
      c.pagoEm ? formatDate(c.pagoEm) : "",
    ]);
    const csv = [header, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cobrancas-${inicio}-${fim}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - oculto na impressão */}
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500 text-sm">Gere e imprima relatórios de cobranças</p>
        </div>
        {resultado && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportarCSV}>
              <Download className="h-4 w-4" />CSV
            </Button>
            <Button onClick={imprimir}>
              <Printer className="h-4 w-4" />Imprimir
            </Button>
          </div>
        )}
      </div>

      {/* Filtros - oculto na impressão */}
      <Card className="no-print">
        <CardHeader><CardTitle className="text-sm">Filtros do Relatório</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Data início</Label>
              <Input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Data fim</Label>
              <Input type="date" value={fim} onChange={e => setFim(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDENTE">Pendentes</SelectItem>
                  <SelectItem value="PAGO">Pagos</SelectItem>
                  <SelectItem value="VENCIDO">Vencidos</SelectItem>
                  <SelectItem value="CANCELADO">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={buscar} disabled={loading} className="w-full">
                {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Search className="h-4 w-4" />}
                Gerar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado do relatório */}
      {resultado && (
        <div ref={printRef} className="space-y-6">
          {/* Cabeçalho de impressão */}
          <div className="print-only hidden border-b-2 border-slate-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-800">CobraFácil — Relatório de Cobranças</h1>
            <p className="text-slate-600">Período: {formatDate(resultado.periodo.inicio)} a {formatDate(resultado.periodo.fim)}</p>
            <p className="text-slate-600">Gerado em: {formatDate(new Date())}</p>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">TOTAL</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(resultado.totais.total)}</p>
                <p className="text-xs text-slate-400">{resultado.cobrancas.length} cobranças</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">RECEBIDO</span>
                </div>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(resultado.totais.pago)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">PENDENTE</span>
                </div>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(resultado.totais.pendente)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">VENCIDO</span>
                </div>
                <p className="text-xl font-bold text-red-600">{formatCurrency(resultado.totais.vencido)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Detalhamento — {resultado.cobrancas.length} registros</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Cliente</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Descrição</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-500">Valor</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-500">Vencimento</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-500">Status</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-500">Pago Em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.cobrancas.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhuma cobrança no período</td></tr>
                    ) : (
                      resultado.cobrancas.map((c: any) => {
                        const cfg = statusConfig[c.status as keyof typeof statusConfig];
                        return (
                          <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-slate-800">{c.cliente.nome}</p>
                              <p className="text-xs text-slate-400">{c.cliente.telefone}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{c.descricao}</td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(c.valor)}</td>
                            <td className="px-4 py-3 text-center text-slate-600">{formatDate(c.vencimento)}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant={cfg?.variant}>{cfg?.label}</Badge>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-500 text-xs">
                              {c.pagoEm ? formatDate(c.pagoEm) : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 border-t-2 border-slate-200">
                      <td colSpan={2} className="px-4 py-3 font-semibold text-slate-700">TOTAIS</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(resultado.totais.total)}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Rodapé de impressão */}
          <div className="print-only hidden text-center text-xs text-slate-400 border-t pt-4">
            Relatório gerado pelo CobraFácil — Sistema de Gestão de Cobranças
          </div>
        </div>
      )}

      {!resultado && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Configure os filtros e clique em Gerar</p>
            <p className="text-slate-400 text-sm mt-1">O relatório aparecerá aqui para visualização e impressão</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
