"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
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
} from "@/hooks/useAppState";
import { useToken } from "@/hooks/useToken";
import { usePayment } from "@/hooks/usePayment";
import { DEFAULT_TOKEN } from "@/lib/constants";

export default function SettleXApp() {
  const { isConnected } = useAccount();
  const nav = useNavigation();
  const team = useTeam();
  const payroll = usePayroll(team.activeEmployees);
  const history = useHistory();
  const batch = useBatch();
  const payment = usePayment();

  // Token approval state — uses default token for now
  const [payrollToken] = useState(DEFAULT_TOKEN);
  const token = useToken(payrollToken.address);

  const handleNavigate = (page: Parameters<typeof nav.navigateTo>[0]) => {
    nav.navigateTo(page);
    if (page === "payroll") {
      payroll.resetPayroll();
    }
  };

  // Approve tokens for the SettleX contract - auto-approve if needed
  const handleApprove = useCallback(async () => {
    const totalAmount = payroll.batchTotal + 0.001;
    await token.approve(totalAmount.toString());
  }, [token, payroll.batchTotal]);

  // Start settlement using the real SettleX contract - with auto-approval
  const handleStartSettlement = useCallback(async () => {
    // Auto-approve first if needed using the token hook
    await token.ensureApproval((payroll.batchTotal + 0.001).toString());
    
    // Then start settlement
    payroll.startSettlement(payment.processPayment, payrollToken.address);
  }, [payroll, payment.processPayment, payrollToken.address, token]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={nav.currentPage}
        onNavigate={handleNavigate}
        showUserMenu={nav.showUserMenu}
        onToggleUserMenu={() => nav.setShowUserMenu(!nav.showUserMenu)}
      />
      <main className="flex-1 ml-[220px] p-8">
        {nav.currentPage === "dashboard" && (
          <Dashboard
            employeeCount={team.employees.length}
            onNavigate={handleNavigate}
            onExpandHistory={history.setExpandedHistory}
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
          />
        )}
        {nav.currentPage === "batch" && (
          <BatchPage
            expandedBatch={batch.expandedBatch}
            onToggleExpand={batch.setExpandedBatch}
          />
        )}
      </main>
    </div>
  );
}
