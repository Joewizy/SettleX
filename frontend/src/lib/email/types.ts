export interface PaymentEmailData {
  recipientEmail: string
  recipientName: string
  recipientWallet: string
  amount: string
  currency: string
  txHash: string
  blockNumber: string
  settlementTime: string
  paidAt: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  previewUrl?: string | false
  error?: string
}

export interface EmailProvider {
  sendPaymentNotification(data: PaymentEmailData): Promise<EmailResult>
}
