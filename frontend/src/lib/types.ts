import type { Address } from "viem";

// ─── Navigation ──────────────────────────────────────────────────────────────

export type Page = "dashboard" | "payroll" | "team" | "history" | "batch";
export type PayrollStep = 1 | 2 | 3;
export type SettlementState = "waiting" | "processing" | "confirmed" | "failed";
export type HistoryFilter = "all" | "completed" | "failed";
export type BatchStatus = "settled" | "processing" | "failed";

// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Employee {
  id: number;
  name: string;
  email: string;
  country: string;
  flag: string;
  currency: string;
  amount: number;
  wallet: string;
  avatar: string;
  status: "active" | "inactive";
}

export interface BatchEmployee {
  id: number;
  name: string;
  email: string;
  country: string;
  flag: string;
  currency: string;
  amount: number;
  wallet: string;
  avatar: string;
}

export interface PayrollRecord {
  id: string;
  date: string;
  employees: number;
  total: number;
  fee: string;
  txHash: string;
  status: "completed" | "failed" | "pending";
  settlementTime: string;
}

export interface BatchRecord {
  id: string;
  status: BatchStatus;
  payments: number;
  total: number;
  created: string;
  settled: string;
  txHash: string;
  traditionalCost: number;
  tempoCost: number;
}

export interface NewEmployeeForm {
  name: string;
  email: string;
  country: string;
  wallet: string;
  currency: string;
}

// ─── Settlement ─────────────────────────────────────────────────────────────

export interface SettlementTxData {
  txHash: string;
  blockNumber: string;
  gasUsed: string;
  gasCostUsd: string;
  settlementTime: string;
}

// ─── Templates ──────────────────────────────────────────────────────────────

export interface PayrollTemplate {
  id: string;
  name: string;
  createdAt: string;
  employees: BatchEmployee[];
}

// ─── Token ───────────────────────────────────────────────────────────────────

export interface TokenInfo {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
}
