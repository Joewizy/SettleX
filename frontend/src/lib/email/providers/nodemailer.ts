import nodemailer from "nodemailer"
import type { EmailProvider, PaymentEmailData, EmailResult } from "../types"
import { buildPaymentEmailHtml, buildPaymentEmailText } from "../template"

export class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter

  constructor(config: {
    host: string
    port: number
    auth: { user: string; pass: string }
  }) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: config.auth,
    })
  }

  async sendPaymentNotification(data: PaymentEmailData): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: '"SettleX Payroll" <payroll@settlex.io>',
        to: data.recipientEmail,
        subject: `Payment Received: ${data.amount} ${data.currency}`,
        text: buildPaymentEmailText(data),
        html: buildPaymentEmailHtml(data),
      })

      const previewUrl = nodemailer.getTestMessageUrl(info)

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl || undefined,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }
    }
  }

  static async createEthereal(): Promise<NodemailerProvider> {
    const testAccount = await nodemailer.createTestAccount()
    return new NodemailerProvider({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }
}
