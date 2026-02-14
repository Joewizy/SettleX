"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PayrollWizard } from "@/components/payroll/PayrollWizard";
import { TeamPage } from "@/components/team/TeamPage";
import { HistoryPage } from "@/components/history/HistoryPage";
import { BatchPage } from "@/components/batch/BatchPage";
import {
  useNavigation,
  useTeam,
  usePayroll,
  useHistory,
  useBatch,
  usePayrollHistory,
} from "@/hooks/useAppState";
import { useToken } from "@/hooks/useToken";
import { usePayment } from "@/hooks/usePayment";
import { useSettleX } from "@/hooks/useSettleX";
import { DEFAULT_TOKEN } from "@/lib/constants";

export default function SettleXApp() {
  const { isConnected } = useAccount();
  const nav = useNavigation();
  const team = useTeam();
  const payroll = usePayroll(team.activeEmployees);
  const history = useHistory();
  const batch = useBatch();
  const payment = usePayment();
  const settleX = useSettleX();
  const payrollHistory = usePayrollHistory();

  const [payrollToken] = useState(DEFAULT_TOKEN);
  const token = useToken(payrollToken.address);

  const handleNavigate = (page: Parameters<typeof nav.navigateTo>[0]) => {
    nav.navigateTo(page);
    if (page === "payroll") {
      payroll.resetPayroll();
    }
  };

  const handleApprove = useCallback(async () => {
    const totalAmount = payroll.batchTotal + 0.001;
    await token.approve(totalAmount.toString());
  }, [token, payroll.batchTotal]);

  const handleStartSettlement = useCallback(async () => {
    await token.ensureApproval((payroll.batchTotal + 0.001).toString());
    payroll.startSettlement(
      payment.processPayment,
      payrollToken.address,
      false,
      (txData, batchEmployees) => {
        // Save to history
        payrollHistory.addRecord(txData, batchEmployees);
        // Refetch on-chain stats
        settleX.refetchStats();
      },
    );
  }, [payroll, payment.processPayment, payrollToken.address, token, payrollHistory, settleX]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        currentPage={nav.currentPage}
        onNavigate={handleNavigate}
        showUserMenu={nav.showUserMenu}
        onToggleUserMenu={() => nav.setShowUserMenu(!nav.showUserMenu)}
      />
      <main className="pt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {nav.currentPage === "dashboard" && (
            <Dashboard
              employeeCount={team.employees.length}
              onNavigate={handleNavigate}
              onExpandHistory={history.setExpandedHistory}
              employerStats={settleX.parsedStats}
              isConnected={isConnected}
              payrollHistory={payrollHistory.records}
            />
          )}
          {nav.currentPage === "payroll" && (
            <PayrollWizard
              step={payroll.payrollStep}
              batch={payroll.payrollBatch}
              batchTotal={payroll.batchTotal}
              currencyBreakdown={payroll.currencyBreakdown}
              editingAmount={payroll.editingAmount}
              showAddToBatch={payroll.showAddToBatch}
              employees={team.employees}
              settlementStatus={payroll.settlementStatus}
              confirmedCount={payroll.confirmedCount}
              settlementComplete={payroll.settlementComplete}
              settlementTxData={payroll.settlementTxData}
              settlementError={payroll.settlementError}
              isApproving={token.loading}
              isApproved={token.hasAllowance}
              isConnected={isConnected}
              autoSwapEnabled={payroll.autoSwapEnabled}
              sourceTokenSymbol={payrollToken.symbol}
              onSetStep={payroll.setPayrollStep}
              onSetEditingAmount={payroll.setEditingAmount}
              onUpdateAmount={payroll.updateAmount}
              onUpdateCurrency={payroll.updateCurrency}
              onRemoveFromBatch={payroll.removeFromBatch}
              onAddToBatch={payroll.addToBatch}
              onOpenAddModal={() => payroll.setShowAddToBatch(true)}
              onCloseAddModal={() => payroll.setShowAddToBatch(false)}
              onApprove={handleApprove}
              onStartSettlement={handleStartSettlement}
              onResetPayroll={payroll.resetPayroll}
              onNavigate={handleNavigate}
              onToggleAutoSwap={payroll.setAutoSwapEnabled}
            />
          )}
          {nav.currentPage === "team" && (
            <TeamPage
              filteredEmployees={team.filteredEmployees}
              teamSearch={team.teamSearch}
              showAddEmployee={team.showAddEmployee}
              newEmployee={team.newEmployee}
              onSetTeamSearch={team.setTeamSearch}
              onSetShowAddEmployee={team.setShowAddEmployee}
              onSetNewEmployee={team.setNewEmployee}
              onAddEmployee={team.addEmployee}
              onDeleteEmployee={team.deleteEmployee}
            />
          )}
          {nav.currentPage === "history" && (
            <HistoryPage
              filter={history.historyFilter}
              expandedId={history.expandedHistory}
              onSetFilter={history.setHistoryFilter}
              onToggleExpand={history.setExpandedHistory}
              payrollHistory={payrollHistory.records}
            />
          )}
          {nav.currentPage === "batch" && (
            <BatchPage
              expandedBatch={batch.expandedBatch}
              onToggleExpand={batch.setExpandedBatch}
            />
          )}
        </div>
      </main>
    </div>
  );
}
