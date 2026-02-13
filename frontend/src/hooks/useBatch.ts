import { useState } from 'react'
import { client } from '@/lib/wagmi'
import { Address, parseUnits, encodeFunctionData, formatUnits } from 'viem'
import { TOKEN_LIST } from "@/lib/constants";
import { stringToBytes32, generateBatchId, calculateGasCostUsd, calculateTransactionFee } from "@/lib/utils";
import { SETTLEX_ABI, SETTLEX_ADDRESS } from '@/abi';

export interface BatchPayment {
  employee: Address
  amount: string
  memo: string
}

export function useBatch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any>(null)

  const sendBatchPayment = async (payments: BatchPayment[], tokenAddress?: Address) => {
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

      // Convert payments to calldata
      const calls = payments.map(payment => {
        const amountWei = parseUnits(payment.amount, 6)
        const memoBytes32 = stringToBytes32(payment.memo)
        
        // Encode function call
        const calldata = encodeFunctionData({
          abi: [payEmployeeFunction],
          args: [
            payment.employee, 
            amountWei, 
            tokenAddress, 
            memoBytes32
          ]
        })

        return {
          to: SETTLEX_ADDRESS,
          data: calldata
        }
      })

      // Send batch transaction
      const txStartTime = Date.now()
      const transactionReceipt = await client.sendTransactionSync({
        calls: calls
      })

      setReceipt(transactionReceipt)

      const endTime = Date.now()
      const settlementTime = ((endTime - txStartTime) / 1000).toFixed(1)
      const gasCostUsd = calculateGasCostUsd(
        transactionReceipt.gasUsed,
        transactionReceipt.effectiveGasPrice || BigInt(20000000002n)
      )
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