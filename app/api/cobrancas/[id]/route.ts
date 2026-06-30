import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;

  const cobranca = await prisma.cobranca.findFirst({
    where: { id, userId: session.user.id },
    include: { cliente: true, lembretes: { orderBy: { enviadoEm: "desc" } } },
  });

  if (!cobranca) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(cobranca);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.descricao !== undefined) data.descricao = body.descricao;
  if (body.valor !== undefined) data.valor = body.valor;
  if (body.vencimento !== undefined) data.vencimento = new Date(body.vencimento);
  if (body.observ !== undefined) data.observ = body.observ || null;
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "PAGO") data.pagoEm = new Date();
    if (body.status !== "PAGO") data.pagoEm = null;
  }

  const result = await prisma.cobranca.updateMany({
    where: { id, userId: session.user.id },
    data,
  });

  if (!result.count) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;

  await prisma.cobranca.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
