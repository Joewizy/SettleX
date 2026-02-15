"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Layers,
  Zap,
  Upload,
  Download,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">SettleX</span>
        </div>

        {/* Center Nav — desktop */}
        <nav className="hidden md:flex items-center gap-1">
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
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Actions — desktop */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => onNavigate("team")}
            className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <WalletBalance />
          <button
            onClick={() => onNavigate("payroll")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 lg:px-5 py-2.5 rounded-lg transition-all duration-150 text-sm shadow-sm"
          >
            <span className="hidden lg:inline">Start Paying Globally</span>
            <span className="lg:hidden">Pay</span>
          </button>
        </div>

        {/* Mobile: wallet + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <WalletBalance />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-150"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentPage === item.page
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <hr className="border-slate-100 my-2" />
            <button
              onClick={() => handleNavigate("payroll")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-150 text-sm shadow-sm"
            >
              Start Paying Globally
            </button>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200">
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => handleNavigate("team")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200"
              >
                <Upload className="w-4 h-4" /> Upload CSV
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
