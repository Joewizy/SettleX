# SettleX - Cross-Border Payroll on Tempo 🌍💸

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

## ✨ The SettleX Solution

SettleX is a **cross-border payroll platform** built on Tempo that uses blockchain rails to settle employee payments in stablecoins.

### What You Get

| Dimension | Traditional Banking | SettleX on Tempo |
|-----------|-------------------|------------------|
| **Cost** | $25-50/wire × 20 = $500-1000 | ~$0.001 total |
| **Settlement** | 3-5 business days | <1 second finality |
| **Atomicity** | Individual wires (partial failures possible) | All-or-nothing batch |
| **Transparency** | Opaque, no tracking | On-chain tx hash, real-time |
| **Operating Hours** | Bank hours only | 24/7/365 |
| **Currency Flexibility** | USD only, bank decides FX rate | USDC, USDT, EURC via Tempo AMM |

**Monthly Savings:** $495-1000 in fees + 5 days of waiting eliminated  
**Annual Savings:** $6K-12K + 60 hours of employee waiting time  

---

## 🎯 Why Tempo?

SettleX is **only possible** on Tempo because of these chain-specific features:

1. **⚛️ Atomic Batch Transactions**  
   Pay 20 employees in ONE transaction. No partial payroll disasters.

2. **📝 TIP-20 Transfer Memos**  
   Attach invoice IDs, payroll periods, department codes directly to payments. Built-in reconciliation for accountants.

3. **🛣️ Payment Lanes**  
   Dedicated blockspace for payments. Your payroll never competes with DeFi degens for gas. Predictable fees always.

4. **💵 Stablecoin Gas Fees**  
   Pay transaction fees in **any stablecoin** (AlphaUSD, ThetaUSD). No need to hold ETH or native tokens which remove volatility risks.

5. **⚡ Sub-Second Finality**  
   Employees see funds immediately. No "3-5 business days" excuses.

---

## 🏗️ How It Works

### End-to-End Payroll Flow

```
1. Employer uploads payroll CSV
   ↓
2. SettleX validates amounts & addresses
   ↓
3. Build atomic batch transaction
   ↓
4. Broadcast to Tempo via Payment Lane
   ↓
5. <1 second: All employees paid simultaneously
   ↓
6. On-chain confirmation + notifications sent
```

### Technical Architecture

```
Frontend Dashboard (Next.js + Wagmi)
         ↓
API Layer (tRPC + Privy Auth)
         ↓
SettleX Smart Contract (Solidity)
         ↓
Tempo Blockchain (TIP-20 + Batch Transactions)
         ↓
Employees' Wallets (USDC/USDT received)
```

---

## 💡 Real-World Use Cases

### Use Case : Web3 Startup (15 employees, 8 countries)

**Before SettleX:**
- 15 wire transfers × $30 = $450/month in fees
- Employees wait 4-7 days for funds (especially Nigeria, Philippines)
- $600/month lost to FX margins

**With SettleX:**
- 1 batch transaction = $0.001
- Funds arrive in <1 second
- Transparent on-chain FX rates
- **Monthly savings: $1,050**

---

## 🚀 Quick Start

### Installation

```bash
# Clone repo
git clone <your-repo>
cd settlex

# Install dependencies
forge install

# Set up environment
cp .env.example .env
# Add your PRIVATE_KEY to .env
```

### Run Tests

```bash
# Run all tests
forge test -vvv

# Run with gas report
forge test --gas-report

# Run fuzz tests
forge test --match-test testFuzz
```

### Deploy to Tempo Testnet

```bash
# Deploy contract
forge script script/DeploySettleX.s.sol:DeploySettleX \
    --rpc-url https://rpc.testnet.tempo.xyz \
    --broadcast \
    --verify

# Authorize an employer
cast send <SETTLEX_ADDRESS> \
    "authorizeEmployer(address)" \
    <EMPLOYER_ADDRESS> \
    --rpc-url https://rpc.testnet.tempo.xyz \
    --private-key $PRIVATE_KEY
```

---

## 📊 Key Features

#### ✅ Atomic Batch Payments
- Pay unlimited employees in a single transaction. All succeed or all fail - no partial payroll.

####  ✅ Gas Token Flexibility
- Employers choose their gas token (AlphaUSD, ThetaUSD, etc.) at transaction time.

#### ✅ Transfer Memos
* Attach invoice IDs, payroll periods, department codes for accounting reconciliation.

#### ✅ Access Control
* Only owner can authorize employers. Role-based permissions for security.

#### ✅ Full Tracking
* On-chain history of every payment: who paid whom, how much, when, with what memo.

#### ✅ Multi-Stablecoin Support
* Pay employees in their preferred stablecoin (USDC, USDT, EURC).

---

## 📚 Project Structure

```
settlex/
├── src/
│   └── SettleX.sol              # Core payroll contract
├── script/
│   └── DeploySettleX.s.sol      # Deployment script
├── test/
│   └── SettleX.t.sol            # Comprehensive test suite
└── README.md                     # This file
```

---

## 📖 Resources

- [Tempo Docs](https://docs.tempo.xyz/)
- [TIP-20 Standard](https://docs.tempo.xyz/protocol/tip20/overview)
- [Batch Transactions Guide](https://docs.tempo.xyz/guide/payments/send-a-payment)
- [Foundry for Tempo](https://docs.tempo.xyz/quickstart/developer-tools)

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built with ❤️ on Tempo for distributed teams everywhere.

**20 employees. 8 countries. 1 transaction. Under a second. Less than a penny.**

*That's payroll on Tempo.*

