"use client";

import { ArrowLeft, AlertTriangle, Check, Loader2, ShieldCheck, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PayrollConfirmProps {
  batchTotal: number;
  batchCount: number;
  currencyBreakdown: Record<string, number>;
  isApproving: boolean;
  isApproved: boolean;
  isConnected: boolean;
  autoSwapEnabled: boolean;
  sourceTokenSymbol: string;
  onBack: () => void;
  onApprove: () => void;
  onSend: () => void;
  onToggleAutoSwap: (enabled: boolean) => void;
}

export function PayrollConfirm({
  batchTotal,
  batchCount,
  currencyBreakdown,
  isApproving,
  isApproved,
  isConnected,
  autoSwapEnabled,
  sourceTokenSymbol,
  onBack,
  onApprove,
  onSend,
  onToggleAutoSwap,
}: PayrollConfirmProps) {
  const currencies = Object.keys(currencyBreakdown);
  const hasMultipleCurrencies = currencies.length > 1;
  const swapNeeded = hasMultipleCurrencies || !currencies.includes(sourceTokenSymbol);

  const swapBreakdownEntries = Object.entries(currencyBreakdown).filter(
    ([currency]) => currency !== sourceTokenSymbol
  );
  const directAmount = currencyBreakdown[sourceTokenSymbol] || 0;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Payment Summary</h2>

        {/* Line Items */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal ({batchCount} employees)</span>
            <span className="font-semibold text-slate-900">{formatCurrency(batchTotal)}</span>
          </div>
          {autoSwapEnabled && swapBreakdownEntries.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">DEX swap fee</span>
              <span className="text-xs text-slate-400">Included in rate (1% max slippage)</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Network Fee</span>
            <span className="font-medium text-emerald-600">$0.001</span>
          </div>
          <hr className="border-slate-100" />
          <div className="flex justify-between">
            <span className="font-semibold text-slate-900">Total Debit</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(batchTotal + 0.001)}</span>
          </div>
        </div>

        {/* Auto-Swap Toggle */}
        {swapNeeded && (
          <div className={`rounded-xl border p-4 mb-6 transition-all duration-200 ${autoSwapEnabled ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className={`w-4 h-4 ${autoSwapEnabled ? 'text-violet-600' : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${autoSwapEnabled ? 'text-violet-900' : 'text-slate-700'}`}>
                  Auto-Swap to Employee Preferred Tokens
                </span>
              </div>
              <button
                onClick={() => onToggleAutoSwap(!autoSwapEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${autoSwapEnabled ? 'bg-violet-600' : 'bg-slate-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${autoSwapEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <p className={`text-xs mb-3 ${autoSwapEnabled ? 'text-violet-700' : 'text-slate-500'}`}>
              {autoSwapEnabled
                ? `Your ${sourceTokenSymbol} will be swapped via Tempo DEX to each employee's preferred token in a single atomic transaction.`
                : `Enable to automatically swap your ${sourceTokenSymbol} to each employee's preferred stablecoin.`
              }
            </p>
            {autoSwapEnabled && swapBreakdownEntries.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-violet-200">
                {swapBreakdownEntries.map(([currency, amount]) => (
                  <div key={currency} className="flex justify-between text-xs">
                    <span className="text-violet-700">
                      {sourceTokenSymbol} → {currency}
                    </span>
                    <span className="font-medium text-violet-900">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
                {directAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-violet-700">
                      Direct {sourceTokenSymbol}
                    </span>
                    <span className="font-medium text-violet-900">
                      {formatCurrency(directAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Settlement Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Network</span>
            <span className="font-medium text-slate-900">Tempo Payment Lane</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Estimated Settlement</span>
            <span className="font-medium text-emerald-600">&lt;1 second</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Employees</span>
            <span className="font-medium text-slate-900">{batchCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Currencies</span>
            <span className="font-medium text-slate-900">{currencies.join(", ")}</span>
          </div>
          {autoSwapEnabled && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Auto-Swap</span>
              <span className="font-medium text-violet-600">Enabled via Tempo DEX</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Contract</span>
            <span className="font-mono text-xs text-slate-900">SettleX</span>
          </div>
        </div>

        {/* Token Approval Step */}
        {isConnected && !isApproved && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-800">Token approval confirmed</span>
          </div>
        )}

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">
              This will debit {formatCurrency(batchTotal + 0.001)} from your wallet.
            </span>
            <br />
            This action cannot be reversed once confirmed.
          </div>
        </div>

        {/* Not connected warning */}
        {!isConnected && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm font-medium text-red-800">Connect your wallet to send payroll</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-all duration-150"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onSend}
            disabled={!isConnected || !isApproved}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 text-base shadow-sm"
          >
            Send Payroll
          </button>
        </div>
      </div>
    </div>
  );
}
