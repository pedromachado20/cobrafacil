import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default function TermosPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full prose-slate">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Termos de Uso</h1>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Ao usar o CobraFácil, você concorda com estes termos. Se não concordar, não utilize o serviço.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">1. O serviço</h2>
          <p>O CobraFácil é uma ferramenta de gestão de cobranças e envio de lembretes via WhatsApp para pequenas e médias empresas. Não somos uma instituição financeira nem processamos pagamentos diretamente entre você e seus clientes.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">2. Sua conta</h2>
          <p>Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas na sua conta e pelos membros da sua equipe.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">3. Assinatura e pagamento</h2>
          <p>Planos pagos são cobrados mensalmente via Asaas. O não pagamento pode resultar em suspensão do acesso a funcionalidades até a regularização.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">4. Cancelamento</h2>
          <p>Você pode cancelar sua assinatura a qualquer momento. O acesso permanece disponível até o fim do período já pago.</p>
          <h2 className="text-lg font-semibold text-slate-800 pt-4">5. Uso indevido</h2>
          <p>É proibido usar o CobraFácil para envio de mensagens não solicitadas, spam, ou qualquer atividade ilegal.</p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
