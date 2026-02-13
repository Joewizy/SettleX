import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useConfig,
} from "wagmi";
import {
  formatUnits,
  parseUnits,
  encodeAbiParameters,
  keccak256,
  type Address,
} from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { SETTLEX_ADDRESS, SETTLEX_ABI } from "@/abi";
import { TOKENS } from "@/lib/constants";
import type { BatchEmployee } from "@/lib/types";

export { TOKENS };

export interface SettlementResult {
  txHash: `0x${string}`;
  blockNumber: bigint;
  gasUsed: bigint;
}

export function useSettleX() {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [settling, setSettling] = useState(false);

  // Read authorization status
  const { data: isAuthorized } = useReadContract({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "isAuthorizedEmployer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read employer stats
  const { data: employerStats } = useReadContract({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "getEmployerStats",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Pay a single employee via the SettleX contract
  const payEmployee = async (
    employee: Address,
    amount: bigint,
    token: Address,
    memo: `0x${string}`,
  ): Promise<SettlementResult> => {
    const txHash = await writeContractAsync({
      address: SETTLEX_ADDRESS,
      abi: SETTLEX_ABI,
      functionName: "payEmployee",
      args: [employee, amount, token, memo],
    });

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    return {
      txHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    };
  };

  // Record batch summary on-chain after all payments
  const recordBatchPayroll = async (
    batchId: `0x${string}`,
    token: Address,
    totalAmount: bigint,
    employeeCount: bigint,
  ) => {
    const txHash = await writeContractAsync({
      address: SETTLEX_ADDRESS,
      abi: SETTLEX_ABI,
      functionName: "recordBatchPayroll",
      args: [batchId, token, totalAmount, employeeCount],
    });

    await waitForTransactionReceipt(config, { hash: txHash });
    return txHash;
  };

  // Execute full batch settlement: pay each employee, then record the batch
  const settleBatch = async (
    batch: BatchEmployee[],
    tokenAddress: Address,
    onEmployeeStatus: (
      empId: number,
      status: "processing" | "confirmed" | "failed",
    ) => void,
  ): Promise<{
    results: SettlementResult[];
    totalGas: bigint;
    batchTxHash: `0x${string}` | null;
  }> => {
    setSettling(true);
    const results: SettlementResult[] = [];
    let totalGas = 0n;

    // Generate a unique batch ID
    const batchId = keccak256(
      encodeAbiParameters(
        [{ type: "address" }, { type: "uint256" }],
        [address || "0x0000000000000000000000000000000000000000", BigInt(Date.now())],
      ),
    ) as `0x${string}`;

    try {
      // Pay each employee sequentially
      for (const emp of batch) {
        onEmployeeStatus(emp.id, "processing");

        try {
          const amount = parseUnits(emp.amount.toString(), 6);
          const memo = keccak256(
            encodeAbiParameters(
              [{ type: "string" }],
              [`payroll-${emp.id}-${Date.now()}`],
            ),
          ) as `0x${string}`;

          const result = await payEmployee(
            emp.wallet as Address,
            amount,
            tokenAddress,
            memo,
          );

          results.push(result);
          totalGas += result.gasUsed;
          onEmployeeStatus(emp.id, "confirmed");
        } catch {
          onEmployeeStatus(emp.id, "failed");
          throw new Error(`Payment failed for ${emp.name}`);
        }
      }

      // Record the batch summary on-chain
      const totalAmount = batch.reduce(
        (sum, emp) => sum + parseUnits(emp.amount.toString(), 6),
        0n,
      );

      let batchTxHash: `0x${string}` | null = null;
      try {
        batchTxHash = await recordBatchPayroll(
          batchId,
          tokenAddress,
          totalAmount,
          BigInt(batch.length),
        );
      } catch {
        // Non-critical: payments succeeded, batch record is optional
        console.warn("Batch record failed (payments still succeeded)");
      }

      return { results, totalGas, batchTxHash };
    } finally {
      setSettling(false);
    }
  };

  // Derived stats
  const totalPaid = employerStats
    ? formatUnits((employerStats as [bigint, bigint, boolean])[0], 6)
    : "0";
  const paymentCount = employerStats
    ? Number((employerStats as [bigint, bigint, boolean])[1])
    : 0;

  return {
    isAuthorized: isAuthorized as boolean | undefined,
    totalPaid,
    paymentCount,
    settling,
    payEmployee,
    recordBatchPayroll,
    settleBatch,
  };
}
