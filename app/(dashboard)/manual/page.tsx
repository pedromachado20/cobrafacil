"use client";
import Link from "next/link";
import {
  Printer,
  BookOpen,
  MousePointerClick,
  Keyboard,
  Monitor,
  LogIn,
  LayoutDashboard,
  Users,
  FileText,
  MessageCircle,
  BarChart3,
  UserCog,
  CreditCard,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Passo({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 break-inside-avoid">
      <div className="shrink-0 h-8 w-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {num}
      </div>
      <div className="flex-1 pb-6 border-b border-slate-100 last:border-0">
        <p className="font-semibold text-slate-800 mb-1.5">{title}</p>
        <div className="text-sm text-slate-600 space-y-2 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Dica({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 break-inside-avoid">
      <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800"><strong>Dica:</strong> {children}</p>
    </div>
  );
}

function Exemplo({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 break-inside-avoid">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Exemplo</p>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function Secao({ id, icon: Icon, title, subtitle, children }: { id: string; icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 break-before-page">
      <div className="flex items-center gap-3 mb-1">
        <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <p className="text-sm text-slate-500 mb-5 ml-[52px]">{subtitle}</p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const sumario = [
  { id: "comecando", label: "1. Antes de começar" },
  { id: "entrar", label: "2. Como entrar no sistema" },
  { id: "menu", label: "3. Conhecendo o menu" },
  { id: "clientes", label: "4. Cadastrando clientes" },
  { id: "cobrancas", label: "5. Criando cobranças" },
  { id: "pagamento", label: "6. Marcando como pago" },
  { id: "whatsapp", label: "7. Lembretes por WhatsApp" },
  { id: "dashboard", label: "8. Entendendo o Dashboard" },
  { id: "relatorios", label: "9. Relatórios" },
  { id: "equipe", label: "10. Sua equipe" },
  { id: "assinatura", label: "11. Sua assinatura" },
  { id: "duvidas", label: "12. Perguntas frequentes" },
];

export default function ManualPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-16">
      {/* Cabeçalho */}
      <div className="no-print flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manual do Usuário</h1>
          <p className="text-slate-500 text-sm mt-0.5">Guia completo, passo a passo, para usar o CobraFácil</p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" />Imprimir / Salvar PDF
        </Button>
      </div>

      {/* Cabeçalho de impressão */}
      <div className="print-only hidden border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manual do Usuário — CobraFácil</h1>
        <p className="text-sm text-slate-500 mt-1">Guia completo de uso do sistema</p>
      </div>

      {/* Sumário */}
      <Card className="no-print">
        <CardContent className="p-5">
          <p className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />Sumário
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {sumario.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-sm text-emerald-700 hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-slate-600 leading-relaxed">
        Este manual foi escrito para qualquer pessoa conseguir usar o CobraFácil, mesmo quem nunca usou um computador antes.
        Vá lendo com calma, um passo de cada vez, e vá testando no sistema enquanto lê. Não tem erro que não se resolve — pode
        clicar à vontade para aprender.
      </p>

      {/* 1. Antes de começar */}
      <Secao id="comecando" icon={Monitor} title="1. Antes de começar: o básico" subtitle="Algumas palavras que vamos usar bastante neste manual">
        <Passo num={1} title="O que é clicar">
          <p>
            <MousePointerClick className="inline h-4 w-4 text-emerald-600 mb-0.5" /> &ldquo;Clicar&rdquo; quer dizer apertar o botão
            esquerdo do mouse (ou tocar com o dedo, se você estiver usando celular ou tablet) em cima de alguma coisa na
            tela — um botão, um link, uma palavra.
          </p>
        </Passo>
        <Passo num={2} title="O que é digitar">
          <p>
            <Keyboard className="inline h-4 w-4 text-emerald-600 mb-0.5" /> &ldquo;Digitar&rdquo; quer dizer escrever usando o teclado.
            Quando você clica em um campo (uma caixinha em branco na tela) e ele fica com uma linha piscando, isso significa
            que o sistema está esperando você digitar alguma coisa ali.
          </p>
        </Passo>
        <Passo num={3} title="O que é um campo">
          <p>
            Um &ldquo;campo&rdquo; é uma caixinha em branco onde você escreve uma informação — por exemplo, o campo &ldquo;Nome&rdquo; é onde você
            escreve o nome do seu cliente.
          </p>
        </Passo>
        <Passo num={4} title="O que é um botão">
          <p>
            Um &ldquo;botão&rdquo; é um retângulo colorido (geralmente verde, no CobraFácil) com um texto dentro, como <strong>&ldquo;Salvar&rdquo;</strong> ou{" "}
            <strong>&ldquo;Criar cobrança&rdquo;</strong>. Quando você clica nele, o sistema executa aquela ação.
          </p>
        </Passo>
        <Dica>
          Se você errar ou clicar em algo sem querer, não tem problema! Quase tudo no CobraFácil pode ser corrigido depois.
          Fique à vontade para explorar.
        </Dica>
      </Secao>

      {/* 2. Como entrar */}
      <Secao id="entrar" icon={LogIn} title="2. Como entrar no sistema" subtitle="O primeiro acesso, passo a passo">
        <Passo num={1} title="Abra o navegador de internet">
          <p>
            O &ldquo;navegador&rdquo; é o programa que você usa para acessar sites — geralmente é um ícone colorido no seu computador ou
            celular, como o Google Chrome, Safari ou Edge.
          </p>
        </Passo>
        <Passo num={2} title="Digite o endereço do CobraFácil">
          <p>No topo do navegador tem uma barra branca comprida. Clique nela e digite:</p>
          <Exemplo>
            <code className="font-mono text-emerald-700">cobrafacil.nexusteck.com.br</code>
          </Exemplo>
          <p>Depois aperte a tecla <strong>Enter</strong> no teclado.</p>
        </Passo>
        <Passo num={3} title="Preencha email e senha">
          <p>
            Clique no campo <strong>Email</strong> e digite o email que você cadastrou. Depois clique no campo{" "}
            <strong>Senha</strong> e digite sua senha. Por fim, clique no botão verde <strong>&ldquo;Entrar&rdquo;</strong>.
          </p>
        </Passo>
        <Passo num={4} title="Esqueceu a senha?">
          <p>
            Se você esqueceu sua senha, entre em contato com quem administra sua empresa no sistema (a pessoa &ldquo;Dona&rdquo; da
            conta) para que ela crie um novo acesso para você, ou fale com o suporte do CobraFácil.
          </p>
        </Passo>
        <Dica>
          Marque o CobraFácil como favorito no seu navegador (geralmente uma estrela ⭐ ao lado da barra de endereço) para
          conseguir voltar rapidinho da próxima vez, sem precisar digitar o endereço de novo.
        </Dica>
      </Secao>

      {/* 3. Menu */}
      <Secao id="menu" icon={LayoutDashboard} title="3. Conhecendo o menu" subtitle="O que cada item do menu lateral faz">
        <p className="text-sm text-slate-600 leading-relaxed">
          Depois de entrar, você vai ver uma faixa (menu) do lado esquerdo da tela com vários itens. Em celular, esse menu
          fica escondido — clique no ícone <strong>☰</strong> no canto superior esquerdo para abri-lo.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: LayoutDashboard, label: "Dashboard", desc: "A tela inicial, com um resumo de tudo." },
            { icon: Users, label: "Clientes", desc: "Onde você cadastra e vê seus clientes." },
            { icon: FileText, label: "Cobranças", desc: "Onde você cria e acompanha as cobranças." },
            { icon: MessageCircle, label: "WhatsApp", desc: "Configura os lembretes automáticos." },
            { icon: BarChart3, label: "Relatórios", desc: "Números e totais por período." },
            { icon: UserCog, label: "Equipe", desc: "Convida pessoas para ajudar você." },
            { icon: CreditCard, label: "Assinatura", desc: "Seu plano e forma de pagamento." },
            { icon: BookOpen, label: "Manual do Usuário", desc: "Este guia que você está lendo agora." },
          ].map((i) => (
            <div key={i.label} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 break-inside-avoid">
              <i.icon className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{i.label}</p>
                <p className="text-xs text-slate-500">{i.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Secao>

      {/* 4. Clientes */}
      <Secao id="clientes" icon={Users} title="4. Cadastrando um cliente" subtitle="Antes de cobrar alguém, você precisa cadastrar essa pessoa como cliente">
        <Passo num={1} title="Abra a tela de Clientes">
          <p>No menu à esquerda, clique em <strong>Clientes</strong>.</p>
        </Passo>
        <Passo num={2} title="Clique em Novo Cliente">
          <p>No canto superior direito da tela, clique no botão verde <strong>&ldquo;Novo Cliente&rdquo;</strong>.</p>
        </Passo>
        <Passo num={3} title="Preencha os dados">
          <p>Preencha pelo menos o <strong>nome</strong> e o <strong>telefone</strong> (com DDD) do cliente — esses dois são obrigatórios. Os outros campos (email, CPF, endereço) são opcionais.</p>
          <Exemplo>
            Nome: <strong>Maria da Silva</strong><br />
            Telefone: <strong>(21) 99999-8888</strong>
          </Exemplo>
        </Passo>
        <Passo num={4} title="Clique em Salvar">
          <p>Pronto! O cliente já aparece na sua lista de clientes.</p>
        </Passo>
        <Dica>
          Cadastre o telefone certinho, com DDD — é esse número que vai receber as mensagens automáticas de cobrança pelo
          WhatsApp.
        </Dica>
      </Secao>

      {/* 5. Cobranças */}
      <Secao id="cobrancas" icon={FileText} title="5. Criando uma cobrança" subtitle="Como registrar um valor que um cliente te deve">
        <Passo num={1} title="Abra a tela de Cobranças">
          <p>No menu à esquerda, clique em <strong>Cobranças</strong>.</p>
        </Passo>
        <Passo num={2} title="Clique em Nova Cobrança">
          <p>No canto superior direito, clique no botão verde <strong>&ldquo;Nova Cobrança&rdquo;</strong>.</p>
        </Passo>
        <Passo num={3} title="Escolha o cliente">
          <p>Clique no campo de cliente e selecione, na lista, para quem é essa cobrança (o cliente precisa já estar cadastrado — veja a seção anterior).</p>
        </Passo>
        <Passo num={4} title="Preencha descrição, valor e vencimento">
          <Exemplo>
            Descrição: <strong>Mensalidade de Agosto</strong><br />
            Valor: <strong>R$ 150,00</strong><br />
            Vencimento: <strong>10/08/2026</strong>
          </Exemplo>
        </Passo>
        <Passo num={5} title="Clique em Salvar">
          <p>
            A cobrança é criada com status <strong>&ldquo;Pendente&rdquo;</strong>. A partir daí, o sistema vai lembrar automaticamente
            o cliente pelo WhatsApp (se você tiver configurado — veja a seção 7).
          </p>
        </Passo>
      </Secao>

      {/* 6. Marcar como pago */}
      <Secao id="pagamento" icon={CheckCircle2} title="6. Marcando uma cobrança como paga" subtitle="Quando o cliente pagar, é importante atualizar o sistema">
        <Passo num={1} title="Encontre a cobrança">
          <p>Na tela de <strong>Cobranças</strong>, procure a cobrança que foi paga (você pode usar a busca, se tiver muitas).</p>
        </Passo>
        <Passo num={2} title="Clique na cobrança">
          <p>Clique em cima dela (ou no ícone de olho 👁️) para abrir os detalhes.</p>
        </Passo>
        <Passo num={3} title="Mude o status para Pago">
          <p>Procure o campo de status e mude de <strong>&ldquo;Pendente&rdquo;</strong> para <strong>&ldquo;Pago&rdquo;</strong>. Salve.</p>
        </Passo>
        <Dica>
          Manter as cobranças atualizadas é importante: assim o sistema para de mandar lembretes automáticos para quem já
          pagou, e seus relatórios ficam corretos.
        </Dica>
      </Secao>

      {/* 7. WhatsApp */}
      <Secao id="whatsapp" icon={MessageCircle} title="7. Lembretes automáticos por WhatsApp" subtitle="A parte que economiza seu tempo: o sistema cobra por você">
        <p className="text-sm text-slate-600 leading-relaxed">
          O CobraFácil pode enviar mensagens de WhatsApp automaticamente para seus clientes: <strong>3 dias antes</strong> do
          vencimento, <strong>no dia</strong> do vencimento, e <strong>1 dia depois</strong> se a cobrança ainda estiver em
          atraso. Para isso funcionar, é preciso configurar uma vez.
        </p>
        <Passo num={1} title="Abra a tela de WhatsApp">
          <p>No menu à esquerda, clique em <strong>WhatsApp</strong>.</p>
        </Passo>
        <Passo num={2} title="Siga o guia Como Configurar">
          <p>
            Essa aba tem um passo a passo específico para conectar seu número de WhatsApp ao sistema (usando um serviço
            chamado Z-API ou Evolution API). Siga as instruções com calma — é um processo que você faz só uma vez.
          </p>
        </Passo>
        <Passo num={3} title="Personalize as mensagens">
          <p>
            Na aba <strong>Mensagens</strong>, você pode editar o texto que será enviado, usando palavras especiais entre
            chaves, como <code className="bg-slate-100 px-1 rounded font-mono text-xs">{"{nome}"}</code> e{" "}
            <code className="bg-slate-100 px-1 rounded font-mono text-xs">{"{valor}"}</code>, que o sistema troca
            automaticamente pelas informações de cada cliente e cobrança.
          </p>
        </Passo>
        <Dica>
          Se você não configurar o WhatsApp agora, sem problema — o resto do sistema (cadastro de clientes e cobranças)
          funciona normalmente. Você pode configurar isso depois, quando quiser.
        </Dica>
      </Secao>

      {/* 8. Dashboard */}
      <Secao id="dashboard" icon={LayoutDashboard} title="8. Entendendo o Dashboard" subtitle="A tela inicial: um resumo rápido da sua situação financeira">
        <p className="text-sm text-slate-600 leading-relaxed">Ao entrar no sistema, você cai na tela de Dashboard. Ela mostra, de forma resumida:</p>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li><strong>Pendente</strong>: quanto dinheiro você ainda tem para receber (cobranças não vencidas).</li>
          <li><strong>Pago</strong>: quanto você já recebeu este mês.</li>
          <li><strong>Vencido</strong>: quanto está em atraso — merece atenção especial.</li>
          <li><strong>Cobranças recentes</strong>: as últimas cobranças criadas.</li>
          <li><strong>Vencendo hoje / próximos 7 dias</strong>: um aviso do que está para vencer.</li>
        </ul>
        <Dica>Dê uma olhada no Dashboard todo dia — leva menos de um minuto e te ajuda a nunca perder um pagamento de vista.</Dica>
      </Secao>

      {/* 9. Relatórios */}
      <Secao id="relatorios" icon={BarChart3} title="9. Relatórios" subtitle="Para ver os números de um período específico, como o mês passado">
        <Passo num={1} title="Abra a tela de Relatórios">
          <p>No menu à esquerda, clique em <strong>Relatórios</strong>.</p>
        </Passo>
        <Passo num={2} title="Escolha o período">
          <p>Selecione a data de início e a data de fim que você quer analisar.</p>
        </Passo>
        <Passo num={3} title="Veja ou imprima">
          <p>
            O sistema mostra os totais e a lista de cobranças daquele período. Você pode clicar em{" "}
            <strong>&ldquo;Imprimir&rdquo;</strong> para gerar um PDF, do mesmo jeito que está sendo explicado neste manual (veja a
            próxima dica).
          </p>
        </Passo>
      </Secao>

      {/* 10. Equipe */}
      <Secao id="equipe" icon={UserCog} title="10. Convidando sua equipe" subtitle="Se você tem funcionários que também vão usar o sistema">
        <Passo num={1} title="Abra a tela de Equipe">
          <p>No menu à esquerda, clique em <strong>Equipe</strong>.</p>
        </Passo>
        <Passo num={2} title="Digite o email da pessoa">
          <p>No campo de email, digite o email de quem você quer convidar, e clique em <strong>&ldquo;Convidar&rdquo;</strong>.</p>
        </Passo>
        <Passo num={3} title="A pessoa recebe um email">
          <p>
            Ela vai receber um email com um link. Ao clicar, ela cria uma senha e já entra direto na sua empresa, com acesso
            aos mesmos clientes e cobranças que você.
          </p>
        </Passo>
        <Dica>
          Só quem é &ldquo;Dono&rdquo; da conta pode convidar ou remover pessoas da equipe. Um funcionário convidado não consegue
          convidar outras pessoas.
        </Dica>
      </Secao>

      {/* 11. Assinatura */}
      <Secao id="assinatura" icon={CreditCard} title="11. Sua assinatura" subtitle="Como funciona o plano e o pagamento do CobraFácil">
        <p className="text-sm text-slate-600 leading-relaxed">
          Toda conta nova começa com <strong>14 dias grátis</strong> para testar o sistema, sem precisar cadastrar cartão.
          Depois desse período, é preciso escolher um plano para continuar usando.
        </p>
        <Passo num={1} title="Abra a tela de Assinatura">
          <p>No menu à esquerda, clique em <strong>Assinatura</strong>.</p>
        </Passo>
        <Passo num={2} title="Escolha um plano">
          <p>Compare os planos disponíveis (quantidade de clientes, cobranças por mês, etc.) e clique em <strong>&ldquo;Assinar&rdquo;</strong> no que combina com o seu negócio.</p>
        </Passo>
        <Passo num={3} title="Finalize o pagamento">
          <p>Você será levado a uma página segura para pagar por PIX, boleto ou cartão. Depois de confirmado, sua assinatura fica ativa automaticamente.</p>
        </Passo>
      </Secao>

      {/* 12. Dúvidas */}
      <Secao id="duvidas" icon={HelpCircle} title="12. Perguntas frequentes" subtitle="Dúvidas comuns de quem está começando">
        <Passo num={1} title="Posso usar o CobraFácil no celular?">
          <p>Sim! O sistema funciona no navegador do celular normalmente, sem precisar instalar nada.</p>
        </Passo>
        <Passo num={2} title="Um cliente pagou fora do prazo, o que eu faço?">
          <p>Nada de especial — só marque a cobrança como &ldquo;Pago&rdquo; quando o pagamento cair na sua conta (veja a seção 6).</p>
        </Passo>
        <Passo num={3} title="Cadastrei um cliente errado, dá para apagar?">
          <p>Sim. Na tela do cliente, existe uma opção para desativá-lo — ele deixa de aparecer na sua lista, mas o histórico de cobranças dele é mantido.</p>
        </Passo>
        <Passo num={4} title="O sistema mandou uma mensagem errada, o que aconteceu?">
          <p>Confira se o texto da mensagem (na aba WhatsApp → Mensagens) está correto, e se o telefone do cliente foi cadastrado com o DDD certo.</p>
        </Passo>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 break-inside-avoid">
          <Mail className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-700">Ainda com dúvidas?</p>
            <p className="text-sm text-emerald-600 mt-0.5">
              Fale com quem administra sua conta no CobraFácil, ou entre em contato com o suporte pelo WhatsApp cadastrado
              na sua empresa.
            </p>
          </div>
        </div>
      </Secao>

      <div className="no-print">
        <Link href="/dashboard">
          <Button variant="outline"><LayoutDashboard className="h-4 w-4" />Voltar para o Dashboard</Button>
        </Link>
      </div>

      <div className="print-only hidden text-center text-xs text-slate-400 border-t pt-4">
        Manual do Usuário — CobraFácil — {new Date().toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}
