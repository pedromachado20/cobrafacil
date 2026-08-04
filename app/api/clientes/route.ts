import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimite, LimiteExcedidoError } from "@/lib/limites";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("q") || "";
  const clientes = await prisma.cliente.findMany({
    where: {
      empresaId: session.user.empresaId,
      ativo: true,
      ...(search && {
        OR: [
          { nome: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { telefone: { contains: search } },
        ],
      }),
    },
    include: { _count: { select: { cobrancas: true } } },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(clientes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { nome, telefone, email, cpf, endereco, observ } = body;

  if (!nome || !telefone) {
    return NextResponse.json({ error: "Nome e telefone são obrigatórios." }, { status: 400 });
  }

  try {
    await checkLimite(session.user.empresaId, "cliente");
  } catch (err) {
    if (err instanceof LimiteExcedidoError) return NextResponse.json({ error: err.message }, { status: 402 });
    throw err;
  }

  const cliente = await prisma.cliente.create({
    data: { nome, telefone, email, cpf, endereco, observ, empresaId: session.user.empresaId, criadoPorId: session.user.id },
  });

  return NextResponse.json(cliente, { status: 201 });
}
