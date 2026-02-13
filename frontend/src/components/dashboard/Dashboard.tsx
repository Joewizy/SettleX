"use client";

import { ArrowRight, DollarSign, Users } from "lucide-react";
import { StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import { WalletBalance } from "@/components/wallet/WalletBalance";
import { PAYROLL_HISTORY_SEED } from "@/lib/constants";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";
import type { Page } from "@/lib/types";

interface DashboardProps {
  employeeCount: number;
  onNavigate: (page: Page) => void;
  onExpandHistory: (id: string) => void;
}

export function Dashboard({ employeeCount, onNavigate, onExpandHistory }: DashboardProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <WalletBalance />
          <button
            onClick={() => onNavigate("payroll")}
            className="bg-[#059669] hover:bg-[#047857] text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            Run Payroll
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat Cards — only 2 now, balance handled by WalletBalance */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="Last Payroll"
          value={formatCurrencyShort(18100)}
          iconColor="text-[#059669]"
          iconBg="bg-green-50"
        />
        <StatCard
          icon={Users}
          label="Team Size"
          value={`${employeeCount} employees`}
          iconColor="text-[#1a56db]"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Recent Payrolls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Payrolls</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Batch ID</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-left px-6 py-3 font-medium">Employees</th>
              <th className="text-right px-6 py-3 font-medium">Total</th>
              <th className="text-right px-6 py-3 font-medium">Tx Fee</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_HISTORY_SEED.map((p) => (
              <tr
                key={p.id}
                onClick={() => {
                  onNavigate("history");
                  onExpandHistory(p.id);
                }}
                className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <td className="px-6 py-3.5 text-sm font-medium text-[#1a56db]">{p.id}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{p.date}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{p.employees}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(p.total)}
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500 text-right">{p.fee}</td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
