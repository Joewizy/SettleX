"use client";

import { ArrowLeft, AlertTriangle, Check, Loader2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PayrollConfirmProps {
  batchTotal: number;
  batchCount: number;
  currencyBreakdown: Record<string, number>;
  isApproving: boolean;
  isApproved: boolean;
  isConnected: boolean;
  onBack: () => void;
  onApprove: () => void;
  onSend: () => void;
}

export function PayrollConfirm({
  batchTotal,
  batchCount,
  currencyBreakdown,
  isApproving,
  isApproved,
  isConnected,
  onBack,
  onApprove,
  onSend,
}: PayrollConfirmProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Summary</h2>

        {/* Line Items */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({batchCount} employees)</span>
            <span className="font-medium text-gray-900">{formatCurrency(batchTotal)}</span>
          </div>
          {Object.keys(currencyBreakdown).length > 1 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Multi-currency conversion</span>
              <span className="text-xs text-gray-400">Applied at market rate</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Network Fee</span>
            <span className="font-medium text-[#059669]">$0.001</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total Debit</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(batchTotal + 0.001)}</span>
          </div>
        </div>

        {/* Settlement Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Network</span>
            <span className="font-medium text-gray-900">Tempo Payment Lane</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimated Settlement</span>
            <span className="font-medium text-gray-900">&lt;1 second</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Employees</span>
            <span className="font-medium text-gray-900">{batchCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Currencies</span>
            <span className="font-medium text-gray-900">{Object.keys(currencyBreakdown).join(", ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Contract</span>
            <span className="font-mono text-xs text-gray-900">SettleX</span>
          </div>
        </div>

        {/* Token Approval Step */}
        {isConnected && !isApproved && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800">Token Approval Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  You need to approve the SettleX contract to transfer tokens on your behalf.
                </p>
                <button
                  onClick={onApprove}
                  disabled={isApproving}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Approving...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Approve Tokens
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Success */}
        {isConnected && isApproved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-green-800">Token approval confirmed</span>
          </div>
        )}

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-800">
            <span className="font-semibold">
              This will debit {formatCurrency(batchTotal + 0.001)} from your wallet.
            </span>
            <br />
            This action cannot be reversed once confirmed.
          </div>
        </div>

        {/* Not connected warning */}
        {!isConnected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm font-medium text-red-800">Connect your wallet to send payroll</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onSend}
            disabled={!isConnected || !isApproved}
            className="bg-[#059669] hover:bg-[#047857] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 text-base"
          >
            Send Payroll
          </button>
        </div>
      </div>
    </div>
  );
}
