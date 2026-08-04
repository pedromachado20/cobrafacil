import { prisma } from "@/lib/prisma";

export class LimiteExcedidoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LimiteExcedidoError";
  }
}

async function getAssinaturaAtual(empresaId: string) {
  const assinatura = await prisma.assinatura.findUnique({
    where: { empresaId },
    include: { plano: true },
  });

  if (!assinatura) return null;

  if (assinatura.status === "TRIAL" && assinatura.trialFim && assinatura.trialFim < new Date()) {
    return prisma.assinatura.update({
      where: { id: assinatura.id },
      data: { status: "EXPIRADA" },
      include: { plano: true },
    });
  }

  return assinatura;
}

export async function checkLimite(empresaId: string, tipo: "cliente" | "cobranca") {
  const assinatura = await getAssinaturaAtual(empresaId);

  if (!assinatura || assinatura.status === "EXPIRADA" || assinatura.status === "CANCELADA") {
    throw new LimiteExcedidoError("Seu período de teste acabou. Assine um plano para continuar.");
  }

  if (assinatura.status === "INADIMPLENTE") {
    throw new LimiteExcedidoError("Sua assinatura está com pagamento pendente. Regularize para continuar.");
  }

  if (tipo === "cliente") {
    if (assinatura.plano.maxClientes === -1) return;
    const count = await prisma.cliente.count({ where: { empresaId, ativo: true } });
    if (count >= assinatura.plano.maxClientes) {
      throw new LimiteExcedidoError(`Limite de ${assinatura.plano.maxClientes} clientes do plano ${assinatura.plano.nome} atingido. Faça upgrade para continuar.`);
    }
  }

  if (tipo === "cobranca") {
    if (assinatura.plano.maxCobrancasMes === -1) return;
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const count = await prisma.cobranca.count({ where: { empresaId, createdAt: { gte: inicioMes } } });
    if (count >= assinatura.plano.maxCobrancasMes) {
      throw new LimiteExcedidoError(`Limite de ${assinatura.plano.maxCobrancasMes} cobranças/mês do plano ${assinatura.plano.nome} atingido. Faça upgrade para continuar.`);
    }
  }
}
