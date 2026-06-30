import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Populando banco de dados...");

  const senha = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "pedro@cobrafacil.com" },
    update: {},
    create: {
      name: "Pedro Machado",
      email: "pedro@cobrafacil.com",
      password: senha,
      empresa: "CobraFácil Demo",
      telefone: "21988875063",
      chavePix: "21988875063",
      configWpp: {
        create: { ativo: true },
      },
    },
  });

  console.log("✅ Usuário criado:", user.email);

  const clientesData = [
    { nome: "Pedro Machado (Você)", telefone: "21988875063", email: "pedro@teste.com", cpf: "000.000.000-00", userId: user.id },
    { nome: "Maria Silva", telefone: "21999990001", email: "maria@email.com", userId: user.id },
    { nome: "João Santos", telefone: "21999990002", email: "joao@email.com", userId: user.id },
    { nome: "Ana Oliveira", telefone: "21999990003", userId: user.id },
    { nome: "Carlos Pereira", telefone: "21999990004", email: "carlos@email.com", userId: user.id },
  ];

  for (const c of clientesData) {
    await prisma.cliente.upsert({
      where: { id: c.userId + c.telefone },
      update: {},
      create: c,
    }).catch(() => prisma.cliente.create({ data: c }));
  }

  const clientesList = await prisma.cliente.findMany({ where: { userId: user.id } });
  console.log("✅ Clientes criados:", clientesList.length);

  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  const ontem = new Date(hoje.getTime() - 86400000);
  const em3dias = new Date(hoje.getTime() + 3 * 86400000);
  const em7dias = new Date(hoje.getTime() + 7 * 86400000);
  const em15dias = new Date(hoje.getTime() + 15 * 86400000);
  const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);

  const pedro = clientesList.find(c => c.telefone === "21988875063")!;
  const maria = clientesList.find(c => c.nome === "Maria Silva")!;
  const joao = clientesList.find(c => c.nome === "João Santos")!;
  const ana = clientesList.find(c => c.nome === "Ana Oliveira")!;
  const carlos = clientesList.find(c => c.nome === "Carlos Pereira")!;

  const cobrancasExistentes = await prisma.cobranca.count({ where: { userId: user.id } });
  if (cobrancasExistentes === 0) {
    await prisma.cobranca.createMany({
      data: [
        { descricao: "Mensalidade Junho", valor: 150.00, vencimento: hoje, status: "PENDENTE", clienteId: pedro.id, userId: user.id },
        { descricao: "Serviço de Design", valor: 500.00, vencimento: em3dias, status: "PENDENTE", clienteId: pedro.id, userId: user.id },
        { descricao: "Consultoria Mensal", valor: 800.00, vencimento: em7dias, status: "PENDENTE", clienteId: maria.id, userId: user.id },
        { descricao: "Mensalidade Maio", valor: 800.00, vencimento: mesPassado, status: "PAGO", pagoEm: mesPassado, clienteId: maria.id, userId: user.id },
        { descricao: "Manutenção Site", valor: 250.00, vencimento: ontem, status: "VENCIDO", clienteId: joao.id, userId: user.id },
        { descricao: "Hospedagem Anual", valor: 350.00, vencimento: em15dias, status: "PENDENTE", clienteId: joao.id, userId: user.id },
        { descricao: "Aula Particular", valor: 120.00, vencimento: em3dias, status: "PENDENTE", clienteId: ana.id, userId: user.id },
        { descricao: "Aula Particular", valor: 120.00, vencimento: mesPassado, status: "PAGO", pagoEm: mesPassado, clienteId: ana.id, userId: user.id },
        { descricao: "Freelance Desenvolvimento", valor: 1200.00, vencimento: ontem, status: "VENCIDO", clienteId: carlos.id, userId: user.id },
        { descricao: "Suporte Técnico", valor: 300.00, vencimento: em7dias, status: "PENDENTE", clienteId: carlos.id, userId: user.id },
      ],
    });
    console.log("✅ 10 cobranças criadas!");
  } else {
    console.log("ℹ️  Cobranças já existem, pulando...");
  }

  console.log("\n🎉 Banco populado com sucesso!");
  console.log("   Email: pedro@cobrafacil.com");
  console.log("   Senha: 123456");
  console.log("   WhatsApp de teste: (21) 98887-5063");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
