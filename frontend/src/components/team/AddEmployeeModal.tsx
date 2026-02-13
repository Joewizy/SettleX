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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Add Employee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              placeholder="e.g. john@team.io"
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={form.country}
              onChange={(e) => onChange({ ...form, country: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              placeholder="Leave blank to auto-create via Privy"
              value={form.wallet}
              onChange={(e) => onChange({ ...form, wallet: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Currency</label>
            <select
              value={form.currency}
              onChange={(e) => onChange({ ...form, currency: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
            >
              {TOKEN_LIST.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-all duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!form.name || !form.email || !form.country}
              className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm"
            >
              Save Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
