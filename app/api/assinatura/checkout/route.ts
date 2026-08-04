import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateCustomer, createSubscription, getSubscriptionInvoiceUrl } from "@/lib/asaas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.empresaId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Apenas o dono da empresa pode gerenciar a assinatura." }, { status: 403 });
  }

  const { planoId, cpfCnpj } = await req.json();
  const plano = await prisma.plano.findUnique({ where: { id: planoId } });
  if (!plano) return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 });

  let empresa = await prisma.empresa.findUniqueOrThrow({ where: { id: session.user.empresaId } });
  const dono = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  if (!empresa.cnpj && !cpfCnpj) {
    return NextResponse.json({ error: "Informe o CPF ou CNPJ da empresa para assinar.", precisaCpfCnpj: true }, { status: 400 });
  }

  if (cpfCnpj && cpfCnpj !== empresa.cnpj) {
    empresa = await prisma.empresa.update({ where: { id: empresa.id }, data: { cnpj: cpfCnpj } });
  }

  try {
    const customer = await findOrCreateCustomer({
      name: empresa.nome,
      email: dono.email,
      cpfCnpj: empresa.cnpj!,
    });

    const subscription = await createSubscription({
      customerId: customer.id,
      value: Number(plano.precoMensal),
      description: `CobraFácil - Plano ${plano.nome}`,
    });

    await prisma.assinatura.upsert({
      where: { empresaId: session.user.empresaId },
      update: {
        planoId: plano.id,
        asaasCustomerId: customer.id,
        asaasSubscriptionId: subscription.id,
        proximaCobranca: new Date(subscription.nextDueDate),
      },
      create: {
        empresaId: session.user.empresaId,
        planoId: plano.id,
        status: "TRIAL",
        asaasCustomerId: customer.id,
        asaasSubscriptionId: subscription.id,
        proximaCobranca: new Date(subscription.nextDueDate),
      },
    });

    const invoiceUrl = await getSubscriptionInvoiceUrl(subscription.id);
    return NextResponse.json({ invoiceUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Erro ao iniciar checkout no Asaas: ${message}` }, { status: 502 });
  }
}
