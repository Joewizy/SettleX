import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import { tempoModerato } from 'viem/chains';

// Lazy-initialized to avoid WalletConnect accessing indexedDB during SSR
let _wagmiConfig: ReturnType<typeof getDefaultConfig> | null = null;

export function getWagmiConfig() {
  if (!_wagmiConfig) {
    _wagmiConfig = getDefaultConfig({
      appName: "SettleX",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
      chains: [tempoModerato],
      ssr: true,
    });
  }
  return _wagmiConfig;
}

if (!process.env.NEXT_PUBLIC_PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is required');
}

// client we would use to batch txs
export const client = createWalletClient({
  account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`),
  chain: tempoModerato,
  transport: http()
})
