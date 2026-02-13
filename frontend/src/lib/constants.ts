import type { Employee, PayrollRecord, BatchRecord, TokenInfo } from "./types";
import type { Address } from "viem";

// ─── Tempo Testnet Tokens ────────────────────────────────────────────────────

export const TOKENS: Record<string, TokenInfo> = {
  pathUSD: {
    symbol: "pathUSD",
    name: "Path USD",
    address: "0x20c0000000000000000000000000000000000000" as Address,
    decimals: 6,
  },
  AlphaUSD: {
    symbol: "AlphaUSD",
    name: "Alpha USD",
    address: "0x20c0000000000000000000000000000000000001" as Address,
    decimals: 6,
  },
  BetaUSD: {
    symbol: "BetaUSD",
    name: "Beta USD",
    address: "0x20c0000000000000000000000000000000000002" as Address,
    decimals: 6,
  },
  ThetaUSD: {
    symbol: "ThetaUSD",
    name: "Theta USD",
    address: "0x20c0000000000000000000000000000000000003" as Address,
    decimals: 6,
  },
};

export const DEFAULT_TOKEN = TOKENS.pathUSD;

export const TOKEN_LIST = Object.values(TOKENS);

// ─── Avatar Colors ───────────────────────────────────────────────────────────

export const AVATAR_COLORS: Record<string, string> = {
  AO: "bg-purple-500",
  CM: "bg-blue-500",
  EV: "bg-teal-500",
  JL: "bg-orange-500",
  PS: "bg-pink-500",
  SL: "bg-indigo-500",
};

// ─── Countries ───────────────────────────────────────────────────────────────

export const COUNTRIES = [
  "Nigeria",
  "Brazil",
  "Mexico",
  "Singapore",
  "India",
  "France",
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "South Korea",
  "Kenya",
];

// ─── Seed Data ───────────────────────────────────────────────────────────────

export const EMPLOYEES_SEED: Employee[] = [
  { id: 1, name: "Adaeze Okafor", email: "adaeze@team.io", country: "Nigeria", flag: "🇳🇬", currency: "pathUSD", amount: 3200, wallet: "0x1a2b...9f3e", avatar: "AO", status: "active" },
  { id: 2, name: "Carlos Mendes", email: "carlos@team.io", country: "Brazil", flag: "🇧🇷", currency: "AlphaUSD", amount: 2800, wallet: "0x4c5d...2a1b", avatar: "CM", status: "active" },
  { id: 3, name: "Elena Vasquez", email: "elena@team.io", country: "Mexico", flag: "🇲🇽", currency: "pathUSD", amount: 1500, wallet: "0x7e8f...5c3d", avatar: "EV", status: "active" },
  { id: 4, name: "James Liu", email: "james@team.io", country: "Singapore", flag: "🇸🇬", currency: "BetaUSD", amount: 4100, wallet: "0x2b3c...8d4e", avatar: "JL", status: "active" },
  { id: 5, name: "Priya Sharma", email: "priya@team.io", country: "India", flag: "🇮🇳", currency: "AlphaUSD", amount: 2900, wallet: "0x6f7g...1a5b", avatar: "PS", status: "active" },
  { id: 6, name: "Sophie Laurent", email: "sophie@team.io", country: "France", flag: "🇫🇷", currency: "ThetaUSD", amount: 3600, wallet: "0x9h0i...4c6d", avatar: "SL", status: "active" },
];

export const PAYROLL_HISTORY_SEED: PayrollRecord[] = [
  { id: "PR-0042", date: "Feb 10, 2025", employees: 6, total: 18100, fee: "$0.001", txHash: "0xabc123...def456", status: "completed", settlementTime: "0.8s" },
  { id: "PR-0041", date: "Jan 27, 2025", employees: 6, total: 17800, fee: "$0.001", txHash: "0x789abc...012def", status: "completed", settlementTime: "0.7s" },
  { id: "PR-0040", date: "Jan 13, 2025", employees: 5, total: 14500, fee: "$0.001", txHash: "0xdef456...789abc", status: "completed", settlementTime: "0.9s" },
  { id: "PR-0039", date: "Dec 30, 2024", employees: 5, total: 14200, fee: "$0.001", txHash: "0x012def...345ghi", status: "completed", settlementTime: "0.6s" },
  { id: "PR-0038", date: "Dec 16, 2024", employees: 4, total: 11500, fee: "$0.001", txHash: "0x345ghi...678jkl", status: "completed", settlementTime: "0.8s" },
];

export const BATCH_QUEUE_SEED: BatchRecord[] = [
  { id: "BT-0098", status: "settled", payments: 6, total: 18100, created: "Feb 10, 2025 14:30", settled: "Feb 10, 2025 14:30", txHash: "0xabc123...def456", traditionalCost: 250, tempoCost: 0.001 },
  { id: "BT-0097", status: "settled", payments: 6, total: 17800, created: "Jan 27, 2025 09:15", settled: "Jan 27, 2025 09:15", txHash: "0x789abc...012def", traditionalCost: 250, tempoCost: 0.001 },
  { id: "BT-0096", status: "settled", payments: 5, total: 14500, created: "Jan 13, 2025 11:00", settled: "Jan 13, 2025 11:00", txHash: "0xdef456...789abc", traditionalCost: 210, tempoCost: 0.001 },
];
