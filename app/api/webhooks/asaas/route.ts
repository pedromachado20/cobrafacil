import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_POR_EVENTO: Record<string, "ATIVA" | "INADIMPLENTE" | "CANCELADA"> = {
  PAYMENT_CONFIRMED: "ATIVA",
  PAYMENT_RECEIVED: "ATIVA",
  PAYMENT_OVERDUE: "INADIMPLENTE",
  SUBSCRIPTION_DELETED: "CANCELADA",
  PAYMENT_DELETED: "CANCELADA",
};

export async function POST(req: NextRequest) {
  const token = req.headers.get("asaas-access-token");
  if (!process.env.ASAAS_WEBHOOK_SECRET || token !== process.env.ASAAS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const payload = await req.json();
  const evento: string = payload.event;
  const payment = payload.payment;
  const subscriptionId: string | undefined = payment?.subscription;

  const eventId = `${evento}-${payment?.id || subscriptionId || Date.now()}`;

  const jaProcessado = await prisma.asaasEvento.findUnique({ where: { eventId } });
  if (jaProcessado) return NextResponse.json({ success: true, dedupe: true });

  await prisma.asaasEvento.create({ data: { eventId, tipo: evento, payload } });

  const novoStatus = STATUS_POR_EVENTO[evento];
  if (novoStatus && subscriptionId) {
    await prisma.assinatura.updateMany({
      where: { asaasSubscriptionId: subscriptionId },
      data: {
        status: novoStatus,
        ...(novoStatus === "ATIVA" && payment?.nextDueDate ? { proximaCobranca: new Date(payment.nextDueDate) } : {}),
        ...(novoStatus === "CANCELADA" ? { canceladaEm: new Date() } : {}),
      },
    });
  }

  return NextResponse.json({ success: true });
}
