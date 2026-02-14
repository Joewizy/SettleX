import { NextResponse } from "next/server"
import { getEmailProvider } from "@/lib/email"
import type { PaymentEmailData } from "@/lib/email"

interface PaymentRecipient {
  email: string
  name: string
  wallet: string
  amount: string
  currency: string
}

interface RequestBody {
  recipients: PaymentRecipient[]
  txHash: string
  blockNumber: string
  settlementTime: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { recipients, txHash, blockNumber, settlementTime } = body

    if (!recipients?.length || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields: recipients, txHash" },
        { status: 400 }
      )
    }

    const emailProvider = await getEmailProvider()
    const paidAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })

    const results = await Promise.allSettled(
      recipients.map((recipient) => {
        const emailData: PaymentEmailData = {
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          recipientWallet: recipient.wallet,
          amount: recipient.amount,
          currency: recipient.currency,
          txHash,
          blockNumber,
          settlementTime,
          paidAt,
        }
        return emailProvider.sendPaymentNotification(emailData)
      })
    )

    const summary = results.map((result, i) => ({
      recipient: recipients[i].email,
      ...(result.status === "fulfilled"
        ? result.value
        : { success: false, error: result.reason?.message || "Unknown error" }),
    }))

    const allSucceeded = summary.every((s) => s.success)

    console.log(
      `[SettleX Email] Sent ${summary.filter((s) => s.success).length}/${recipients.length} emails.`,
      summary
        .filter((s) => 'previewUrl' in s && s.previewUrl)
        .map((s) => `Preview: ${'previewUrl' in s ? s.previewUrl : ''}`)
        .join("\n")
    )

    return NextResponse.json({
      success: allSucceeded,
      results: summary,
    })
  } catch (error) {
    console.error("[SettleX Email] Error:", error)
    return NextResponse.json(
      { error: "Failed to send payment emails" },
      { status: 500 }
    )
  }
}
