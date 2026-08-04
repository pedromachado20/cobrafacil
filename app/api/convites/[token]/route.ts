import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const convite = await prisma.convite.findUnique({
    where: { token },
    include: { empresa: { select: { nome: true } } },
  });

  if (!convite || convite.aceitoEm || convite.expiraEm < new Date()) {
    return NextResponse.json({ error: "Convite inválido ou expirado." }, { status: 404 });
  }

  return NextResponse.json({ email: convite.email, empresaNome: convite.empresa.nome });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { name, password } = await req.json();

  if (!name || !password || password.length < 6) {
    return NextResponse.json({ error: "Nome e senha (mín. 6 caracteres) são obrigatórios." }, { status: 400 });
  }

  const convite = await prisma.convite.findUnique({ where: { token } });
  if (!convite || convite.aceitoEm || convite.expiraEm < new Date()) {
    return NextResponse.json({ error: "Convite inválido ou expirado." }, { status: 404 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: convite.email } });
  if (existingUser) {
    return NextResponse.json({ error: "Já existe uma conta com este email." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const novoUser = await tx.user.create({
      data: {
        name,
        email: convite.email,
        password: hashed,
        empresaId: convite.empresaId,
        role: convite.role,
      },
    });
    await tx.convite.update({ where: { id: convite.id }, data: { aceitoEm: new Date() } });
    return novoUser;
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
