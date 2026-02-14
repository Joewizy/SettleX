import type { PaymentEmailData } from "./types"

export function buildPaymentEmailHtml(data: PaymentEmailData): string {
  const truncatedWallet = `${data.recipientWallet.slice(0, 6)}...${data.recipientWallet.slice(-4)}`
  const truncatedTx = `${data.txHash.slice(0, 10)}...${data.txHash.slice(-6)}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SettleX</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Payment Confirmation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#18181b;font-size:18px;font-weight:600;">
                Hi ${data.recipientName},
              </p>
              <p style="margin:0 0 24px;color:#3f3f46;font-size:15px;line-height:1.6;">
                Your salary has been paid. The funds have been sent to your wallet and the transaction is confirmed on-chain.
              </p>

              <!-- Amount Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 4px;color:#15803d;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Amount Received</p>
                    <p style="margin:0;color:#15803d;font-size:32px;font-weight:700;">${data.amount} ${data.currency}</p>
                  </td>
                </tr>
              </table>

              <!-- Transaction Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 16px;color:#18181b;font-size:14px;font-weight:600;">Transaction Details</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#71717a;font-size:13px;">Wallet</td>
                        <td style="padding:6px 0;color:#18181b;font-size:13px;text-align:right;font-family:monospace;">${truncatedWallet}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#71717a;font-size:13px;">Transaction</td>
                        <td style="padding:6px 0;color:#18181b;font-size:13px;text-align:right;font-family:monospace;">${truncatedTx}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#71717a;font-size:13px;">Block</td>
                        <td style="padding:6px 0;color:#18181b;font-size:13px;text-align:right;">#${data.blockNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#71717a;font-size:13px;">Settlement Time</td>
                        <td style="padding:6px 0;color:#18181b;font-size:13px;text-align:right;">${data.settlementTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#71717a;font-size:13px;">Date</td>
                        <td style="padding:6px 0;color:#18181b;font-size:13px;text-align:right;">${data.paidAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;">
                This is an automated notification from SettleX. If you have any questions about this payment, please contact your employer.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">
                Powered by SettleX &mdash; Cross-border payroll on Tempo
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildPaymentEmailText(data: PaymentEmailData): string {
  return `Hi ${data.recipientName},

Your salary has been paid. The funds have been sent to your wallet and the transaction is confirmed on-chain.

Amount Received: ${data.amount} ${data.currency}

Transaction Details:
- Wallet: ${data.recipientWallet}
- Transaction: ${data.txHash}
- Block: #${data.blockNumber}
- Settlement Time: ${data.settlementTime}
- Date: ${data.paidAt}

This is an automated notification from SettleX.
Powered by SettleX - Cross-border payroll on Tempo`
}
