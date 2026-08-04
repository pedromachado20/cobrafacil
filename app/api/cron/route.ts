import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsApp, buildMessage } from "@/lib/zapi";
import { formatCurrency, formatDate } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje.getTime() + 86400000);
  const em3dias = new Date(hoje.getTime() + 3 * 86400000);
  const ontem = new Date(hoje.getTime() - 86400000);

  let enviados = 0;
  let erros = 0;

  // Marca vencidas
  await prisma.cobranca.updateMany({
    where: { status: "PENDENTE", vencimento: { lt: hoje } },
    data: { status: "VENCIDO" },
  });

  // Busca configs de usuários com WhatsApp ativo
  const configs = await prisma.configWhatsApp.findMany({
    where: { ativo: true },
    include: { empresa: { select: { id: true, chavePix: true } } },
  });

  for (const config of configs) {
    const empresaId = config.empresa.id;

    // Cobranças vencendo em 3 dias
    const antes3 = await prisma.cobranca.findMany({
      where: {
        empresaId,
        status: "PENDENTE",
        vencimento: { gte: em3dias, lt: new Date(em3dias.getTime() + 86400000) },
        lembretes: { none: { tipo: "ANTES_3_DIAS", enviadoEm: { gte: hoje } } },
      },
      include: { cliente: true },
    });

    for (const c of antes3) {
      const vars = { nome: c.cliente.nome, valor: formatCurrency(Number(c.valor)), descricao: c.descricao, vencimento: formatDate(c.vencimento), pix: config.empresa.chavePix || "" };
      const msg = buildMessage(config.msgAntes3dias, vars);
      try {
        await sendWhatsApp(c.cliente.telefone, msg);
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "ANTES_3_DIAS", sucesso: true } });
        enviados++;
      } catch (e: unknown) {
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "ANTES_3_DIAS", sucesso: false, erro: String(e) } });
        erros++;
      }
    }

    // Cobranças vencendo hoje
    const noDia = await prisma.cobranca.findMany({
      where: {
        empresaId,
        status: "PENDENTE",
        vencimento: { gte: hoje, lt: amanha },
        lembretes: { none: { tipo: "NO_DIA", enviadoEm: { gte: hoje } } },
      },
      include: { cliente: true },
    });

    for (const c of noDia) {
      const vars = { nome: c.cliente.nome, valor: formatCurrency(Number(c.valor)), descricao: c.descricao, vencimento: formatDate(c.vencimento), pix: config.empresa.chavePix || "" };
      const msg = buildMessage(config.msgNoDia, vars);
      try {
        await sendWhatsApp(c.cliente.telefone, msg);
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "NO_DIA", sucesso: true } });
        enviados++;
      } catch (e: unknown) {
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "NO_DIA", sucesso: false, erro: String(e) } });
        erros++;
      }
    }

    // Cobranças vencidas ontem
    const apos1 = await prisma.cobranca.findMany({
      where: {
        empresaId,
        status: "VENCIDO",
        vencimento: { gte: ontem, lt: hoje },
        lembretes: { none: { tipo: "APOS_1_DIA", enviadoEm: { gte: hoje } } },
      },
      include: { cliente: true },
    });

    for (const c of apos1) {
      const vars = { nome: c.cliente.nome, valor: formatCurrency(Number(c.valor)), descricao: c.descricao, vencimento: formatDate(c.vencimento), pix: config.empresa.chavePix || "" };
      const msg = buildMessage(config.msgApos1dia, vars);
      try {
        await sendWhatsApp(c.cliente.telefone, msg);
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "APOS_1_DIA", sucesso: true } });
        enviados++;
      } catch (e: unknown) {
        await prisma.lembrete.create({ data: { cobrancaId: c.id, tipo: "APOS_1_DIA", sucesso: false, erro: String(e) } });
        erros++;
      }
    }
  }

  return NextResponse.json({ success: true, enviados, erros });
}
