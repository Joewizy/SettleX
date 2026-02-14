import type { EmailProvider } from "./types"
import { NodemailerProvider } from "./providers/nodemailer"

export type { EmailProvider, PaymentEmailData, EmailResult } from "./types"

let cachedProvider: EmailProvider | null = null

export async function getEmailProvider(): Promise<EmailProvider> {
  if (cachedProvider) return cachedProvider

  const provider = process.env.EMAIL_PROVIDER || "ethereal"

  switch (provider) {
    case "ethereal":
      cachedProvider = await NodemailerProvider.createEthereal()
      break

    case "mailtrap":
      cachedProvider = new NodemailerProvider({
        host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: parseInt(process.env.EMAIL_PORT || "2525"),
        auth: {
          user: process.env.EMAIL_USER || "",
          pass: process.env.EMAIL_PASS || "",
        },
      })
      break

    case "smtp":
      cachedProvider = new NodemailerProvider({
        host: process.env.EMAIL_HOST || "",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        auth: {
          user: process.env.EMAIL_USER || "",
          pass: process.env.EMAIL_PASS || "",
        },
      })
      break

    default:
      // Default to Ethereal for hackathon/dev — zero config needed
      cachedProvider = await NodemailerProvider.createEthereal()
  }

  return cachedProvider
}
