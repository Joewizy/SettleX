"use client";

import { Check, Download, ExternalLink, XCircle } from "lucide-react";
import { Avatar } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { BatchEmployee, SettlementState, SettlementTxData, Page } from "@/lib/types";

const EXPLORER_URL = "https://explore.tempo.xyz";

function truncateHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

interface PayrollSettlementProps {
  batch: BatchEmployee[];
  settlementStatus: Record<number, SettlementState>;
  confirmedCount: number;
  settlementComplete: boolean;
  settlementTxData: SettlementTxData | null;
  settlementError: string | null;
  onNavigate: (page: Page) => void;
  onResetPayroll: () => void;
}

export function PayrollSettlement({
  batch,
  settlementStatus,
  confirmedCount,
  settlementComplete,
  settlementTxData,
  settlementError,
  onNavigate,
  onResetPayroll,
}: PayrollSettlementProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Settlement Progress</h2>
          <span className="text-sm font-medium text-gray-500">
            {confirmedCount}/{batch.length} confirmed
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#059669] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${batch.length > 0 ? (confirmedCount / batch.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Employee list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="divide-y divide-gray-50">
          {batch.map((emp) => {
            const status = settlementStatus[emp.id] || "waiting";
            return (
              <div key={emp.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={emp.avatar} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-400">{emp.wallet}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(emp.amount)}</div>
                    <div className="text-xs text-gray-400">{emp.currency}</div>
                  </div>
                  <div className="w-8 flex items-center justify-center">
                    {status === "waiting" && (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                    )}
                    {status === "processing" && (
                      <div className="w-5 h-5 rounded-full bg-orange-400 animate-pulse-dot" />
                    )}
                    {status === "confirmed" && (
                      <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center animate-scale-in">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {status === "failed" && (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error State */}
      {settlementError && (
        <div className="mt-4 animate-fade-in-up">
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-semibold text-red-900">Settlement Error</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{settlementError}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={onResetPayroll}
                className="flex-1 bg-[#059669] hover:bg-[#047857] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate("dashboard")}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      {settlementComplete && settlementTxData && (
        <div className="mt-4 animate-fade-in-up">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#059669] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Settlement Complete</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction Hash</span>
                <a
                  href={`${EXPLORER_URL}/tx/${settlementTxData.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#1a56db] hover:underline flex items-center gap-1"
                >
                  {truncateHash(settlementTxData.txHash)} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Block Number</span>
                <span className="font-mono text-xs text-gray-600">#{settlementTxData.blockNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Gas Used</span>
                <span className="font-mono text-xs text-gray-600">{settlementTxData.gasUsed} gas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Settlement Time</span>
                <span className="font-semibold text-[#059669]">{settlementTxData.settlementTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Download Receipt
              </button>
              <button
                onClick={onResetPayroll}
                className="flex-1 bg-[#059669] hover:bg-[#047857] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Run Another Payroll
              </button>
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
