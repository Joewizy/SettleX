"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Avatar } from "@/components/ui";
import { TOKEN_LIST } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { Employee, BatchEmployee } from "@/lib/types";

interface AddToBatchModalProps {
  employees: Employee[];
  batchIds: number[];
  onAdd: (emp: BatchEmployee) => void;
  onClose: () => void;
}

export function AddToBatchModal({ employees, batchIds, onAdd, onClose }: AddToBatchModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("pathUSD");

  const available = employees.filter(
    (e) => !batchIds.includes(e.id) && e.status === "active",
  );

  const handleAddOneTime = () => {
    if (!name || !amount) return;
    onAdd({
      id: Date.now(),
      name,
      email: "",
      country: "",
      flag: "",
      currency,
      amount: parseFloat(amount),
      wallet: "",
      avatar: getInitials(name),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-900">Add to Batch</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all duration-150 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {available.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Add Existing Employee</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {available.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    onAdd({
                      id: emp.id, name: emp.name, email: emp.email, country: emp.country,
                      flag: emp.flag, currency: emp.currency, amount: emp.amount, wallet: emp.wallet, avatar: emp.avatar,
                    });
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-150"
                >
                  <Avatar initials={emp.avatar} size="sm" />
                  <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                  <span className="text-xs text-slate-400 ml-auto bg-slate-50 px-2 py-0.5 rounded">{emp.currency}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-5">
          <label className="block text-sm font-medium text-slate-700 mb-3">Or Add One-Time Payment</label>
          <div className="space-y-3">
            <input
              placeholder="Recipient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <div className="flex gap-3">
              <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {TOKEN_LIST.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddOneTime}
              disabled={!name || !amount}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm"
            >
              Add to Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
