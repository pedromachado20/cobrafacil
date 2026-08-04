import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, email, password, empresa, telefone, chavePix } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Este email já está em uso." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const nomeEmpresa = (empresa || "").trim() || `${name} — Empresa`;

  const user = await prisma.$transaction(async (tx) => {
    const novaEmpresa = await tx.empresa.create({
      data: {
        nome: nomeEmpresa,
        chavePix: chavePix || null,
        configWpp: { create: {} },
      },
    });

    return tx.user.create({
      data: {
        name,
        email,
        password: hashed,
        telefone: telefone || null,
        empresaId: novaEmpresa.id,
        role: "OWNER",
      },
    });
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
