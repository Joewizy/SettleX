"use client";

import { Plus, ArrowRight, X, Search, Save, FolderOpen, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui";
import { AddToBatchModal } from "./AddToBatchModal";
import { TOKEN_LIST } from "@/lib/constants";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";
import type { BatchEmployee, Employee, PayrollTemplate } from "@/lib/types";

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
  templates: PayrollTemplate[];
  onSaveTemplate: (name: string, employees: BatchEmployee[]) => void;
  onLoadTemplate: (employees: BatchEmployee[]) => void;
  onDeleteTemplate: (id: string) => void;
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
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
}: PayrollReviewProps) {
  const [search, setSearch] = useState("");
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);

  const filteredBatch = batch.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Payroll Batch</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Load Template */}
            <div className="relative">
              <button
                onClick={() => setShowLoadTemplate(!showLoadTemplate)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-all duration-150 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg"
              >
                <FolderOpen className="w-4 h-4" />
                Templates
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showLoadTemplate && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl border border-slate-200 shadow-lg z-20">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saved Templates</p>
                  </div>
                  {templates.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-slate-400">No saved templates</p>
                      <p className="text-xs text-slate-300 mt-1">Save your current batch as a template to reuse later</p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {templates.map((t) => (
                        <div key={t.id} className="px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0">
                          <button
                            onClick={() => { onLoadTemplate(t.employees); setShowLoadTemplate(false); }}
                            className="text-left flex-1 min-w-0"
                          >
                            <p className="text-sm font-medium text-slate-900 truncate">{t.name}</p>
                            <p className="text-xs text-slate-400">{t.employees.length} employees &middot; {t.createdAt}</p>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTemplate(t.id); }}
                            className="text-slate-300 hover:text-red-500 ml-2 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Save as Template */}
            <button
              onClick={() => { setShowSaveTemplate(true); setTemplateName(""); }}
              disabled={batch.length === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:text-slate-300 transition-all duration-150 bg-slate-50 hover:bg-slate-100 disabled:hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-all duration-150 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Save Template Inline */}
        {showSaveTemplate && (
          <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-emerald-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              autoFocus
              placeholder="Template name (e.g. Monthly Payroll)"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && templateName.trim()) {
                  onSaveTemplate(templateName.trim(), batch);
                  setShowSaveTemplate(false);
                }
              }}
              className="flex-1 sm:max-w-sm text-sm border border-emerald-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            />
            <button
              onClick={() => {
                if (templateName.trim()) {
                  onSaveTemplate(templateName.trim(), batch);
                  setShowSaveTemplate(false);
                }
              }}
              disabled={!templateName.trim()}
              className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2 rounded-lg transition-colors"
            >
              Save Template
            </button>
            <button
              onClick={() => setShowSaveTemplate(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        {batch.length > 3 && (
          <div className="px-4 sm:px-6 py-3 border-b border-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search batch employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:max-w-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 sm:px-6 py-3 font-medium">Employee</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium hidden sm:table-cell">Country</th>
                <th className="text-right px-4 sm:px-6 py-3 font-medium">Amount</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium pl-4 sm:pl-8">Currency</th>
                <th className="text-right px-4 sm:px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatch.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-50 table-row-hover group">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={emp.avatar} />
                      <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-sm text-slate-600 hidden sm:table-cell">
                    {emp.flag && <span className="mr-1.5">{emp.flag}</span>}
                    {emp.country}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right">
                    {editingAmount === emp.id ? (
                      <input
                        type="number"
                        autoFocus
                        value={emp.amount}
                        onChange={(e) => onUpdateAmount(emp.id, parseFloat(e.target.value) || 0)}
                        onBlur={() => onSetEditingAmount(null)}
                        onKeyDown={(e) => { if (e.key === "Enter") onSetEditingAmount(null); }}
                        className="w-24 sm:w-28 text-right text-sm font-medium border border-emerald-500 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ) : (
                      <button
                        onClick={() => onSetEditingAmount(emp.id)}
                        className="text-sm font-semibold text-slate-900 hover:text-emerald-600 cursor-pointer transition-all duration-150 border-b border-dashed border-slate-300 hover:border-emerald-500"
                      >
                        {formatCurrency(emp.amount)}
                      </button>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 pl-4 sm:pl-8">
                    <select
                      value={emp.currency}
                      onChange={(e) => onUpdateCurrency(emp.id, e.target.value)}
                      className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                      {TOKEN_LIST.map((t) => (
                        <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right">
                    <button
                      onClick={() => onRemove(emp.id)}
                      className="text-slate-300 hover:text-red-500 transition-all duration-150 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Summary */}
      <div className="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{formatCurrency(batchTotal)}</div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Employees</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{batch.length}</div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">By Currency</div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {Object.entries(currencyBreakdown).map(([cur, amt]) => (
                <span key={cur} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {formatCurrencyShort(amt)} {cur}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onContinue}
          disabled={batch.length === 0}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
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
