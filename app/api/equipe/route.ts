import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const membros = await prisma.user.findMany({
    where: { empresaId: session.user.empresaId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(membros);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Apenas o dono da empresa pode remover membros." }, { status: 403 });
  }

  const { userId } = await req.json();
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Você não pode remover a si mesmo." }, { status: 400 });
  }

  const result = await prisma.user.deleteMany({
    where: { id: userId, empresaId: session.user.empresaId, role: "MEMBER" },
  });

  if (!result.count) return NextResponse.json({ error: "Membro não encontrado." }, { status: 404 });
  return NextResponse.json({ success: true });
}
