import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConfig,
} from "wagmi";
import { formatUnits, parseUnits, type Address } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import { SETTLEX_ADDRESS, ERC20_ABI } from "@/abi";
import { TOKENS } from "./useSettleX";

export function useToken(tokenAddress: Address) {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync, isPending } = useWriteContract();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address || "0x", SETTLEX_ADDRESS],
    query: { enabled: !!address },
  });

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address || "0x"],
    query: { enabled: !!address },
  });

  // Wait for transaction
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Approve function
  const approve = async (amount?: string) => {
    if (!address) {
      setStatus("Connect wallet first");
      return false;
    }

    try {
      setStatus("Approving tokens...");
      setLoading(true);

      const approvalAmount = amount
        ? parseUnits(amount, 6)
        : parseUnits("1000000", 6);

      const tx = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [SETTLEX_ADDRESS, approvalAmount],
      });

      setTxHash(tx);
      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("Approval successful");
      refetchAllowance();
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      if (!message.includes("User rejected")) {
        setStatus("Approval failed");
      } else {
        setStatus("Transaction rejected");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Derived values
  const currentAllowance = allowance
    ? formatUnits(allowance as bigint, 6)
    : "0";
  const currentBalance = balance
    ? formatUnits(balance as bigint, 6)
    : "0";
  const hasAllowance = allowance ? (allowance as bigint) > 0n : false;

  const tokenName =
    Object.entries(TOKENS).find(([, info]) => info.address === tokenAddress)?.[0] ??
    "Token";

  useEffect(() => {
    if (!address) {
      setStatus("");
      setTxHash(undefined);
    }
  }, [address]);

  return {
    allowance: currentAllowance,
    balance: currentBalance,
    hasAllowance,
    tokenName,
    approve,
    refetchAllowance,
    refetchBalance,
    status,
    loading: loading || isPending || isConfirming,
  };
}
