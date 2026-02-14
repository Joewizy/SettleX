# SettleX - Cross-Border Payroll on Tempo

**"20 employees. 8 countries. 1 transaction. Under a second. Less than a penny."**

---

## The Problem

Distributed teams are now the **default** for tech companies, DAOs, and Web3 organizations. A startup in SF might have engineers in Nigeria, designers in Portugal, a product manager in Singapore, and contractors across Latin America.

**Paying these people is an operational nightmare.**

### Current Pain Points

| Issue | Impact | Annual Cost (20-person team) |
|-------|--------|------------------------------|
| **Wire Transfer Fees** | $25-50 per payment | $6,000-$12,000 |
| **FX Margins** | 1-3% markup on conversions | $3,000-$8,000 |
| **Settlement Delay** | 3-5 business days | 60 hours of waiting |
| **Partial Failures** | Individual wires can fail | Incomplete payroll, angry employees |
| **Zero Transparency** | Payments disappear into SWIFT | Support tickets, confusion |

**Total Annual Friction: $9K-20K + countless hours of operational overhead**

---

## The SettleX Solution

SettleX is a **cross-border payroll platform** built on Tempo that uses blockchain rails to settle employee payments in stablecoins — atomically, instantly, and for fractions of a penny.

### SettleX vs Traditional Banking

| Dimension | Traditional Banking | SettleX on Tempo |
|-----------|-------------------|------------------|
| **Cost** | $25-50/wire x 20 = $500-1000 | ~$0.001 total |
| **Settlement** | 3-5 business days | <1 second finality |
| **Atomicity** | Individual wires (partial failures) | All-or-nothing batch |
| **Transparency** | Opaque, no tracking | On-chain tx hash, real-time |
| **Operating Hours** | Bank hours only | 24/7/365 |
| **Currency** | USD only, bank FX rate | pathUSD, AlphaUSD, BetaUSD, ThetaUSD via DEX |

**Monthly Savings:** $495-1000 in fees + 5 days of waiting eliminated
**Annual Savings:** $6K-12K + 60 hours of employee waiting time

---

## Why Tempo?

SettleX leverages Tempo-specific features that make it **impossible to build on other chains**:

### 1. Atomic Batch Transactions
Pay 20 employees in **ONE transaction**. All succeed or all fail — no partial payroll disasters. We use `client.sendTransactionSync({ calls: [...] })` to bundle approve + swap + pay operations atomically.

### 2. TIP-20 Transfer Memos
Every payment carries a `bytes32` memo (`PAYROLL-2025-01`, `INV-001`) directly on-chain. Built-in reconciliation for accountants — no external databases needed.

### 3. Stablecoin DEX Integration
Auto-swap between stablecoins via Tempo's native DEX (`0xDEc0...`). Employer holds pathUSD, employees get paid in their preferred currency (AlphaUSD, BetaUSD, ThetaUSD) — all in the same atomic batch.

### 4. Stablecoin Gas Fees
Transaction fees paid in stablecoins. No ETH or native token volatility risk. Employers and employees operate entirely in stable value.

### 5. Sub-Second Finality
Employees see funds immediately. No "3-5 business days" excuses.

---

## How It Works

### End-to-End Payroll Flow

```
1. Employer adds team (manual or CSV bulk upload)
   |
2. Select employees for payroll batch
   |
3. Review amounts & preferred currencies per employee
   |
4. SettleX builds atomic batch transaction:
   - Approve source token to DEX
   - Swap to each employee's preferred stablecoin
   - Approve swapped tokens to SettleX contract
   - Execute payEmployee() for each recipient with memo
   |
5. Single transaction broadcast to Tempo
   |
6. <1 second: All employees paid simultaneously
   |
7. On-chain confirmation + email notifications sent
   |
8. Employer stats & history updated in real-time
```

### Technical Architecture

```
Frontend Dashboard (Next.js + Wagmi + RainbowKit)
         |
         v
Hooks Layer (usePayment -> useBatch -> useSettleX)
         |
         v
SettleX Smart Contract (Solidity + TIP-20)
    |              |
    v              v
Tempo DEX       TIP-20 Tokens
(auto-swap)    (pathUSD, AlphaUSD, BetaUSD, ThetaUSD)
         |
         v
Employee Wallets (instant receipt)
         |
         v
Email Notifications (Nodemailer)
```

---

## Key Features

### Atomic Batch Payments
Pay unlimited employees in a single transaction. All succeed or all fail — no partial payroll. Approvals, swaps, and payments bundled atomically.

### Auto-Swap Multi-Currency
Each employee sets their preferred stablecoin. SettleX automatically routes through Tempo's native DEX to convert the employer's source token to each employee's preferred currency — all within the same batch transaction.

### Transfer Memos for Reconciliation
Every payment includes an on-chain `bytes32` memo (e.g., `Payment to Alice`, invoice IDs, payroll periods). Emitted in `PaymentExecuted` events for accounting reconciliation.

