"use client";

import { X } from "lucide-react";
import { COUNTRIES, TOKEN_LIST } from "@/lib/constants";
import type { NewEmployeeForm } from "@/lib/types";

interface AddEmployeeModalProps {
  form: NewEmployeeForm;
  onChange: (form: NewEmployeeForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function AddEmployeeModal({ form, onChange, onSave, onClose }: AddEmployeeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-900">Add Employee</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all duration-150 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              placeholder="e.g. john@team.io"
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
            <select
              value={form.country}
              onChange={(e) => onChange({ ...form, country: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Wallet Address <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              placeholder="Leave blank to auto-create via Privy"
              value={form.wallet}
              onChange={(e) => onChange({ ...form, wallet: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Currency</label>
            <select
              value={form.currency}
              onChange={(e) => onChange({ ...form, currency: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {TOKEN_LIST.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-all duration-150 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!form.name || !form.email || !form.country}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 text-sm shadow-sm"
            >
              Save Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
