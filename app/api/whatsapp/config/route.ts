import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const config = await prisma.configWhatsApp.findUnique({ where: { empresaId: session.user.empresaId } });
  const empresa = await prisma.empresa.findUnique({ where: { id: session.user.empresaId }, select: { chavePix: true, nome: true } });

  return NextResponse.json({ ...config, chavePix: empresa?.chavePix, empresa: empresa?.nome });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { ativo, msgAntes3dias, msgNoDia, msgApos1dia, chavePix, empresa } = body;

  await prisma.configWhatsApp.upsert({
    where: { empresaId: session.user.empresaId },
    update: { ativo, msgAntes3dias, msgNoDia, msgApos1dia },
    create: { empresaId: session.user.empresaId, ativo, msgAntes3dias, msgNoDia, msgApos1dia },
  });

  await prisma.empresa.update({
    where: { id: session.user.empresaId },
    data: { chavePix: chavePix || null, nome: empresa || undefined },
  });

  return NextResponse.json({ success: true });
}
