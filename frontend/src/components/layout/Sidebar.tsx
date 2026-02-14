"use client";

import {
  LayoutDashboard,
  Users,
  Clock,
  Layers,
  Zap,
  Upload,
  Download,
} from "lucide-react";
import { WalletBalance } from "@/components/wallet/WalletBalance";
import type { Page } from "@/lib/types";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  showUserMenu: boolean;
  onToggleUserMenu: () => void;
}

const NAV_ITEMS: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: Users, label: "Team", page: "team" },
  { icon: Clock, label: "History", page: "history" },
  { icon: Layers, label: "Batch Processing", page: "batch" },
];

export function Sidebar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">SettleX</span>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === item.page
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => onNavigate("team")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <WalletBalance />
          <button
            onClick={() => onNavigate("payroll")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 text-sm shadow-sm"
          >
            Start Paying Globally
          </button>
        </div>
      </div>
    </header>
  );
}
