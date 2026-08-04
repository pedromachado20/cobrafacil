import Link from "next/link";
import { DollarSign } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <DollarSign className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-700 text-sm">CobraFácil</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link href="/precos" className="hover:text-slate-800">Preços</Link>
          <Link href="/termos" className="hover:text-slate-800">Termos</Link>
          <Link href="/privacidade" className="hover:text-slate-800">Privacidade</Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} CobraFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
