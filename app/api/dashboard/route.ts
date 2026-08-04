import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const empresaId = session.user.empresaId;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const [totalPendente, totalPago, totalVencido, cobrancasRecentes, vencendoHoje, vencendo7dias] =
    await Promise.all([
      prisma.cobranca.aggregate({
        where: { empresaId, status: "PENDENTE" },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cobranca.aggregate({
        where: { empresaId, status: "PAGO", pagoEm: { gte: inicioMes, lte: fimMes } },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cobranca.aggregate({
        where: { empresaId, status: "VENCIDO" },
        _sum: { valor: true },
        _count: true,
      }),
      prisma.cobranca.findMany({
        where: { empresaId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { cliente: { select: { nome: true } } },
      }),
      prisma.cobranca.count({
        where: { empresaId, status: "PENDENTE", vencimento: { gte: hoje, lt: new Date(hoje.getTime() + 86400000) } },
      }),
      prisma.cobranca.count({
        where: { empresaId, status: "PENDENTE", vencimento: { gte: hoje, lt: new Date(hoje.getTime() + 7 * 86400000) } },
      }),
    ]);

  return NextResponse.json({
    totalPendente: Number(totalPendente._sum.valor || 0),
    countPendente: totalPendente._count,
    totalPago: Number(totalPago._sum.valor || 0),
    countPago: totalPago._count,
    totalVencido: Number(totalVencido._sum.valor || 0),
    countVencido: totalVencido._count,
    cobrancasRecentes,
    vencendoHoje,
    vencendo7dias,
  });
}