### CSV Bulk Import
Upload a CSV file to add employees in bulk. Drag-and-drop interface with validation, preview table, and sample CSV download. Supports columns: name, email, country, wallet, currency, amount.

### On-Chain Analytics
Real-time employer statistics read directly from the smart contract:
- Total paid across all tokens with per-token breakdown
- Payment count and authorization status
- Global payment counter

### Payment History
All payroll runs saved locally with tx hash, block number, gas cost, settlement time, and employee count. Clickable links to Tempo Explorer for verification.

### Email Notifications
Automatic email notifications sent to employees after successful payment. Includes amount, tx hash, block number, and settlement time. Supports Ethereal (test), Mailtrap, and custom SMTP.

### Employer Access Control
Role-based authorization — only the contract owner can authorize employers. Authorized employers can execute payments and record batch payrolls.

---

## Project Structure

```
settlex/
|
|-- src/
|   +-- SettleX.sol                  # Core payroll smart contract
|
|-- script/
|   +-- DeploySettleX.s.sol          # Foundry deployment script
|
|-- test/
|   +-- SettleXTest.t.sol            # Comprehensive test suite (fuzz tests included)
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- page.tsx             # Main app entry point
|   |   |   |-- layout.tsx           # Root layout with providers
|   |   |   +-- api/
|   |   |       +-- send-payment-email/
|   |   |           +-- route.ts     # Email notification API endpoint
|   |   |
|   |   |-- components/
|   |   |   |-- dashboard/
|   |   |   |   +-- Dashboard.tsx    # Stats, quick actions, recent payments
|   |   |   |-- payroll/
|   |   |   |   |-- PayrollWizard.tsx    # 3-step payroll wizard
|   |   |   |   |-- PayrollReview.tsx    # Step 1: Review batch & amounts
|   |   |   |   |-- PayrollConfirm.tsx   # Step 2: Approve & confirm
|   |   |   |   |-- PayrollSettlement.tsx # Step 3: Settlement progress
|   |   |   |   |-- StepIndicator.tsx    # Wizard step indicator
|   |   |   |   +-- AddToBatchModal.tsx  # Add employee to current batch
|   |   |   |-- team/
|   |   |   |   |-- TeamPage.tsx         # Employee management table
|   |   |   |   |-- AddEmployeeModal.tsx # Add single employee form
|   |   |   |   +-- CsvUploadModal.tsx   # CSV bulk import with drag-and-drop
|   |   |   |-- history/
|   |   |   |   +-- HistoryPage.tsx      # Payment history with filters
|   |   |   |-- batch/
|   |   |   |   +-- BatchPage.tsx        # Batch processing queue
|   |   |   |-- layout/
|   |   |   |   +-- Sidebar.tsx          # Top navigation bar
|   |   |   |-- wallet/
|   |   |   |   +-- WalletBalance.tsx    # Connected wallet display
|   |   |   +-- ui/
|   |   |       |-- Avatar.tsx           # Employee avatar component
|   |   |       |-- StatCard.tsx         # Dashboard stat card
|   |   |       +-- StatusBadge.tsx      # Status indicator badge
|   |   |
|   |   |-- hooks/
|   |   |   |-- useAppState.ts       # App state (navigation, team, payroll, history)
|   |   |   |-- usePayment.ts        # Payment orchestration (single + batch)
|   |   |   |-- useBatch.ts          # Batch transaction builder (approve + swap + pay)
|   |   |   |-- useSettleX.ts        # Contract reads/writes + on-chain stats
|   |   |   |-- useSwap.ts           # Swap grouping logic for multi-currency
|   |   |   +-- useToken.ts          # Token approval & balance management
|   |   |
|   |   |-- lib/
|   |   |   |-- constants.ts         # Token addresses, seed data, config
|   |   |   |-- types.ts             # TypeScript type definitions
|   |   |   |-- utils.ts             # Utility functions (formatting, bytes32)
|   |   |   |-- wagmi.ts             # Wagmi + Viem client configuration
|   |   |   +-- email/
|   |   |       |-- client.ts        # Email sending client
|   |   |       |-- template.ts      # HTML email templates
|   |   |       |-- types.ts         # Email type definitions
|   |   |       +-- providers/
|   |   |           +-- nodemailer.ts # Nodemailer SMTP provider
|   |   |
|   |   |-- abi/
|   |   |   +-- index.ts             # Contract ABIs (SettleX, ERC20, DEX)
|   |   |
|   |   +-- providers/
|   |       +-- Web3Provider.tsx      # Wagmi + RainbowKit provider setup
|   |
|   +-- .env.example                 # Environment variable template
|
|-- foundry.toml                     # Foundry configuration
+-- README.md
```

---

## Smart Contract

**Deployed:** `0x079c4dFC2B330F720A29FDea2cD5C920606b13c8` on Tempo Moderato Testnet

