import { useState, useCallback, useEffect } from "react";
import type {
  Page,
  PayrollStep,
  SettlementState,
  SettlementTxData,
  BatchEmployee,
  Employee,
  HistoryFilter,
  NewEmployeeForm,
  PayrollRecord,
  PayrollTemplate,
} from "@/lib/types";
import { EMPLOYEES_SEED } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

function employeeToBatch(e: Employee): BatchEmployee {
  return {
    id: e.id,
    name: e.name,
    email: e.email,
    country: e.country,
    flag: e.flag,
    currency: e.currency,
    amount: e.amount,
    wallet: e.wallet,
    avatar: e.avatar,
  };
}

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    setShowUserMenu(false);
  }, []);

  return { currentPage, showUserMenu, setShowUserMenu, navigateTo };
}

export function useTeam() {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES_SEED);
  const [teamSearch, setTeamSearch] = useState("");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeForm>({
    name: "",
    email: "",
    country: "",
    wallet: "",
    currency: "pathUSD",
  });

  const activeEmployees = employees.filter((e) => e.status === "active");

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  const addEmployee = useCallback(() => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.country) return;
    const initials = getInitials(newEmployee.name);
    const emp: Employee = {
      id: Date.now(),
      name: newEmployee.name,
      email: newEmployee.email,
      country: newEmployee.country,
      flag: "🌍",
      currency: newEmployee.currency,
      amount: 0,
      wallet: newEmployee.wallet || "Auto-created via Privy",
      avatar: initials,
      status: "active",
    };
    setEmployees((prev) => [...prev, emp]);
    setNewEmployee({ name: "", email: "", country: "", wallet: "", currency: "pathUSD" });
    setShowAddEmployee(false);
  }, [newEmployee]);

  const deleteEmployee = useCallback((id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addEmployeesBulk = useCallback((newEmps: Employee[]) => {
    setEmployees((prev) => [...prev, ...newEmps]);
  }, []);

  return {
    employees,
    activeEmployees,
    filteredEmployees,
    teamSearch,
    setTeamSearch,
    showAddEmployee,
    setShowAddEmployee,
    newEmployee,
    setNewEmployee,
    addEmployee,
    deleteEmployee,
    addEmployeesBulk,
  };
}

export function usePayroll(activeEmployees: Employee[]) {
  const [payrollStep, setPayrollStep] = useState<PayrollStep>(1);
  const [payrollBatch, setPayrollBatch] = useState<BatchEmployee[]>([]);
  const [settlementStatus, setSettlementStatus] = useState<
    Record<number, SettlementState>
  >({});
  const [settlementComplete, setSettlementComplete] = useState(false);
  const [settlementTxData, setSettlementTxData] = useState<SettlementTxData | null>(null);
  const [settlementError, setSettlementError] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<number | null>(null);
  const [showAddToBatch, setShowAddToBatch] = useState(false);
  const [autoSwapEnabled, setAutoSwapEnabled] = useState(false);

  // Initialize batch from active employees
  useEffect(() => {
    setPayrollBatch(activeEmployees.map(employeeToBatch));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const batchTotal = payrollBatch.reduce((s, e) => s + e.amount, 0);

  const currencyBreakdown = payrollBatch.reduce(
    (acc, e) => {
      acc[e.currency] = (acc[e.currency] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const confirmedCount = Object.values(settlementStatus).filter(
    (s) => s === "confirmed",
  ).length;

  const resetPayroll = useCallback(() => {
    setPayrollStep(1);
    setSettlementStatus({});
    setSettlementComplete(false);
    setSettlementTxData(null);
    setSettlementError(null);
    setPayrollBatch(activeEmployees.map(employeeToBatch));
  }, [activeEmployees]);

  const removeFromBatch = useCallback((id: number) => {
    setPayrollBatch((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateAmount = useCallback((id: number, amount: number) => {
    setPayrollBatch((prev) =>
      prev.map((e) => (e.id === id ? { ...e, amount } : e)),
    );
  }, []);

  const updateCurrency = useCallback((id: number, currency: string) => {
    setPayrollBatch((prev) =>
      prev.map((e) => (e.id === id ? { ...e, currency } : e)),
    );
  }, []);

  const addToBatch = useCallback((emp: BatchEmployee) => {
    setPayrollBatch((prev) => [...prev, emp]);
  }, []);

  const loadBatchFromTemplate = useCallback((employees: BatchEmployee[]) => {
    setPayrollBatch(employees);
    setPayrollStep(1);
    setSettlementStatus({});
    setSettlementComplete(false);
    setSettlementTxData(null);
    setSettlementError(null);
  }, []);

  // Real blockchain settlement via the SettleX contract
  const startSettlement = useCallback(
    async (
      settleFunction: (
        batch: BatchEmployee[],
        tokenAddress: `0x${string}`,
        onStatus: (empId: number, status: "processing" | "confirmed" | "failed") => void,
        autoSwap?: boolean,
      ) => Promise<{
        results: { txHash: `0x${string}`; blockNumber: bigint; gasUsed: bigint }[];
        totalGas: bigint;
        batchTxHash: `0x${string}` | null;
        transactionFee?: string;
        settlementTime?: string;
        blockNumber?: bigint;
      }>,
      tokenAddress: `0x${string}`,
      isSinglePayment: boolean = false,
      onSettlementComplete?: (txData: SettlementTxData, batch: BatchEmployee[]) => void,
    ) => {
      setPayrollStep(3);
      setSettlementError(null);
      setSettlementTxData(null);

      // Initialize all employees to "waiting"
      const initial: Record<number, SettlementState> = {};
      payrollBatch.forEach((e) => {
        initial[e.id] = "waiting";
      });
      setSettlementStatus(initial);
      setSettlementComplete(false);

      const startTime = Date.now();

      try {
        const { results, totalGas, batchTxHash, transactionFee, settlementTime, blockNumber } = await settleFunction(
          payrollBatch,
          tokenAddress,
          (empId: number, status: "processing" | "confirmed" | "failed") => {
            setSettlementStatus((prev) => ({ ...prev, [empId]: status }));
          },
          autoSwapEnabled,
        );

        // Use batch transaction data for batch payments
        const txHashToUse = batchTxHash || results[results.length - 1]?.txHash || "0x";
        const blockNumberToUse = blockNumber?.toString() || results[results.length - 1]?.blockNumber?.toString() || "0";
        
        console.log('🔍 useAppState - settlement data:', {
          batchTxHash,
          blockNumber,
          resultsCount: results.length,
          lastResult: results[results.length - 1],
          txHashToUse,
          blockNumberToUse
        });
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        const txData: SettlementTxData = {
          txHash: txHashToUse,
          blockNumber: blockNumberToUse,
          gasUsed: totalGas.toLocaleString(),
          gasCostUsd: transactionFee || '0.000000',
          settlementTime: settlementTime || `${elapsed}s`,
        };

        setSettlementTxData(txData);
        setSettlementComplete(true);

        // Notify caller so they can save history / refetch stats
        onSettlementComplete?.(txData, payrollBatch);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Settlement failed";
        setSettlementError(msg);
      }
    },
    [payrollBatch, autoSwapEnabled],
  );

  return {
    payrollStep,
    setPayrollStep,
    payrollBatch,
    settlementStatus,
    settlementComplete,
    settlementTxData,
    settlementError,
    editingAmount,
    setEditingAmount,
    showAddToBatch,
    setShowAddToBatch,
    autoSwapEnabled,
    setAutoSwapEnabled,
    batchTotal,
    currencyBreakdown,
    confirmedCount,
    resetPayroll,
    removeFromBatch,
    updateAmount,
    updateCurrency,
    addToBatch,
    loadBatchFromTemplate,
    startSettlement,
  };
}

export function useHistory() {
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  return { historyFilter, setHistoryFilter, expandedHistory, setExpandedHistory };
}

export function useBatch() {
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  return { expandedBatch, setExpandedBatch };
}

// Persisted payroll history (saved to localStorage)
const HISTORY_STORAGE_KEY = "settlex_payroll_history";

function loadHistory(): PayrollRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(records: PayrollRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
}

export function usePayrollHistory() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const addRecord = useCallback(
    (txData: SettlementTxData, batch: BatchEmployee[]) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const batchTotal = batch.reduce((s, e) => s + e.amount, 0);
      const id = `PR-${String(now.getTime()).slice(-4)}`;

      const record: PayrollRecord = {
        id,
        date: dateStr,
        employees: batch.length,
        total: batchTotal,
        fee: `$${txData.gasCostUsd}`,
        txHash: txData.txHash,
        status: "completed",
        settlementTime: txData.settlementTime,
      };

      setRecords((prev) => {
        const updated = [record, ...prev];
        saveHistory(updated);
        return updated;
      });
    },
    [],
  );

  return { records, addRecord };
}

// Persisted payroll templates (saved to localStorage)
const TEMPLATES_STORAGE_KEY = "settlex_payroll_templates";

function loadTemplates(): PayrollTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTemplates(templates: PayrollTemplate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

export function usePayrollTemplates() {
  const [templates, setTemplates] = useState<PayrollTemplate[]>([]);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const saveTemplate = useCallback((name: string, employees: BatchEmployee[]) => {
    const template: PayrollTemplate = {
      id: `TPL-${Date.now()}`,
      name,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      employees,
    };

    setTemplates((prev) => {
      const updated = [template, ...prev];
      saveTemplates(updated);
      return updated;
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTemplates(updated);
      return updated;
    });
  }, []);

  return { templates, saveTemplate, deleteTemplate };
}
