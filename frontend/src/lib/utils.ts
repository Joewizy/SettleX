import { Address, toHex, formatUnits, keccak256 } from "viem";

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function formatCurrencyShort(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to convert string to bytes32
export function stringToBytes32(str: string): `0x${string}` {
  const hex = Buffer.from(str.slice(0, 32), 'utf8').toString('hex');
  return `0x${hex.padEnd(64, '0')}`;
}

// Generate unique batch ID
export function generateBatchId(employerAddress: Address): `0x${string}` {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(7);
  const data = `${employerAddress}${timestamp}${nonce}`;
  return keccak256(toHex(data));
}

/**
 * Calculate transaction fee from receipt data
 * Fee = gasUsed × effectiveGasPrice
 */
export function calculateTransactionFee(
  gasUsed: bigint,
  effectiveGasPrice: bigint,
  decimals: number = 18
): {
  feeInWei: bigint;
  feeInTokens: string;
  feeFormatted: string;
} {
  // Calculate fee in wei
  const feeInWei = gasUsed * effectiveGasPrice;

  // Convert to token units
  const feeInTokens = formatUnits(feeInWei, decimals);

  // Format for display (4 decimal places)
  const feeFormatted = parseFloat(feeInTokens).toFixed(6);

  return {
    feeInWei,
    feeInTokens,
    feeFormatted,
  };
}

/**
 * Calculate gas cost in USD
 * Assumes 1 PathUSD = 1 USD (stablecoin)
 */
export function calculateGasCostUsd(
  gasUsed: bigint,
  effectiveGasPrice: bigint
): string {
  const fee = calculateTransactionFee(gasUsed, effectiveGasPrice);
  
  // For stablecoins, 1 token = 1 USD
  const costUsd = parseFloat(fee.feeInTokens);
  
  return costUsd.toFixed(6);
}
