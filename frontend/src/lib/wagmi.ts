import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import { tempoModerato } from 'viem/chains';

export const wagmiConfig = getDefaultConfig({
  appName: "SettleX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [tempoModerato],
  ssr: true,
});


if (!process.env.NEXT_PUBLIC_PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is required');
}

// client we would use to batch txs
export const client = createWalletClient({
  account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`),
  chain: tempoModerato,
  transport: http()
})
