import Link from "next/link";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">CobraFácil</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/#recursos" className="hover:text-slate-900">Recursos</Link>
          <Link href="/precos" className="hover:text-slate-900">Preços</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Entrar</Link>
          <Link href="/registro">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
