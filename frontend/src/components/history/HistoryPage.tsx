"use client";

import { Download, Filter } from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui";
import { PAYROLL_HISTORY_SEED, EMPLOYEES_SEED } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { HistoryFilter, PayrollRecord } from "@/lib/types";

interface HistoryPageProps {
  filter: HistoryFilter;
  expandedId: string | null;
  onSetFilter: (f: HistoryFilter) => void;
  onToggleExpand: (id: string | null) => void;
}

function HistoryRow({
  payroll,
  isExpanded,
  onToggle,
}: {
  payroll: PayrollRecord;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-all duration-200"
      >
        <td className="px-6 py-3.5 text-sm font-medium text-[#0d9488]">{payroll.id}</td>
        <td className="px-6 py-3.5 text-sm text-gray-600">{payroll.date}</td>
        <td className="px-6 py-3.5 text-sm text-gray-600">{payroll.employees}</td>
        <td className="px-6 py-3.5 text-sm font-medium text-gray-900 text-right">{formatCurrency(payroll.total)}</td>
        <td className="px-6 py-3.5 text-sm text-gray-500 text-right">{payroll.fee}</td>
        <td className="px-6 py-3.5">
          <span className="font-mono text-xs text-[#1a56db] hover:underline cursor-pointer">{payroll.txHash}</span>
        </td>
        <td className="px-6 py-3.5"><StatusBadge status={payroll.status} /></td>
        <td className="px-6 py-3.5 text-right">
          <button className="text-gray-400 hover:text-gray-600 transition-all duration-200" title="Download CSV">
            <Download className="w-4 h-4" />
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-gray-50 px-6 py-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Employee Breakdown</div>
            <div className="grid gap-2">
              {EMPLOYEES_SEED.slice(0, payroll.employees).map((emp) => (
                <div key={emp.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar initials={emp.avatar} size="sm" />
                    <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatCurrency(emp.amount)}</span>
                    <span className="text-xs text-gray-400">{emp.currency}</span>
                    <StatusBadge status="completed" />
                    <span className="text-xs text-gray-400">{payroll.settlementTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function HistoryPage({ filter, expandedId, onSetFilter, onToggleExpand }: HistoryPageProps) {
  const filtered = PAYROLL_HISTORY_SEED.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll History</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(["all", "completed", "failed"] as HistoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => onSetFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                filter === f ? "bg-[#0d9488] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Batch ID</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-left px-6 py-3 font-medium">Employees</th>
              <th className="text-right px-6 py-3 font-medium">Total</th>
              <th className="text-right px-6 py-3 font-medium">Tx Fee</th>
              <th className="text-left px-6 py-3 font-medium">Tx Hash</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <HistoryRow
                key={p.id}
                payroll={p}
                isExpanded={expandedId === p.id}
                onToggle={() => onToggleExpand(expandedId === p.id ? null : p.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
