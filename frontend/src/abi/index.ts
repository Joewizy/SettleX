import type { Address } from "viem";

export const SETTLEX_ADDRESS: Address =
  "0x079c4dFC2B330F720A29FDea2cD5C920606b13c8";

export const SETTLEX_ABI = [
  // ============ Write Functions ============
  {
    type: "function",
    name: "payEmployee",
    stateMutability: "nonpayable",
    inputs: [
      { name: "employee", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "token", type: "address" },
      { name: "memo", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "recordBatchPayroll",
    stateMutability: "nonpayable",
    inputs: [
      { name: "batchId", type: "bytes32" },
      { name: "token", type: "address" },
      { name: "totalAmount", type: "uint256" },
      { name: "employeeCount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "authorizeEmployer",
    stateMutability: "nonpayable",
    inputs: [{ name: "employer", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "revokeEmployer",
    stateMutability: "nonpayable",
    inputs: [{ name: "employer", type: "address" }],
    outputs: [],
  },

  // ============ View Functions ============
  {
    type: "function",
    name: "isAuthorizedEmployer",
    stateMutability: "view",
    inputs: [{ name: "employer", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "getEmployerStats",
    stateMutability: "view",
    inputs: [{ name: "employer", type: "address" }],
    outputs: [
      { name: "totalPaid", type: "uint256" },
      { name: "paymentCount", type: "uint256" },
      { name: "isAuthorized", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "getEmployerTokenStats",
    stateMutability: "view",
    inputs: [
      { name: "employer", type: "address" },
      { name: "token", type: "address" },
    ],
    outputs: [{ name: "totalPaid", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalPayments",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },

  // ============ Events ============
  {
    type: "event",
    name: "PaymentExecuted",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employee", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "memo", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BatchPayrollExecuted",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "batchId", type: "bytes32", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "employeeCount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "EmployerAuthorized",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "EmployerRevoked",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },

  // ============ Errors ============
  { type: "error", name: "Unauthorized", inputs: [] },
  { type: "error", name: "InvalidAddress", inputs: [] },
  { type: "error", name: "InvalidAmount", inputs: [] },
  { type: "error", name: "TransferFailed", inputs: [] },
  { type: "error", name: "EmptyBatch", inputs: [] },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
