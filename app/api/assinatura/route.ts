import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [assinatura, planos, usoClientes, usoCobrancas] = await Promise.all([
    prisma.assinatura.findUnique({ where: { empresaId: session.user.empresaId }, include: { plano: true } }),
    prisma.plano.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } }),
    prisma.cliente.count({ where: { empresaId: session.user.empresaId, ativo: true } }),
    prisma.cobranca.count({
      where: {
        empresaId: session.user.empresaId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ]);

  return NextResponse.json({ assinatura, planos, usoClientes, usoCobrancas });
}
