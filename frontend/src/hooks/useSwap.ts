import { useCallback } from 'react'
import { type Address, parseUnits } from 'viem'
import { TOKENS } from '@/lib/constants'
import type { BatchPayment } from './useBatch'

export interface SwapGroup {
  tokenOut: Address
  tokenOutSymbol: string
  totalAmount: bigint
  payments: BatchPayment[]
}

export interface SwapBreakdown {
  swaps: SwapGroup[]
  directPayments: BatchPayment[]
  totalSwapAmount: bigint
  totalDirectAmount: bigint
}

function getTokenAddress(symbol: string): Address {
  const token = TOKENS[symbol]
  return token?.address ?? TOKENS.pathUSD.address
}

export function useSwap() {
  const getSwapBreakdown = useCallback(
    (payments: BatchPayment[], sourceTokenSymbol: string): SwapBreakdown => {
      const sourceAddress = getTokenAddress(sourceTokenSymbol)
      const directPayments: BatchPayment[] = []
      const swapMap = new Map<string, SwapGroup>()

      for (const payment of payments) {
        const targetAddress = getTokenAddress(payment.currency)

        if (targetAddress.toLowerCase() === sourceAddress.toLowerCase()) {
          directPayments.push(payment)
        } else {
          const key = targetAddress.toLowerCase()
          const existing = swapMap.get(key)
          const amount = parseUnits(payment.amount, 6)

          if (existing) {
            existing.totalAmount += amount
            existing.payments.push(payment)
          } else {
            swapMap.set(key, {
              tokenOut: targetAddress,
              tokenOutSymbol: payment.currency,
              totalAmount: amount,
              payments: [payment],
            })
          }
        }
      }

      const swaps = Array.from(swapMap.values())
      const totalSwapAmount = swaps.reduce((sum, s) => sum + s.totalAmount, 0n)
      const totalDirectAmount = directPayments.reduce(
        (sum, p) => sum + parseUnits(p.amount, 6),
        0n
      )

      return { swaps, directPayments, totalSwapAmount, totalDirectAmount }
    },
    []
  )

  return { getSwapBreakdown }
}
