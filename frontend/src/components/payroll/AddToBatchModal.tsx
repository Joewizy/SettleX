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
      flag: "🌍",
      currency,
      amount: parseFloat(amount),
      wallet: "",
      avatar: getInitials(name),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[480px] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Add to Batch</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {available.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Existing Employee</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#059669] hover:bg-green-50/50 transition-all duration-200"
                >
                  <Avatar initials={emp.avatar} size="sm" />
                  <span className="text-sm font-medium">{emp.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{emp.currency}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">Or Add One-Time Payment</label>
          <div className="space-y-3">
            <input
              placeholder="Recipient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
            />
            <div className="flex gap-3">
              <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                {TOKEN_LIST.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddOneTime}
              disabled={!name || !amount}
              className="w-full bg-[#059669] hover:bg-[#047857] disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
            >
              Add to Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
