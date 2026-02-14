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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <h2 className="text-base font-semibold text-slate-900 mb-6">How Batch Settlement Works</h2>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 w-48">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Individual Payments</div>
          <div className="space-y-1.5 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-xs font-medium text-blue-700">
                Payment #{i}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400 mt-1">5 payments</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-16 h-0.5 bg-emerald-500" />
            <ArrowRight className="w-5 h-5 text-emerald-500 animate-flow-pulse" />
          </div>
          <div className="text-xs text-emerald-600 font-medium">Batched</div>
        </div>

        <div className="flex flex-col items-center gap-2 w-52">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Batch Transaction</div>
          <div className="w-full bg-emerald-50 border-2 border-emerald-500 border-dashed rounded-xl p-4 flex flex-col items-center">
            <Layers className="w-8 h-8 text-emerald-600 mb-2" />
            <div className="text-lg font-bold text-emerald-700">1 Transaction</div>
            <div className="text-xs text-slate-500 mt-1">All payments combined</div>
          </div>
          <div className="text-xs text-slate-400 mt-1">1 atomic operation</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-16 h-0.5 bg-emerald-500" />
            <ArrowRight className="w-5 h-5 text-emerald-500 animate-flow-pulse" style={{ animationDelay: "500ms" }} />
          </div>
          <div className="text-xs text-emerald-600 font-medium">Settled</div>
        </div>

        <div className="flex flex-col items-center gap-2 w-48">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Tempo Network</div>
          <div className="w-full bg-teal-50 border-2 border-teal-500 rounded-xl p-4 flex flex-col items-center">
            <Zap className="w-8 h-8 text-teal-600 mb-2" />
            <div className="text-lg font-bold text-teal-700">1 Fee</div>
            <div className="text-xs text-slate-500 mt-1">$0.001 total</div>
          </div>
          <div className="text-xs text-slate-400 mt-1">&lt;1 second settlement</div>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 rounded-xl p-4 text-center">
        <span className="text-2xl font-bold text-slate-900">5 payments</span>
        <span className="text-slate-400 mx-3">&rarr;</span>
        <span className="text-2xl font-bold text-emerald-600">1 transaction</span>
        <span className="text-slate-400 mx-3">&rarr;</span>
        <span className="text-2xl font-bold text-teal-600">1 fee</span>
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
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Batch Processing</h1>
        <p className="text-sm text-slate-500 mt-1">Visualize batch settlement flow and cost savings</p>
      </div>

      <FlowVisualization />

      {/* Savings */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Traditional Wire Cost</div>
          <div className="text-3xl font-bold text-red-600">{formatCurrency(totalTraditionalCost)}</div>
          <div className="text-xs text-slate-400 mt-1">~$42 per wire &times; {totalPayments} payments</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">SettleX Cost</div>
          <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalTempoCost)}</div>
          <div className="text-xs text-slate-400 mt-1">$0.001 per batch &times; {BATCH_QUEUE_SEED.length} batches</div>
        </div>
        <div className="bg-emerald-50 rounded-xl border-2 border-emerald-300 shadow-sm p-5">
          <div className="text-xs text-emerald-700 uppercase tracking-wider font-bold mb-2">Total Saved</div>
          <div className="text-3xl font-bold text-emerald-700">{formatCurrency(totalSaved)}</div>
          <div className="text-xs text-emerald-600 mt-1">99.99% reduction in fees</div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Avg Batch Size</div>
          <div className="text-2xl font-bold text-slate-900">{Math.round(totalPayments / BATCH_QUEUE_SEED.length)} payments</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Total Processed</div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(BATCH_QUEUE_SEED.reduce((s, b) => s + b.total, 0))}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Batches Completed</div>
          <div className="text-2xl font-bold text-slate-900">{BATCH_QUEUE_SEED.length}</div>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Batch History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider">
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
                className="border-t border-slate-50 table-row-hover cursor-pointer"
              >
                <td className="px-6 py-3.5 text-sm font-medium text-emerald-600">{batch.id}</td>
                <td className="px-6 py-3.5"><StatusBadge status={batch.status} /></td>
                <td className="px-6 py-3.5 text-sm text-slate-600">{batch.payments}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-slate-900 text-right">{formatCurrency(batch.total)}</td>
                <td className="px-6 py-3.5 text-sm text-slate-600">{batch.created}</td>
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-blue-600 hover:underline">{batch.txHash}</span>
                </td>
                <td className="px-6 py-3.5 text-sm font-bold text-emerald-600 text-right">
                  {formatCurrency(batch.traditionalCost - batch.tempoCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded detail */}
      {expandedBatch && (
        <div className="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in-up">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Batch {expandedBatch} — Payment Breakdown
          </h3>
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            {["Queued", "Constructing", "Broadcasting", "Confirming", "Settled"].map((label, i) => {
              const colors = ["bg-slate-300", "bg-blue-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"];
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
              <div key={emp.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={emp.avatar} size="sm" />
                  <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(emp.amount)}</span>
                  <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded">{emp.currency}</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Check className="w-4 h-4 text-emerald-500" />
              All payments settled successfully
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-400 cursor-not-allowed" disabled>
              <RefreshCw className="w-4 h-4" /> Retry Failed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
