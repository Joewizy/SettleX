"use client";

import { Download, Filter, Calendar } from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui";
import { EMPLOYEES_SEED } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { HistoryFilter, PayrollRecord } from "@/lib/types";

const EXPLORER_URL = "https://explore.tempo.xyz";

interface HistoryPageProps {
  filter: HistoryFilter;
  expandedId: string | null;
  onSetFilter: (f: HistoryFilter) => void;
  onToggleExpand: (id: string | null) => void;
  payrollHistory: PayrollRecord[];
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
  const txHashDisplay = payroll.txHash.length > 16
    ? `${payroll.txHash.slice(0, 10)}...${payroll.txHash.slice(-6)}`
    : payroll.txHash;

  return (
    <>
      <tr
        onClick={onToggle}
        className="border-t border-slate-50 table-row-hover cursor-pointer"
      >
        <td className="px-6 py-3.5 text-sm font-medium text-emerald-600">{payroll.id}</td>
        <td className="px-6 py-3.5 text-sm text-slate-600">{payroll.date}</td>
        <td className="px-6 py-3.5 text-sm text-slate-600">{payroll.employees}</td>
        <td className="px-6 py-3.5 text-sm font-semibold text-slate-900 text-right">{formatCurrency(payroll.total)}</td>
        <td className="px-6 py-3.5 text-sm text-slate-500 text-right">{payroll.fee}</td>
        <td className="px-6 py-3.5">
          <a
            href={`${EXPLORER_URL}/tx/${payroll.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {txHashDisplay}
          </a>
        </td>
        <td className="px-6 py-3.5"><StatusBadge status={payroll.status} /></td>
        <td className="px-6 py-3.5 text-right">
          <button className="text-slate-400 hover:text-slate-600 transition-all duration-150" title="Download CSV">
            <Download className="w-4 h-4" />
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-slate-50/50 px-6 py-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Employee Breakdown</div>
            <div className="grid gap-2">
              {EMPLOYEES_SEED.slice(0, payroll.employees).map((emp) => (
                <div key={emp.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar initials={emp.avatar} size="sm" />
                    <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(emp.amount)}</span>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{emp.currency}</span>
                    <StatusBadge status="completed" />
                    <span className="text-xs text-slate-400">{payroll.settlementTime}</span>
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

export function HistoryPage({ filter, expandedId, onSetFilter, onToggleExpand, payrollHistory }: HistoryPageProps) {
  const filtered = payrollHistory.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll History</h1>
          <p className="text-sm text-slate-500 mt-1">View past payroll batches and transaction details</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {(["all", "completed", "failed"] as HistoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => onSetFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 capitalize ${
                filter === f ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {payrollHistory.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">No payroll history yet</p>
            <p className="text-xs text-slate-400 mt-1">Completed payments will appear here with real transaction data</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider">
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
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-400">No payroll records match this filter</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
