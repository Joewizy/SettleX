"use client";

import { Plus, ArrowRight, X } from "lucide-react";
import { Avatar } from "@/components/ui";
import { AddToBatchModal } from "./AddToBatchModal";
import { TOKEN_LIST } from "@/lib/constants";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";
import type { BatchEmployee, Employee } from "@/lib/types";

interface PayrollReviewProps {
  batch: BatchEmployee[];
  batchTotal: number;
  currencyBreakdown: Record<string, number>;
  editingAmount: number | null;
  showAddModal: boolean;
  employees: Employee[];
  onSetEditingAmount: (id: number | null) => void;
  onUpdateAmount: (id: number, amount: number) => void;
  onUpdateCurrency: (id: number, currency: string) => void;
  onRemove: (id: number) => void;
  onAdd: (emp: BatchEmployee) => void;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onContinue: () => void;
}

export function PayrollReview({
  batch,
  batchTotal,
  currencyBreakdown,
  editingAmount,
  showAddModal,
  employees,
  onSetEditingAmount,
  onUpdateAmount,
  onUpdateCurrency,
  onRemove,
  onAdd,
  onOpenAddModal,
  onCloseAddModal,
  onContinue,
}: PayrollReviewProps) {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Payroll Batch</h2>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 text-sm font-medium text-[#059669] hover:text-[#047857] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Employee</th>
              <th className="text-left px-6 py-3 font-medium">Country</th>
              <th className="text-right px-6 py-3 font-medium">Amount</th>
              <th className="text-left px-6 py-3 font-medium pl-8">Currency</th>
              <th className="text-right px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {batch.map((emp) => (
              <tr key={emp.id} className="border-t border-gray-50 hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={emp.avatar} />
                    <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-600">
                  {emp.flag && <span className="mr-1.5">{emp.flag}</span>}
                  {emp.country}
                </td>
                <td className="px-6 py-3.5 text-right">
                  {editingAmount === emp.id ? (
                    <input
                      type="number"
                      autoFocus
                      value={emp.amount}
                      onChange={(e) => onUpdateAmount(emp.id, parseFloat(e.target.value) || 0)}
                      onBlur={() => onSetEditingAmount(null)}
                      onKeyDown={(e) => { if (e.key === "Enter") onSetEditingAmount(null); }}
                      className="w-28 text-right text-sm font-medium border border-[#059669] rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-[#059669]/20"
                    />
                  ) : (
                    <button
                      onClick={() => onSetEditingAmount(emp.id)}
                      className="text-sm font-medium text-gray-900 hover:text-[#059669] cursor-pointer transition-all duration-200 border-b border-dashed border-gray-300 hover:border-[#059669]"
                    >
                      {formatCurrency(emp.amount)}
                    </button>
                  )}
                </td>
                <td className="px-6 py-3.5 pl-8">
                  <select
                    value={emp.currency}
                    onChange={(e) => onUpdateCurrency(emp.id, e.target.value)}
                    className="text-sm bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-[#059669]/20 cursor-pointer"
                  >
                    {TOKEN_LIST.map((t) => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => onRemove(emp.id)} className="text-gray-400 hover:text-red-500 transition-all duration-200">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Batch Summary */}
      <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Total</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(batchTotal)}</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Employees</div>
            <div className="text-xl font-bold text-gray-900">{batch.length}</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">By Currency</div>
            <div className="flex items-center gap-2 mt-0.5">
              {Object.entries(currencyBreakdown).map(([cur, amt]) => (
                <span key={cur} className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
                  {formatCurrencyShort(amt)} {cur}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onContinue}
          disabled={batch.length === 0}
          className="bg-[#059669] hover:bg-[#047857] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showAddModal && (
        <AddToBatchModal
          employees={employees}
          batchIds={batch.map((e) => e.id)}
          onAdd={onAdd}
          onClose={onCloseAddModal}
        />
      )}
    </div>
  );
}
