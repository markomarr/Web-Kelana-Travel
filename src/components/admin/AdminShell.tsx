"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

interface AdminShellProps {
  userName: string;
  children: React.ReactNode;
}

export function AdminShell({ userName, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F1F5F9]">
        <Sidebar userName={userName} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>
            <span className="font-display text-base font-extrabold text-primary">
              Kelana Travel Admin
            </span>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
