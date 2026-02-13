"use client";

import {
  LayoutDashboard,
  Users,
  Clock,
  Layers,
  Zap,
  DollarSign,
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import type { Page } from "@/lib/types";

interface SidebarProps {
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
  showUserMenu,
  onToggleUserMenu,
}: SidebarProps) {
  return (
    <aside className="w-[220px] min-h-screen bg-[#1e293b] text-white flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">SettleX</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-200 ${
              currentPage === item.page
                ? "bg-white/10 text-white border-l-2 border-[#059669]"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        <div className="mt-6 px-2">
          <button
            onClick={() => onNavigate("payroll")}
            className="w-full bg-[#059669] hover:bg-[#047857] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Run Payroll
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 pb-4 relative">
        <button
          onClick={onToggleUserMenu}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-200"
        >
          <div className="w-8 h-8 bg-[#059669] rounded-full flex items-center justify-center text-xs font-bold">
            AP
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Alex Park</div>
            <div className="text-xs text-gray-400">alex@company.io</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {showUserMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#334155] rounded-lg shadow-xl border border-white/10 py-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 transition-all duration-200">
              <UserCircle className="w-4 h-4" /> Profile
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 transition-all duration-200">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <hr className="border-white/10 my-1" />
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-all duration-200">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
