import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CobraFácil — Gestão de Cobranças com WhatsApp",
  description: "Sistema de cobranças com lembretes automáticos via WhatsApp para pequenos negócios.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