### Core Functions

| Function | Description |
|----------|-------------|
| `payEmployee(address, uint256, ITIP20, bytes32)` | Pay single employee with TIP-20 token and memo |
| `recordBatchPayroll(bytes32, ITIP20, uint256, uint256)` | Record batch summary event after atomic batch |
| `authorizeEmployer(address)` | Owner authorizes an employer address |
| `revokeEmployer(address)` | Owner revokes employer authorization |
| `getEmployerStats(address)` | View total paid, count, authorization status |
| `getEmployerTokenStats(address, ITIP20)` | View per-token payment totals |

### Events

| Event | Emitted When |
|-------|-------------|
| `PaymentExecuted(employer, employee, amount, token, memo)` | Each employee payment |
| `BatchPayrollExecuted(employer, batchId, token, totalAmount, employeeCount)` | Batch summary recorded |
| `EmployerAuthorized(employer)` | New employer authorized |
| `EmployerRevoked(employer)` | Employer access revoked |

---

## Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

### Smart Contract

```bash
# Install dependencies
forge install

# Run tests
forge test -vvv

# Run with gas report
forge test --gas-report

# Run fuzz tests
forge test --match-test testFuzz

# Deploy to Tempo Testnet
forge script script/DeploySettleX.s.sol:DeploySettleX \
    --rpc-url https://rpc.moderato.tempo.xyz \
    --broadcast \
    --verify
```

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Add your NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Add your NEXT_PUBLIC_PRIVATE_KEY (employer wallet)

# Run dev server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_PRIVATE_KEY=0x...  # Employer wallet private key

# Email (optional, defaults to Ethereal test service)
EMAIL_PROVIDER=ethereal  # ethereal | mailtrap | smtp
# EMAIL_HOST=sandbox.smtp.mailtrap.io
# EMAIL_PORT=2525
# EMAIL_USER=your_user
# EMAIL_PASS=your_pass
```

---

## Tempo-Specific Integration

### Tokens Used

| Token | Address | Role |
|-------|---------|------|
| pathUSD | `0x20c0000000000000000000000000000000000000` | DEX quote token, default payment |
| AlphaUSD | `0x20c0000000000000000000000000000000000001` | Employee preferred currency |
| BetaUSD | `0x20c0000000000000000000000000000000000002` | Employee preferred currency |
| ThetaUSD | `0x20c0000000000000000000000000000000000003` | Employee preferred currency |

### Tempo Features Leveraged

| Feature | How We Use It |
|---------|---------------|
| **Atomic Batch Transactions** | Bundle approve + swap + pay in single tx via `sendTransactionSync({ calls })` |
| **TIP-20 Transfer Memos** | `bytes32` memos on every payment for reconciliation |
| **Stablecoin DEX** | Auto-swap between stablecoins via `swapExactAmountIn` |
| **Stablecoin Gas Fees** | Transaction fees paid in stablecoins, no native token needed |
| **Sub-Second Finality** | Payments confirmed in <1 second |
| **ITIP20 Standard** | `transferFromWithMemo` for memo-attached payments |

### Key Addresses

| Contract | Address |
|----------|---------|
| **SettleX** | `0x079c4dFC2B330F720A29FDea2cD5C920606b13c8` |
| **Stablecoin DEX** | `0xDEc0000000000000000000000000000000000000` |

---

## Real-World Use Case

### Web3 Startup (20 employees, 8 countries)

**Before SettleX:**
- 20 wire transfers x $30 = $600/month in fees
- Employees wait 4-7 days for funds (especially Nigeria, Philippines)
- $800/month lost to FX margins
- Partial failures leave 3 employees unpaid

**With SettleX:**
- 1 atomic batch transaction = ~$0.001
- Funds arrive in <1 second
- Each employee paid in their preferred stablecoin
- All-or-nothing — no partial payroll disasters
- On-chain memo trail for accounting

**Monthly savings: $1,400 | Annual savings: $16,800**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contract** | Solidity ^0.8.13, Foundry, OpenZeppelin, tempo-std |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Web3** | Wagmi, Viem, RainbowKit, tempoModerato chain |
| **Email** | Nodemailer (Ethereal/Mailtrap/SMTP) |
| **Testing** | Foundry (unit + fuzz tests) |

---

## Resources

- [Tempo Docs](https://docs.tempo.xyz/)
- [TIP-20 Standard](https://docs.tempo.xyz/protocol/tip20/overview)
- [Batch Transactions Guide](https://docs.tempo.xyz/guide/payments/send-a-payment)
- [Stablecoin DEX](https://docs.tempo.xyz/protocol/exchange)
- [Tempo Explorer](https://explore.tempo.xyz/)

---

## License

MIT

---

Built for distributed teams everywhere, on Tempo.

**20 employees. 8 countries. 1 transaction. Under a second. Less than a penny.**
