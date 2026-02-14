"use client";

import { StepIndicator } from "./StepIndicator";
import { PayrollReview } from "./PayrollReview";
import { PayrollConfirm } from "./PayrollConfirm";
import { PayrollSettlement } from "./PayrollSettlement";
import type { PayrollStep, BatchEmployee, Employee, SettlementState, SettlementTxData, Page } from "@/lib/types";

interface PayrollWizardProps {
  step: PayrollStep;
  batch: BatchEmployee[];
  batchTotal: number;
  currencyBreakdown: Record<string, number>;
  editingAmount: number | null;
  showAddToBatch: boolean;
  employees: Employee[];
  settlementStatus: Record<number, SettlementState>;
  confirmedCount: number;
  settlementComplete: boolean;
  settlementTxData: SettlementTxData | null;
  settlementError: string | null;
  isApproving: boolean;
  isApproved: boolean;
  isConnected: boolean;
  autoSwapEnabled: boolean;
  sourceTokenSymbol: string;
  onSetStep: (step: PayrollStep) => void;
  onSetEditingAmount: (id: number | null) => void;
  onUpdateAmount: (id: number, amount: number) => void;
  onUpdateCurrency: (id: number, currency: string) => void;
  onRemoveFromBatch: (id: number) => void;
  onAddToBatch: (emp: BatchEmployee) => void;
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onApprove: () => void;
  onStartSettlement: () => void;
  onResetPayroll: () => void;
  onNavigate: (page: Page) => void;
  onToggleAutoSwap: (enabled: boolean) => void;
}

export function PayrollWizard({
  step,
  batch,
  batchTotal,
  currencyBreakdown,
  editingAmount,
  showAddToBatch,
  employees,
  settlementStatus,
  confirmedCount,
  settlementComplete,
  settlementTxData,
  settlementError,
  isApproving,
  isApproved,
  isConnected,
  autoSwapEnabled,
  sourceTokenSymbol,
  onSetStep,
  onSetEditingAmount,
  onUpdateAmount,
  onUpdateCurrency,
  onRemoveFromBatch,
  onAddToBatch,
  onOpenAddModal,
  onCloseAddModal,
  onApprove,
  onStartSettlement,
  onResetPayroll,
  onNavigate,
  onToggleAutoSwap,
}: PayrollWizardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Run Payroll</h1>
          <p className="text-sm text-slate-500 mt-1">Process batch payments to your team</p>
        </div>
        <StepIndicator currentStep={step} />
      </div>

      {step === 1 && (
        <PayrollReview
          batch={batch}
          batchTotal={batchTotal}
          currencyBreakdown={currencyBreakdown}
          editingAmount={editingAmount}
          showAddModal={showAddToBatch}
          employees={employees}
          onSetEditingAmount={onSetEditingAmount}
          onUpdateAmount={onUpdateAmount}
          onUpdateCurrency={onUpdateCurrency}
          onRemove={onRemoveFromBatch}
          onAdd={onAddToBatch}
          onOpenAddModal={onOpenAddModal}
          onCloseAddModal={onCloseAddModal}
          onContinue={() => onSetStep(2)}
        />
      )}

      {step === 2 && (
        <PayrollConfirm
          batchTotal={batchTotal}
          batchCount={batch.length}
          currencyBreakdown={currencyBreakdown}
          isApproving={isApproving}
          isApproved={isApproved}
          isConnected={isConnected}
          autoSwapEnabled={autoSwapEnabled}
          sourceTokenSymbol={sourceTokenSymbol}
          onBack={() => onSetStep(1)}
          onApprove={onApprove}
          onSend={onStartSettlement}
          onToggleAutoSwap={onToggleAutoSwap}
        />
      )}

      {step === 3 && (
        <PayrollSettlement
          batch={batch}
          settlementStatus={settlementStatus}
          confirmedCount={confirmedCount}
          settlementComplete={settlementComplete}
          settlementTxData={settlementTxData}
          settlementError={settlementError}
          onNavigate={onNavigate}
          onResetPayroll={onResetPayroll}
        />
      )}
    </div>
  );
}
