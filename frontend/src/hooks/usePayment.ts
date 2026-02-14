import { useCallback } from "react";
import { parseUnits, type Address } from "viem";
import { useSettleX } from "./useSettleX";
import { useBatch, type BatchPayment } from "./useBatch";
import type { BatchEmployee } from "@/lib/types";

export function usePayment() {
  const { payEmployee, recordBatchPayroll, status, settling } = useSettleX();
  const { sendBatchPayment } = useBatch();

  // Pay single employee
  const paySingleEmployee = useCallback(async (
    employee: BatchEmployee,
    tokenAddress: Address,
    memo: string = "Payment"
  ) => {
    const amountWei = parseUnits(employee.amount.toString(), 6);
    const memoBytes32 = `0x${Buffer.from(memo).toString('hex').padEnd(64, '0')}`;

    const result = await payEmployee(
      employee.wallet as Address,
      amountWei,
      tokenAddress,
      memoBytes32 as `0x${string}`
    );

    return result;
  }, [payEmployee]);

  // Pay multiple employees (batch)
  const payMultipleEmployees = useCallback(async (
    employees: BatchEmployee[],
    tokenAddress: Address,
    autoSwapEnabled: boolean = false
  ) => {
    const batchPayments: BatchPayment[] = employees.map(emp => ({
      employee: emp.wallet as Address,
      amount: emp.amount.toString(),
      memo: `Payment to ${emp.name}`,
      name: emp.name,
      email: emp.email,
      currency: emp.currency,
    }));

    const result = await sendBatchPayment(batchPayments, tokenAddress, autoSwapEnabled);

    // Only record batch on-chain if successful
    if (result && result.status === 'success') {
      const totalAmount = employees.reduce((sum, emp) => sum + emp.amount, 0);
      const totalAmountWei = parseUnits(totalAmount.toString(), 6);
      const batchId = `0x${Date.now().toString(16).padStart(64, '0')}`;

      await recordBatchPayroll(
        batchId as `0x${string}`,
        tokenAddress,
        totalAmountWei,
        BigInt(employees.length)
      );
    }

    return result;
  }, [sendBatchPayment, recordBatchPayroll]);

  // Unified payment function that chooses the right approach
  const processPayment = useCallback(async (
    employees: BatchEmployee[],
    tokenAddress: Address,
    onStatus?: (empId: number, status: "processing" | "confirmed" | "failed") => void,
    autoSwapEnabled: boolean = false
  ) => {
    if (employees.length === 1) {
      // Single employee payment
      const employee = employees[0];
      onStatus?.(employee.id, "processing");

      try {
        const result = await paySingleEmployee(employee, tokenAddress);
        if (result) {
          onStatus?.(employee.id, "confirmed");
        } else {
          onStatus?.(employee.id, "failed");
        }

        return {
          results: result ? [{
            txHash: result.txHash,
            blockNumber: result.blockNumber,
            gasUsed: result.gasUsed
          }] : [],
          totalGas: result?.gasUsed || 0n,
          batchTxHash: null
        };
      } catch (error) {
        onStatus?.(employee.id, "failed");
        throw error;
      }
    } else {
      // Batch payment
      employees.forEach(emp => onStatus?.(emp.id, "processing"));

      try {
        const result = await payMultipleEmployees(employees, tokenAddress, autoSwapEnabled);

        if (result && result.status === 'success') {
          employees.forEach(emp => onStatus?.(emp.id, "confirmed"));
        } else {
          employees.forEach(emp => onStatus?.(emp.id, "failed"));
        }

        const returnData = {
          results: [],
          totalGas: result?.gasUsed || 0n,
          transactionFee: result?.transactionFee || '0.000000',
          settlementTime: result?.settlementTime || '0s',
          batchTxHash: result?.batchTxHash || null,
          blockNumber: result?.blockNumber || 0n
        };

        return returnData;
      } catch (error) {
        employees.forEach(emp => onStatus?.(emp.id, "failed"));
        throw error;
      }
    }
  }, [paySingleEmployee, payMultipleEmployees]);

  return {
    paySingleEmployee,
    payMultipleEmployees,
    processPayment,
    status,
    settling
  };
}
