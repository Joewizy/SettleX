import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useConfig,
} from "wagmi";
import { type Address, formatUnits } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { SETTLEX_ADDRESS, SETTLEX_ABI } from "@/abi";
import { TOKENS, TOKEN_LIST } from "@/lib/constants";
export { TOKENS };

export interface SettlementResult {
  txHash: `0x${string}`;
  blockNumber: bigint;
  gasUsed: bigint;
}

export interface EmployerStatsData {
  totalPaid: bigint;
  totalPaidFormatted: string;
  paymentCount: number;
  isAuthorized: boolean;
  totalGlobalPayments: number;
  tokenBreakdown: { symbol: string; amount: bigint; formatted: string }[];
}

export function useSettleX() {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [settling, setSettling] = useState(false);
  const [status, setStatus] = useState<string>('');

  // Read authorization status
  const { data: isAuthorized } = useReadContract({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "isAuthorizedEmployer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read employer stats
  const { data: employerStats, refetch: refetchEmployerStats } = useReadContract({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "getEmployerStats",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read global total payments
  const { data: totalGlobalPayments, refetch: refetchTotalPayments } = useReadContract({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "totalPayments",
    query: { enabled: !!address },
  });

  // Read per-token stats for all tokens
  const tokenStatsContracts = TOKEN_LIST.map((t) => ({
    address: SETTLEX_ADDRESS,
    abi: SETTLEX_ABI,
    functionName: "getEmployerTokenStats" as const,
    args: address ? [address, t.address] : undefined,
  }));

  const { data: tokenStatsResults, refetch: refetchTokenStats } = useReadContracts({
    contracts: tokenStatsContracts,
    query: { enabled: !!address },
  });

  // Compose parsed stats
  const parsedStats: EmployerStatsData | null = (() => {
    if (!employerStats) return null;
    const [totalPaid, paymentCount, authorized] = employerStats as [bigint, bigint, boolean];

    const tokenBreakdown = TOKEN_LIST.map((t, i) => {
      const raw = tokenStatsResults?.[i]?.result as bigint | undefined;
      const amount = raw ?? 0n;
      return {
        symbol: t.symbol,
        amount,
        formatted: formatUnits(amount, t.decimals),
      };
    }).filter((t) => t.amount > 0n);

    return {
      totalPaid,
      totalPaidFormatted: formatUnits(totalPaid, 6),
      paymentCount: Number(paymentCount),
      isAuthorized: authorized,
      totalGlobalPayments: Number(totalGlobalPayments ?? 0n),
      tokenBreakdown,
    };
  })();

  const refetchStats = () => {
    refetchEmployerStats();
    refetchTotalPayments();
    refetchTokenStats();
  };

  // Pay a single employee via SettleX contract
  const payEmployee = async (
    employee: Address,
    amount: bigint,
    token: Address,
    memo: `0x${string}`,
  ): Promise<SettlementResult | null> => {
    if (!address) {
      setStatus('❌ Please connect wallet first.');
      return null;
    }

    setSettling(true);
    setStatus('');

    try {
      setStatus('⏳ Processing payment...');
      
      const txHash = await writeContractAsync({
        address: SETTLEX_ADDRESS,
        abi: SETTLEX_ABI,
        functionName: "payEmployee",
        args: [employee, amount, token, memo],
      });

      setStatus('⏳ Waiting for confirmation...');
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status === 'success') {
        setStatus('✅ Payment completed successfully!');
      } else {
        setStatus('❌ Payment failed. Transaction was not successful.');
        return null;
      }
      
      return {
        txHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
      };
    } catch (error) {
      console.error('❌ Payment Error:', error);
      
      if (error instanceof Error && error.message.includes('User rejected the request')) {
        setStatus('');
        return null;
      }
      
      setStatus('❌ Payment failed. Please try again.');
      return null;
    } finally {
      setSettling(false);
    }
  };

  // Record batch summary on-chain after all payments
  const recordBatchPayroll = async (
    batchId: `0x${string}`,
    token: Address,
    totalAmount: bigint,
    employeeCount: bigint,
  ): Promise<`0x${string}` | null> => {
    if (!address) {
      setStatus('❌ Please connect wallet first.');
      return null;
    }

    setSettling(true);
    setStatus('');

    try {
      setStatus('⏳ Recording batch payroll...');
      
      const txHash = await writeContractAsync({
        address: SETTLEX_ADDRESS,
        abi: SETTLEX_ABI,
        functionName: "recordBatchPayroll",
        args: [batchId, token, totalAmount, employeeCount],
      });

      setStatus('⏳ Waiting for confirmation...');
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status === 'success') {
        setStatus('✅ Batch payroll recorded successfully!');
        return txHash;
      } else {
        setStatus('❌ Failed to record batch payroll. Transaction was not successful.');
        return null;
      }
    } catch (error) {
      console.error('❌ Batch Recording Error:', error);
      
      if (error instanceof Error && error.message.includes('User rejected the request')) {
        setStatus('');
        return null;
      }
      
      setStatus('❌ Failed to record batch payroll. Please try again.');
      return null;
    } finally {
      setSettling(false);
    }
  };

  return {
    isAuthorized: isAuthorized as boolean | undefined,
    settling,
    status,
    employerStats,
    parsedStats,
    refetchStats,
    payEmployee,
    recordBatchPayroll,
    setStatus,
  };
}
