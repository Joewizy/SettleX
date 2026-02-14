import { useState } from 'react'
import { client } from '@/lib/wagmi'
import { Address, parseUnits, encodeFunctionData } from 'viem'
import { TOKEN_LIST, STABLECOIN_DEX_ADDRESS, TOKENS } from "@/lib/constants";
import { stringToBytes32, generateBatchId, calculateTransactionFee } from "@/lib/utils";
import { SETTLEX_ABI, SETTLEX_ADDRESS, STABLECOIN_DEX_ABI, ERC20_ABI } from '@/abi';
import { sendPaymentEmails } from '@/lib/email/client';

export interface BatchPayment {
  employee: Address
  amount: string
  memo: string
  name: string
  email: string
  currency: string
}

function getTokenAddress(symbol: string): Address {
  const token = TOKENS[symbol]
  return token?.address ?? TOKENS.pathUSD.address
}

// 1% slippage for stablecoin-to-stablecoin swaps
function applySlippage(amount: bigint): bigint {
  return (amount * 99n) / 100n
}

export function useBatch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any>(null)

  const sendBatchPayment = async (
    payments: BatchPayment[],
    tokenAddress?: Address,
    autoSwapEnabled: boolean = false
  ) => {
    setLoading(true)
    setError(null)
    setReceipt(null)

    if (!tokenAddress) {
      tokenAddress = TOKEN_LIST[0].address
    }

    try {
      const payEmployeeFunction = SETTLEX_ABI.find(
        (fn): fn is typeof fn & { name: string; type: 'function' } =>
          fn.type === 'function' && fn.name === 'payEmployee'
      )

      if (!payEmployeeFunction) {
        throw new Error('payEmployee function not found in ABI')
      }

      const recordBatchFunction = SETTLEX_ABI.find(
        (fn): fn is typeof fn & { name: string; type: 'function' } =>
          fn.type === 'function' && fn.name === 'recordBatchPayroll'
      )

      if (!recordBatchFunction) {
        throw new Error('recordBatchPayroll function not found in ABI')
      }

      let calls: { to: Address; data: `0x${string}` }[] = []

      if (autoSwapEnabled) {
        // ── Auto-Swap Flow ──────────────────────────────────────────
        // Group payments by whether they need a swap
        const directPayments: BatchPayment[] = []
        const swapGroups = new Map<string, { tokenOut: Address; totalAmount: bigint; payments: BatchPayment[] }>()

        for (const payment of payments) {
          const targetAddress = getTokenAddress(payment.currency)
          if (targetAddress.toLowerCase() === tokenAddress!.toLowerCase()) {
            directPayments.push(payment)
          } else {
            const key = targetAddress.toLowerCase()
            const amount = parseUnits(payment.amount, 6)
            const existing = swapGroups.get(key)
            if (existing) {
              existing.totalAmount += amount
              existing.payments.push(payment)
            } else {
              swapGroups.set(key, { tokenOut: targetAddress, totalAmount: amount, payments: [payment] })
            }
          }
        }

        // Calculate total amount needing swap
        const totalSwapAmount = Array.from(swapGroups.values()).reduce((sum, g) => sum + g.totalAmount, 0n)
        const totalDirectAmount = directPayments.reduce((sum, p) => sum + parseUnits(p.amount, 6), 0n)

        // 1. Approve source token to DEX for swaps
        if (totalSwapAmount > 0n) {
          calls.push({
            to: tokenAddress!,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [STABLECOIN_DEX_ADDRESS, totalSwapAmount]
            })
          })
        }

        // 2. Execute swaps (grouped by target token)
        for (const [, group] of swapGroups) {
          const minAmountOut = applySlippage(group.totalAmount)

          calls.push({
            to: STABLECOIN_DEX_ADDRESS,
            data: encodeFunctionData({
              abi: STABLECOIN_DEX_ABI,
              functionName: 'swapExactAmountIn',
              args: [tokenAddress!, group.tokenOut, group.totalAmount, minAmountOut]
            })
          })
        }

        // 3. Approve swapped tokens to SettleX contract
        for (const [, group] of swapGroups) {
          calls.push({
            to: group.tokenOut,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [SETTLEX_ADDRESS, group.totalAmount]
            })
          })
        }

        // 4. Approve source token to SettleX for direct payments
        if (totalDirectAmount > 0n) {
          calls.push({
            to: tokenAddress!,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [SETTLEX_ADDRESS, totalDirectAmount]
            })
          })
        }

        // 5. Pay all employees with their preferred token
        for (const payment of payments) {
          const amountWei = parseUnits(payment.amount, 6)
          const memoBytes32 = stringToBytes32(payment.memo)
          const paymentToken = getTokenAddress(payment.currency)

          calls.push({
            to: SETTLEX_ADDRESS,
            data: encodeFunctionData({
              abi: [payEmployeeFunction],
              functionName: 'payEmployee',
              args: [payment.employee, amountWei, paymentToken, memoBytes32]
            })
          })
        }
      } else {
        // ── Standard Flow (no swap) ─────────────────────────────────
        calls = payments.map(payment => {
          const amountWei = parseUnits(payment.amount, 6)
          const memoBytes32 = stringToBytes32(payment.memo)

          const calldata = encodeFunctionData({
            abi: [payEmployeeFunction],
            functionName: 'payEmployee',
            args: [payment.employee, amountWei, tokenAddress, memoBytes32]
          })

          return { to: SETTLEX_ADDRESS, data: calldata }
        })
      }

      // Send batch transaction
      const txStartTime = Date.now()
      const transactionReceipt = await client.sendTransactionSync({
        calls: calls
      })

      setReceipt(transactionReceipt)

      const endTime = Date.now()
      const settlementTime = ((endTime - txStartTime) / 1000).toFixed(1)

      const transactionFee = calculateTransactionFee(
        transactionReceipt.gasUsed,
        transactionReceipt.effectiveGasPrice || BigInt(20000000002n)
      )

      // Only return batch result if transaction was successful
      if (transactionReceipt.status === 'success') {

        const batchResult = {
          batchTxHash: transactionReceipt.transactionHash,
          blockNumber: transactionReceipt.blockNumber,
          gasUsed: transactionReceipt.gasUsed,
          transactionFee: transactionFee.feeFormatted,
          settlementTime: `${settlementTime}s`,
          status: transactionReceipt.status
        }

        try {
          // Calculate total amount and employee count
          const totalAmount = payments.reduce((sum, payment) =>
            sum + parseUnits(payment.amount, 6), BigInt(0)
          )
          const employeeCount = payments.length

          // Generate batch ID (using first employee as example)
          const batchId = generateBatchId(payments[0].employee)

          // Add recordBatchPayroll call
          const recordCalldata = encodeFunctionData({
            abi: [recordBatchFunction],
            functionName: 'recordBatchPayroll',
            args: [batchId, tokenAddress, totalAmount, BigInt(employeeCount)]
          })

          const recordReceipt = await client.sendTransactionSync({
            calls: [{
              to: SETTLEX_ADDRESS,
              data: recordCalldata
            }]
          })

          console.log('Batch recorded:', recordReceipt)
        } catch (recordError) {
          console.log('Batch recording failed, but payment was successful:', recordError)
        }

        // Send payment notification emails (fire-and-forget, don't block the UI)
        sendPaymentEmails(payments, batchResult).catch((emailError) => {
          console.log('Email notifications failed, but payment was successful:', emailError)
        })

        return batchResult
      } else {
        return {
          batchTxHash: transactionReceipt.transactionHash,
          blockNumber: transactionReceipt.blockNumber,
          gasUsed: transactionReceipt.gasUsed,
          transactionFee: transactionFee.feeFormatted,
          settlementTime: `${settlementTime}s`,
          status: transactionReceipt.status
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch payment failed'
      setError(errorMessage)
      console.error('Batch payment failed:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    sendBatchPayment,
    loading,
    error,
    receipt
  }
}
