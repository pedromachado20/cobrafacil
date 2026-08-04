import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const convites = await prisma.convite.findMany({
    where: { empresaId: session.user.empresaId, aceitoEm: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(convites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Apenas o dono da empresa pode convidar membros." }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email é obrigatório." }, { status: 400 });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Já existe uma conta com este email." }, { status: 409 });
  }

  const empresa = await prisma.empresa.findUniqueOrThrow({ where: { id: session.user.empresaId } });

  const convite = await prisma.convite.create({
    data: {
      email,
      empresaId: session.user.empresaId,
      role: "MEMBER",
      convidadoPorId: session.user.id,
      expiraEm: new Date(Date.now() + 7 * 86400000),
    },
  });

  const link = `${req.nextUrl.origin}/convite/${convite.token}`;
  try {
    await sendInviteEmail(email, empresa.nome, link);
  } catch (err) {
    console.error("Falha ao enviar email de convite:", err);
    return NextResponse.json(
      { ...convite, warning: "Convite criado, mas o email não pôde ser enviado. Compartilhe o link manualmente.", link },
      { status: 201 }
    );
  }

  return NextResponse.json(convite, { status: 201 });
}
