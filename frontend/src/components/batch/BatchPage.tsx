"use client";

import { ArrowRight, Layers, Zap, Check, RefreshCw } from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui";
import { BATCH_QUEUE_SEED, EMPLOYEES_SEED } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface BatchPageProps {
  expandedBatch: string | null;
  onToggleExpand: (id: string | null) => void;
}

function FlowVisualization() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">How Batch Settlement Works</h2>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 w-48">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Individual Payments</div>
          <div className="space-y-1.5 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-xs font-medium text-blue-700">
                Payment #{i}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-1">5 payments</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-16 h-0.5 bg-[#059669]" />
            <ArrowRight className="w-5 h-5 text-[#059669] animate-flow-pulse" />
          </div>
          <div className="text-xs text-[#059669] font-medium">Batched</div>
        </div>

        <div className="flex flex-col items-center gap-2 w-52">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Batch Transaction</div>
          <div className="w-full bg-[#059669]/10 border-2 border-[#059669] border-dashed rounded-xl p-4 flex flex-col items-center">
            <Layers className="w-8 h-8 text-[#059669] mb-2" />
            <div className="text-lg font-bold text-[#059669]">1 Transaction</div>
            <div className="text-xs text-gray-500 mt-1">All payments combined</div>
          </div>
          <div className="text-xs text-gray-400 mt-1">1 atomic operation</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-16 h-0.5 bg-[#059669]" />
            <ArrowRight className="w-5 h-5 text-[#059669] animate-flow-pulse" style={{ animationDelay: "500ms" }} />
          </div>
          <div className="text-xs text-[#059669] font-medium">Settled</div>
        </div>

        <div className="flex flex-col items-center gap-2 w-48">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Tempo Network</div>
          <div className="w-full bg-[#0d9488]/10 border-2 border-[#0d9488] rounded-xl p-4 flex flex-col items-center">
            <Zap className="w-8 h-8 text-[#0d9488] mb-2" />
            <div className="text-lg font-bold text-[#0d9488]">1 Fee</div>
            <div className="text-xs text-gray-500 mt-1">$0.001 total</div>
          </div>
          <div className="text-xs text-gray-400 mt-1">&lt;1 second settlement</div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
        <span className="text-2xl font-bold text-gray-900">5 payments</span>
        <span className="text-gray-400 mx-3">&rarr;</span>
        <span className="text-2xl font-bold text-[#059669]">1 transaction</span>
        <span className="text-gray-400 mx-3">&rarr;</span>
        <span className="text-2xl font-bold text-[#0d9488]">1 fee</span>
      </div>
    </div>
  );
}

export function BatchPage({ expandedBatch, onToggleExpand }: BatchPageProps) {
  const totalTraditionalCost = BATCH_QUEUE_SEED.reduce((s, b) => s + b.traditionalCost, 0);
  const totalTempoCost = BATCH_QUEUE_SEED.reduce((s, b) => s + b.tempoCost, 0);
  const totalSaved = totalTraditionalCost - totalTempoCost;
  const totalPayments = BATCH_QUEUE_SEED.reduce((s, b) => s + b.payments, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Batch Processing</h1>

      <FlowVisualization />

      {/* Savings */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Traditional Wire Cost</div>
          <div className="text-3xl font-bold text-red-600">{formatCurrency(totalTraditionalCost)}</div>
          <div className="text-xs text-gray-400 mt-1">~$42 per wire &times; {totalPayments} payments</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">SettleX Cost</div>
          <div className="text-3xl font-bold text-[#059669]">{formatCurrency(totalTempoCost)}</div>
          <div className="text-xs text-gray-400 mt-1">$0.001 per batch &times; {BATCH_QUEUE_SEED.length} batches</div>
        </div>
        <div className="bg-[#059669]/5 rounded-xl border-2 border-[#059669] shadow-sm p-5">
          <div className="text-xs text-[#059669] uppercase tracking-wider font-bold mb-2">Total Saved</div>
          <div className="text-3xl font-bold text-[#059669]">{formatCurrency(totalSaved)}</div>
          <div className="text-xs text-[#059669]/70 mt-1">99.99% reduction in fees</div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Avg Batch Size</div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(totalPayments / BATCH_QUEUE_SEED.length)} payments</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Processed</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(BATCH_QUEUE_SEED.reduce((s, b) => s + b.total, 0))}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Batches Completed</div>
          <div className="text-2xl font-bold text-gray-900">{BATCH_QUEUE_SEED.length}</div>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Batch History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Batch ID</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Payments</th>
              <th className="text-right px-6 py-3 font-medium">Total</th>
              <th className="text-left px-6 py-3 font-medium">Created</th>
              <th className="text-left px-6 py-3 font-medium">Tx Hash</th>
              <th className="text-right px-6 py-3 font-medium">Savings</th>
            </tr>
          </thead>
          <tbody>
            {BATCH_QUEUE_SEED.map((batch) => (
              <tr
                key={batch.id}
                onClick={() => onToggleExpand(expandedBatch === batch.id ? null : batch.id)}
                className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <td className="px-6 py-3.5 text-sm font-medium text-[#0d9488]">{batch.id}</td>
                <td className="px-6 py-3.5"><StatusBadge status={batch.status} /></td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{batch.payments}</td>
                <td className="px-6 py-3.5 text-sm font-medium text-gray-900 text-right">{formatCurrency(batch.total)}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{batch.created}</td>
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-[#1a56db] hover:underline">{batch.txHash}</span>
                </td>
                <td className="px-6 py-3.5 text-sm font-bold text-[#059669] text-right">
                  {formatCurrency(batch.traditionalCost - batch.tempoCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded detail */}
      {expandedBatch && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Batch {expandedBatch} — Payment Breakdown
          </h3>
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            {["Queued", "Constructing", "Broadcasting", "Confirming", "Settled"].map((label, i) => {
              const colors = ["bg-gray-300", "bg-blue-400", "bg-orange-400", "bg-blue-500", "bg-[#059669]"];
              return (
                <div key={label} className="flex items-center gap-1">
                  {i > 0 && <ArrowRight className="w-3 h-3 mr-1" />}
                  <div className={`w-2 h-2 rounded-full ${colors[i]}`} />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          <div className="grid gap-2">
            {EMPLOYEES_SEED.slice(0, BATCH_QUEUE_SEED.find((b) => b.id === expandedBatch)?.payments || 0).map((emp) => (
              <div key={emp.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Avatar initials={emp.avatar} size="sm" />
                  <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{formatCurrency(emp.amount)}</span>
                  <span className="text-xs text-gray-400">{emp.currency}</span>
                  <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Check className="w-4 h-4 text-[#059669]" />
              All payments settled successfully
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-400 cursor-not-allowed" disabled>
              <RefreshCw className="w-4 h-4" /> Retry Failed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
