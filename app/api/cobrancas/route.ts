import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");
  const clienteId = req.nextUrl.searchParams.get("clienteId");
  const search = req.nextUrl.searchParams.get("q") || "";

  const cobrancas = await prisma.cobranca.findMany({
    where: {
      userId: session.user.id,
      ...(status && { status: status as "PENDENTE" | "PAGO" | "VENCIDO" | "CANCELADO" }),
      ...(clienteId && { clienteId }),
      ...(search && {
        OR: [
          { descricao: { contains: search, mode: "insensitive" } },
          { cliente: { nome: { contains: search, mode: "insensitive" } } },
        ],
      }),
    },
    include: { cliente: { select: { id: true, nome: true, telefone: true } } },
    orderBy: { vencimento: "asc" },
  });

  return NextResponse.json(cobrancas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { descricao, valor, vencimento, clienteId, observ } = body;

  if (!descricao || !valor || !vencimento || !clienteId) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const cliente = await prisma.cliente.findFirst({ where: { id: clienteId, userId: session.user.id } });
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });

  const cobranca = await prisma.cobranca.create({
    data: {
      descricao,
      valor,
      vencimento: new Date(vencimento),
      clienteId,
      userId: session.user.id,
      observ: observ || null,
    },
    include: { cliente: true },
  });

  return NextResponse.json(cobranca, { status: 201 });
}
