<div align="center">
  <img src="https://cryptologos.cc/logos/avalanche-avax-logo.png?v=025" width="80" alt="Avalanche Logo" />
  <h1>Talk to DeFi 🗣️💹</h1>
  <p><strong>Plain English goes in. Verified, autonomous DeFi execution comes out.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Network-Avalanche_Fuji-red" alt="Avalanche Fuji" />
    <img src="https://img.shields.io/badge/Bounty-ERC--8004_Identity-blue" alt="ERC-8004" />
    <img src="https://img.shields.io/badge/Bounty-x402_Agentic_Payments-green" alt="x402" />
    <img src="https://img.shields.io/badge/AI-Claude_3.5_Sonnet-purple" alt="Claude AI" />
  </p>
</div>

<br/>

## 🎯 The Vision
Navigating Decentralized Finance is complicated. Users have to manually compare yields across multiple protocols, calculate bridging fees, manage infinite approvals, and sign complex transactions. It is a massive barrier to entry.

**Talk to DeFi** solves this by abstracting the entire DeFi experience into a conversational interface. You state your financial intent (*"Swap 0.05 AVAX for USDC and supply it for yield"*), and an autonomous, on-chain AI agent executes it on your behalf.

---

## ✨ Key Features & Hackathon Bounties

We built this project specifically for the **Speedrun June 2026** hackathon, successfully integrating three major agentic primitives:

1. 🧠 **Claude AI Intent Parsing:**
   We utilize `claude-3-5-sonnet` with strict tool calling to parse chaotic human natural language into precise, structured JSON objects representing financial actions (e.g., `SWAP`, `SUPPLY`), amounts, and risk tolerances.
   
2. 🪪 **ERC-8004 Agent Identity & Reputation:**
   Our agent doesn't just use an anonymous wallet. It holds a verified **ERC-8004 Identity NFT**. Every time the agent executes a successful transaction for a user, the protocol securely writes positive feedback to the on-chain Reputation Registry, building trust.

3. 💸 **x402 Agentic Micro-Payments:**
   Before the agent routes your funds, it needs live market data. Our agent autonomously pays a micro-invoice over HTTP using the **x402 Payment Protocol** to an external oracle. It buys real-time APY rates (BENQI, Aave, Yield Yak) using its own balance, ensuring it routes your funds to the most profitable protocol.

---

## 🏗 Architecture Workflow

```mermaid
graph TD
    User([User]) -->|1. Type Intent| UI["Next.js Frontend"]
    UI -->|2. POST /api/intent| Agent["Claude 3.5 Sonnet"]
    
    subgraph "Execution Engine (Node.js)"
        Agent -->|3. Route intent| Router{"DeFi Router"}
        Router -->|4. Buy Data (x402)| Oracle["x402 Data Oracle"]
        Oracle -->|5. Return Live APY| Router
    end
    
    subgraph "Avalanche C-Chain (Fuji)"
        Router -->|6. Execute Tx| Protocol["LFJ / BENQI / Aave"]
        Protocol -->|7. Update Agent Score| ERC8004["ERC-8004 Reputation Registry"]
    end
```

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), React, CSS Modules, RainbowKit, Wagmi
- **Smart Contracts:** Solidity, Hardhat, Ethers.js v6
- **Blockchain:** Avalanche C-Chain (Fuji Testnet)
- **AI:** Anthropic Claude API
- **Data Indexing:** Avalanche Glacier API

---

## 🚀 Getting Started (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/ShivamSoni20/Talk-To-Defi.git
cd Talk-To-Defi/frontend
npm install
```

### 2. Environment Variables
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```
You will need:
- An **Anthropic API Key** (`ANTHROPIC_API_KEY`)
- An **Avalanche Glacier API Key** (`NEXT_PUBLIC_GLACIER_API_KEY`)
- A **WalletConnect Project ID** (`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`)
- A funded private key for the agent (`AGENT_PRIVATE_KEY`)

### 3. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Connect your wallet, launch the dashboard, and type your first intent!

### 4. Vercel Deployment Troubleshooting
If you deploy this project to Vercel and encounter a `Module not found: Can't resolve '@react-native-async-storage/async-storage'` or `pino-pretty` error during the build process, you need to update your `frontend/next.config.mjs` to ignore these optional WalletConnect dependencies. 

Add the following to your `frontend/next.config.mjs`:
```javascript
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding', '@react-native-async-storage/async-storage');
    return config;
  },
};
export default nextConfig;
```

---

## 📂 Repository Structure

```text
Talk-To-Defi/
├── contracts/                  # Hardhat project for Smart Contracts
│   ├── contracts/
│   │   ├── MockBENQI.sol       # Mock Lending Market
│   │   ├── MockERC8004.sol     # Agent Identity & Reputation Registry
│   │   ├── MockLFJRouter.sol   # Mock AMM (Trader Joe)
│   │   └── MockUSDC.sol        # Testnet USDC
│   └── scripts/
│       └── deploy.ts           # Fuji Testnet Deployment Script
│
├── frontend/                   # Next.js Application
│   ├── app/
│   │   ├── api/                # Next.js API Routes (Agent, x402)
│   │   └── dashboard/          # Conversational Dashboard UI
│   ├── components/             # React Components (ChatWindow, Portfolio, History)
│   └── lib/                    # Core Logic
│       ├── claude.ts           # Anthropic API Wrapper
│       ├── defi-router.ts      # Multi-step Agent Routing Engine
│       ├── erc8004.ts          # Identity Management
│       └── x402-client.ts      # x402 Payment Client
```

---

<div align="center">
  <p>Built with ❤️ for <strong>Team1 India</strong></p>
</div>
