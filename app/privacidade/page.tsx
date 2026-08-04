import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default function PrivacidadePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full prose-slate">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Política de Privacidade</h1>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Esta política explica como o CobraFácil coleta, usa e protege seus dados e os dados dos seus clientes.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">1. Dados que coletamos</h2>
          <p>Coletamos os dados que você fornece ao criar sua conta (nome, email, telefone) e os dados que você cadastra sobre seus clientes e cobranças, necessários para o funcionamento do serviço.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">2. Como usamos seus dados</h2>
          <p>Usamos os dados para operar o serviço: enviar lembretes de cobrança via WhatsApp, gerar relatórios, e processar pagamentos de assinatura via Asaas.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">3. Compartilhamento</h2>
          <p>Não vendemos seus dados. Compartilhamos informações apenas com parceiros necessários à operação (Z-API/Evolution API para envio de WhatsApp, Asaas para cobrança de assinatura, Resend para envio de emails).</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">4. Seus direitos</h2>
          <p>Você pode solicitar a exportação ou exclusão dos seus dados a qualquer momento, em conformidade com a LGPD.</p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
