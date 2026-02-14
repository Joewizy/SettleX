interface PaymentRecipientData {
  employee: string
  amount: string
  name: string
  email: string
  currency: string
}

interface BatchResult {
  batchTxHash: string
  blockNumber: bigint
  settlementTime: string
}

interface EmailApiResponse {
  success: boolean
  results: Array<{
    recipient: string
    success: boolean
    messageId?: string
    previewUrl?: string
    error?: string
  }>
}

export async function sendPaymentEmails(
  payments: PaymentRecipientData[],
  batchResult: BatchResult
): Promise<EmailApiResponse> {
  const recipients = payments.map((p) => ({
    email: p.email,
    name: p.name,
    wallet: p.employee,
    amount: p.amount,
    currency: p.currency,
  }))

  const res = await fetch("/api/send-payment-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipients,
      txHash: batchResult.batchTxHash,
      blockNumber: batchResult.blockNumber.toString(),
      settlementTime: batchResult.settlementTime,
    }),
  })

  const data: EmailApiResponse = await res.json()

  if (!res.ok) {
    console.error("Email API error:", data)
  } else {
    console.log("Payment emails sent:", data)
  }

  return data
}
