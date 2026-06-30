import { Sidebar } from "@/components/sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
