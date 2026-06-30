import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const dataInicio = req.nextUrl.searchParams.get("inicio");
  const dataFim = req.nextUrl.searchParams.get("fim");
  const status = req.nextUrl.searchParams.get("status");

  const inicio = dataInicio ? new Date(dataInicio) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const fim = dataFim ? new Date(dataFim + "T23:59:59") : new Date();

  const cobrancas = await prisma.cobranca.findMany({
    where: {
      userId: session.user.id,
      vencimento: { gte: inicio, lte: fim },
      ...(status && status !== "TODOS" && { status: status as "PENDENTE" | "PAGO" | "VENCIDO" | "CANCELADO" }),
    },
    include: { cliente: { select: { nome: true, telefone: true } } },
    orderBy: { vencimento: "asc" },
  });

  const totais = cobrancas.reduce(
    (acc, c) => {
      const v = Number(c.valor);
      acc.total += v;
      if (c.status === "PAGO") acc.pago += v;
      if (c.status === "PENDENTE") acc.pendente += v;
      if (c.status === "VENCIDO") acc.vencido += v;
      return acc;
    },
    { total: 0, pago: 0, pendente: 0, vencido: 0 }
  );

  return NextResponse.json({ cobrancas, totais, periodo: { inicio, fim } });
}
