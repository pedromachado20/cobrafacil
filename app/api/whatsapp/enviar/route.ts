import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWhatsApp, buildMessage } from "@/lib/zapi";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { cobrancaId } = await req.json();

  const cobranca = await prisma.cobranca.findFirst({
    where: { id: cobrancaId, empresaId: session.user.empresaId },
    include: { cliente: true, empresa: true },
  });

  if (!cobranca) return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 });

  const config = await prisma.configWhatsApp.findUnique({ where: { empresaId: session.user.empresaId } });

  const vars = {
    nome: cobranca.cliente.nome,
    valor: formatCurrency(Number(cobranca.valor)),
    descricao: cobranca.descricao,
    vencimento: formatDate(cobranca.vencimento),
    pix: cobranca.empresa.chavePix || "não informado",
  };

  const mensagem = buildMessage(config?.msgNoDia || "Olá {nome}! Sua cobrança de *R$ {valor}* referente a *{descricao}* vence em {vencimento}. PIX: {pix}", vars);

  try {
    await sendWhatsApp(cobranca.cliente.telefone, mensagem);

    await prisma.lembrete.create({
      data: {
        cobrancaId,
        tipo: "NO_DIA",
        sucesso: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await prisma.lembrete.create({
      data: {
        cobrancaId,
        tipo: "NO_DIA",
        sucesso: false,
        erro: errorMessage,
      },
    });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
