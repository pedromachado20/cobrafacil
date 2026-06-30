import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;

  const cliente = await prisma.cliente.findFirst({
    where: { id, userId: session.user.id },
    include: {
      cobrancas: { orderBy: { vencimento: "desc" }, take: 20 },
      _count: { select: { cobrancas: true } },
    },
  });

  if (!cliente) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const cliente = await prisma.cliente.updateMany({
    where: { id, userId: session.user.id },
    data: {
      nome: body.nome,
      telefone: body.telefone,
      email: body.email || null,
      cpf: body.cpf || null,
      endereco: body.endereco || null,
      observ: body.observ || null,
    },
  });

  if (!cliente.count) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;

  await prisma.cliente.updateMany({
    where: { id, userId: session.user.id },
    data: { ativo: false },
  });

  return NextResponse.json({ success: true });
}
