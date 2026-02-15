"use client";

import {
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Eye,
  CalendarClock,
  Upload,
  FileDown,
  ExternalLink,
  Hash,
  Coins,
  Users,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/ui";
import { Avatar } from "@/components/ui";
import { EMPLOYEES_SEED } from "@/lib/constants";
import { formatCurrency, truncateAddress } from "@/lib/utils";
import type { Page, PayrollRecord } from "@/lib/types";
import type { EmployerStatsData } from "@/hooks/useSettleX";

interface DashboardProps {
  employeeCount: number;
  onNavigate: (page: Page) => void;
  onExpandHistory: (id: string) => void;
  employerStats: EmployerStatsData | null;
  isConnected: boolean;
  payrollHistory: PayrollRecord[];
}

export function Dashboard({ employeeCount, onNavigate, onExpandHistory, employerStats, isConnected, payrollHistory }: DashboardProps) {
  const [employeeSearch, setEmployeeSearch] = useState("");

  const monthlyCost = EMPLOYEES_SEED.reduce((sum, e) => sum + e.amount, 0);

  const filteredEmployees = EMPLOYEES_SEED.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.country.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage global payroll with SettleX</p>
      </div>

      {/* Stat Cards — on-chain data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Paid"
          value={
            employerStats
              ? `$${parseFloat(employerStats.totalPaidFormatted).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "$0.00"
          }
          subtitle={
            employerStats && employerStats.tokenBreakdown.length > 0
              ? employerStats.tokenBreakdown.map((t) => `${parseFloat(t.formatted).toLocaleString()} ${t.symbol}`).join(", ")
              : "On-chain total"
          }
          subtitleColor={employerStats && employerStats.tokenBreakdown.length > 0 ? "text-slate-500" : "text-slate-400"}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          icon={Hash}
          label="Payments Made"
          value={employerStats ? String(employerStats.paymentCount) : "0"}
          subtitle={
            employerStats && employerStats.totalGlobalPayments > 0
              ? `${employerStats.totalGlobalPayments} total on contract`
              : "On-chain count"
          }
          subtitleColor="text-slate-500"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          icon={Users}
          label="Team Size"
          value={String(employeeCount)}
          subtitle="Active employees"
          subtitleColor="text-slate-500"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          icon={Coins}
          label="Tokens Used"
          value={
            employerStats && employerStats.tokenBreakdown.length > 0
              ? String(employerStats.tokenBreakdown.length)
              : "0"
          }
          subtitle={
            employerStats && employerStats.tokenBreakdown.length > 0
              ? employerStats.tokenBreakdown.map((t) => t.symbol).join(", ")
              : "No tokens yet"
          }
          subtitleColor="text-slate-500"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Main Content: Payroll Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: Upcoming Payroll */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                Upcoming Payroll
              </h2>
            </div>
            <StatusBadge status="pending" />
          </div>

          {/* Search & Filter */}
          <div className="px-6 py-3 border-b border-slate-50 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search employees..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 sm:px-6 py-3 font-medium">Employee</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-medium hidden sm:table-cell">Wallet</th>
                  <th className="text-right px-4 sm:px-6 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 sm:px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t border-slate-50 table-row-hover transition-all duration-150"
                  >
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={emp.avatar} />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <span>{emp.flag}</span> {emp.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 hidden sm:table-cell">
                      <span className="font-mono text-xs text-slate-500">
                        {truncateAddress(emp.wallet)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(emp.amount)}
                      </div>
                      <div className="text-xs text-slate-400">{emp.currency}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-center">
                      <button className="text-slate-400 hover:text-slate-600 transition-all duration-150">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="px-6 py-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(monthlyCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Network Fee:</span>
              <span className="font-medium text-emerald-600">$0.001</span>
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between">
              <span className="text-base font-bold text-slate-900">Total:</span>
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(monthlyCost + 0.001)}
              </span>
            </div>
          </div>

          {/* Execute Button */}
          <div className="px-6 pb-6">
            <button
              onClick={() => onNavigate("payroll")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-base shadow-sm flex items-center justify-center gap-2"
            >
              Execute Batch Payment ({employeeCount})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Batches */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Recent Payments</h3>
            </div>
            {payrollHistory.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No payments yet</p>
                <p className="text-xs text-slate-300 mt-1">Completed payments will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {payrollHistory.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate("history");
                      onExpandHistory(p.id);
                    }}
                    className="w-full px-5 py-4 hover:bg-slate-50 transition-all duration-150 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">
                            {p.employees} employee{p.employees !== 1 ? "s" : ""}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(p.total)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs text-slate-400">{p.date}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono text-xs text-slate-400 truncate max-w-[140px]">
                            {p.txHash}
                          </span>
                          <a
                            href={`https://explore.tempo.xyz/tx/${p.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-1">
              <button
                onClick={() => onNavigate("payroll")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-150 text-left group"
              >
                <CalendarClock className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Schedule Payment
                </span>
              </button>
              <button
                onClick={() => onNavigate("team")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-150 text-left group"
              >
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Bulk Upload
                </span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-150 text-left group">
                <FileDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Export Report
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
