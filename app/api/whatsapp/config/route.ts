import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const config = await prisma.configWhatsApp.findUnique({ where: { userId: session.user.id } });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { chavePix: true, empresa: true } });

  return NextResponse.json({ ...config, chavePix: user?.chavePix, empresa: user?.empresa });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { ativo, msgAntes3dias, msgNoDia, msgApos1dia, chavePix, empresa } = body;

  await prisma.configWhatsApp.upsert({
    where: { userId: session.user.id },
    update: { ativo, msgAntes3dias, msgNoDia, msgApos1dia },
    create: { userId: session.user.id, ativo, msgAntes3dias, msgNoDia, msgApos1dia },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { chavePix: chavePix || null, empresa: empresa || null },
  });

  return NextResponse.json({ success: true });
}
