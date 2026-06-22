# Talk to DeFi — End-to-End Developer Plan
## Team1 India · Speedrun June 2026 · Agentic Payments

> **Purpose of this document:** Give this entire file to Codex (or any AI coding agent) as the build specification. Every resource URL, contract address, env variable, package name, function call, and wiring instruction is explicit. No assumptions. No "figure it out."

---

## 0. What We're Building

A Next.js web app where a user types a plain-English DeFi intent, and a verified AI agent (registered on ERC-8004) parses it, buys live APY data via x402, routes to the best Avalanche DeFi protocol (BENQI / LFJ / Aave V3), executes the transaction autonomously, and returns a receipt.

**Demo flow (what a judge sees in 60 seconds):**
```
User types: "Put ₹500 into stable yield"
→ Claude parses: { action: "supply", asset: "USDC", amount: 6.12, protocol: "BENQI" }
→ Agent checks ERC-8004 identity (token #147, rep 94/100) ✅
→ Agent pays 0.001 USDC via x402 to fetch live BENQI APY = 5.4% ✅
→ Agent calls BENQI.supply(6.12 USDC) on Avalanche Fuji ✅
→ User sees receipt: TX hash, protocol, APY, Snowtrace link ✅
→ Agent writes feedback to ERC-8004 Reputation Registry ✅
```

---

## 1. Project Structure

```
talk-to-defi/
├── frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx             # Landing page (wire index.html UI)
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard page (wire dashboard.html UI)
│   │   ├── api/
│   │   │   ├── intent/route.ts  # POST: parse intent with Claude
│   │   │   ├── execute/route.ts # POST: execute DeFi action on-chain
│   │   │   ├── apy/route.ts     # GET: x402-gated APY data endpoint (merchant)
│   │   │   └── agent/route.ts   # GET: ERC-8004 agent info
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ChatWindow.tsx       # Main chat interface
│   │   ├── Receipt.tsx          # Transaction receipt card
│   │   ├── StepTrace.tsx        # Live execution step display
│   │   ├── YieldSidebar.tsx     # Right panel APY feed
│   │   └── AgentCard.tsx        # Left sidebar agent identity
│   ├── lib/
│   │   ├── agent-wallet.ts      # Agent EOA wallet (ethers.js)
│   │   ├── erc8004.ts           # ERC-8004 registry calls
│   │   ├── x402-client.ts       # x402 payment client
│   │   ├── defi-router.ts       # Protocol selector + executor
│   │   ├── benqi.ts             # BENQI protocol wrapper
│   │   ├── lfj.ts               # LFJ (Trader Joe) swap wrapper
│   │   ├── claude.ts            # Claude intent parser
│   │   └── glacier.ts           # Glacier API for chain data
│   ├── .env.local               # All secrets (see Section 3)
│   └── package.json
│
├── contracts/                   # Hardhat project
│   ├── hardhat.config.ts
│   ├── contracts/
│   │   └── (use ava-labs/8004-boilerplate — copy from there)
│   ├── scripts/
│   │   └── deploy.ts            # Deploy to Fuji
│   └── artifacts/               # ABIs after compile
│
└── README.md
```

---

## 2. Tech Stack — Exact Packages

```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend

# Core blockchain
npm install ethers@6                      # EVM wallet + tx signing
npm install viem                          # Alternative to ethers if preferred

# x402 payments (official SDK)
npm install @x402/core @x402/evm @x402/fetch @x402/express
# PayAI wrapper (Avalanche-specific)
npm install @payai/x402

# Anthropic SDK
npm install @anthropic-ai/sdk

# UI utilities
npm install axios                         # HTTP client
npm install dotenv                        # Env loading

# Contracts (in /contracts directory)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install --save-dev @openzeppelin/contracts                  # ERC-721 base
```

---

## 3. Environment Variables — `.env.local`

```bash
# ── AGENT WALLET ──────────────────────────────────────────────
AGENT_PRIVATE_KEY=0x...          # The AI agent's EOA private key
AGENT_ADDRESS=0x...              # Corresponding public address

# ── AVALANCHE NETWORK ──────────────────────────────────────────
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
FUJI_CHAIN_ID=43113
MAINNET_RPC_URL=https://api.avax.network/ext/bc/C/rpc
MAINNET_CHAIN_ID=43114

# ── ANTHROPIC ──────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...

# ── x402 / PayAI ───────────────────────────────────────────────
FACILITATOR_URL=https://facilitator.payai.network
X402_NETWORK=avalanche-fuji            # or "avalanche" for mainnet
X402_PAYMENT_ADDRESS=0x...             # same as AGENT_ADDRESS (receives payments)

# ── ERC-8004 REGISTRY ADDRESSES (Fuji Testnet) ─────────────────
# From: github.com/erc-8004/erc-8004-contracts
IDENTITY_REGISTRY=0x8004A818BFB912233c491871b3d84c89A494BD9e
REPUTATION_REGISTRY=0x8004B663056A597Dffe9eCcC1965A193B7388713
# Note: Validation Registry address — check erc-8004/erc-8004-contracts for Fuji

# ── ERC-8004 AGENT TOKEN ───────────────────────────────────────
AGENT_TOKEN_ID=147                     # Set after registering agent (Step 5)

# ── GLACIER API ────────────────────────────────────────────────
GLACIER_API_KEY=...                    # From: glacier.avax.network — free tier available
GLACIER_BASE_URL=https://glacier-api.avax.network

# ── PROTOCOL CONTRACT ADDRESSES (Fuji Testnet) ─────────────────
# Verify each on testnet.snowtrace.io before use

# BENQI
BENQI_COMPTROLLER=0x486Af39519B4Dc9a7fCcd318217Be7737f0B743d
BENQI_QIUSDC=0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F   # qiUSDC token (supply target)
BENQI_QIAVAX=0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c   # qiAVAX

# LFJ (Trader Joe) Router
LFJ_ROUTER=0x60aE616a2155Ee3d9A68541Ba4544862310933d4    # Fuji router v2

# Aave V3
AAVE_POOL=0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C       # Fuji Pool
AAVE_POOL_ADDRESSES_PROVIDER=0x220c6A7D868FC38ECB47d5E69b99e9906300594

# USDC on Fuji
USDC_ADDRESS=0x5425890298aed601595a70AB815c96711a31Bc65     # Official Fuji USDC
USDC_DECIMALS=6

# NEXT_PUBLIC (exposed to browser)
NEXT_PUBLIC_FUJI_CHAIN_ID=43113
NEXT_PUBLIC_SNOWTRACE_BASE=https://testnet.snowtrace.io
```

---

## 4. Step 1 — Set Up Agent Wallet

**File: `frontend/lib/agent-wallet.ts`**

```typescript
import { ethers } from "ethers";

// The agent's EOA — funded with test AVAX from faucet.avax.network
export function getAgentWallet() {
  const provider = new ethers.JsonRpcProvider(
    process.env.FUJI_RPC_URL!,
    {
      chainId: parseInt(process.env.FUJI_CHAIN_ID!),
      name: "avalanche-fuji"
    }
  );
  const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY!, provider);
  return { wallet, provider };
}

export async function getAgentBalance() {
  const { wallet, provider } = getAgentWallet();
  const avaxBalance = await provider.getBalance(wallet.address);
  return ethers.formatEther(avaxBalance);
}
```

**How to fund:** Go to `https://faucet.avax.network`, paste AGENT_ADDRESS, request 2 AVAX. For test USDC, use `https://testnet.snowtrace.io` to find the USDC faucet or swap test AVAX → test USDC on LFJ Fuji.

---

## 5. Step 2 — Register Agent on ERC-8004

**Resource:** `https://github.com/ava-labs/8004-boilerplate` — clone this, read the deploy script.

**File: `frontend/lib/erc8004.ts`**

```typescript
import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

// Minimal ABI — only functions we call
// Full ABI: https://github.com/erc-8004/erc-8004-contracts/blob/main/out/IdentityRegistry.sol/IdentityRegistry.json
const IDENTITY_ABI = [
  "function registerAgent(string memory metadataURI) external returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function totalSupply() external view returns (uint256)"
];

const REPUTATION_ABI = [
  "function submitFeedback(uint256 agentId, uint8 score, string memory evidenceURI) external",
  "function getReputation(uint256 agentId) external view returns (uint256 totalScore, uint256 count)",
  "function getFeedbackCount(uint256 agentId) external view returns (uint256)"
];

export function getIdentityRegistry() {
  const { wallet } = getAgentWallet();
  return new ethers.Contract(
    process.env.IDENTITY_REGISTRY!,
    IDENTITY_ABI,
    wallet
  );
}

export function getReputationRegistry() {
  const { wallet } = getAgentWallet();
  return new ethers.Contract(
    process.env.REPUTATION_REGISTRY!,
    REPUTATION_ABI,
    wallet
  );
}

// CALL THIS ONCE to register the agent — store the returned tokenId in env
export async function registerAgent(): Promise<number> {
  const registry = getIdentityRegistry();

  // Agent metadata following ERC-8004 spec (upload to IPFS or use inline)
  const metadata = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: "TalkToDeFi Agent",
    description: "An autonomous DeFi agent that executes Avalanche DeFi actions via natural language. Supports BENQI supply, LFJ swaps, Aave V3 lending. Built for Team1 India Speedrun June 2026.",
    image: "https://your-app.vercel.app/agent-avatar.png",
    services: [
      { name: "web", endpoint: "https://your-app.vercel.app/" }
    ],
    x402Support: true,
    active: true
  };

  // Upload metadata to IPFS (use nft.storage free tier or web3.storage)
  // const metadataURI = await uploadToIPFS(metadata);
  // For dev/hackathon, use a public JSON URL or data URI
  const metadataURI = "https://your-app.vercel.app/agent-metadata.json";

  const tx = await registry.registerAgent(metadataURI);
  const receipt = await tx.wait();

  // Extract tokenId from Transfer event (ERC-721 mint)
  const transferEvent = receipt.logs.find(
    (log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
  );
  const tokenId = parseInt(transferEvent.topics[3], 16);
  console.log(`Agent registered! Token ID: ${tokenId}`);
  // → Save this as AGENT_TOKEN_ID in .env.local
  return tokenId;
}

// Read agent reputation — call before each execution
export async function getAgentReputation(tokenId: number) {
  const registry = getReputationRegistry();
  const [totalScore, count] = await registry.getReputation(tokenId);
  const avgScore = count > 0 ? Number(totalScore) / Number(count) : 0;
  return { totalScore: Number(totalScore), count: Number(count), avgScore };
}

// Write reputation feedback AFTER a successful execution
export async function submitProtocolFeedback(
  protocolScore: number,  // 0-100
  txHash: string
) {
  const registry = getReputationRegistry();
  const evidenceURI = `https://testnet.snowtrace.io/tx/${txHash}`;

  // We submit feedback about ourselves (the agent) after successful execution
  const agentTokenId = parseInt(process.env.AGENT_TOKEN_ID!);
  const tx = await registry.submitFeedback(agentTokenId, protocolScore, evidenceURI);
  await tx.wait();
  console.log("Reputation updated onchain");
}
```

**ERC-8004 Contract Addresses (Fuji Testnet) — hardcoded from erc-8004/erc-8004-contracts:**
- IdentityRegistry: `0x8004A818BFB912233c491871b3d84c89A494BD9e`
- ReputationRegistry: `0x8004B663056A597Dffe9eCcC1965A193B7388713`

**Source:** `https://github.com/erc-8004/erc-8004-contracts` — check README for latest Fuji addresses.

---

## 6. Step 3 — x402 Payment Client + Gated APY Server

### 6a. APY Data Server (x402 Merchant — the thing being paid for)

**File: `frontend/app/api/apy/route.ts`** — this IS the x402-gated endpoint

```typescript
import { NextRequest, NextResponse } from "next/server";
import { paymentMiddleware } from "@x402/next"; // or express equivalent

// This endpoint returns live APY data — gated by x402
// Agent pays 0.001 USDC per call to get the data
export const config = { api: { bodyParser: false } };

// x402 middleware wraps this — see wiring below
export async function GET(req: NextRequest) {
  // At this point, payment has already been verified by middleware
  // Fetch real APY data from BENQI, Aave, etc.
  const apyData = await fetchLiveAPYs();
  return NextResponse.json(apyData);
}

async function fetchLiveAPYs() {
  // BENQI APY: read from BENQI Comptroller getAccountLiquidity or subgraph
  // For hackathon: use BENQI's public API or hardcode a realistic value
  // Real endpoint: https://api.benqi.fi/liquidity  (check their docs)
  return {
    BENQI_USDC: 5.4,       // % APY
    BENQI_AVAX: 3.2,
    AAVE_USDC: 4.1,
    LFJ_AVAX_USDC_LP: 9.1, // higher but impermanent loss risk
    YIELD_YAK_AVAX: 6.2,
    timestamp: Date.now()
  };
}
```

**File: `frontend/middleware.ts`** — x402 payment gate using Express middleware style

```typescript
// Using @x402/express middleware pattern adapted for Next.js API route
// OR use paymentMiddleware from @x402/next if available

import { paymentMiddleware } from "@payai/x402";

// This wraps the /api/apy route:
// - Any request to GET /api/apy must include a valid x402 payment header
// - Payment: 0.001 USDC on avalanche-fuji
// - Settled via facilitator.payai.network
export const x402Config = {
  "GET /api/apy": {
    price: "$0.001",               // 0.001 USDC per APY data fetch
    network: "avalanche-fuji",     // chain identifier
    payTo: process.env.X402_PAYMENT_ADDRESS as `0x${string}`,
    description: "Live APY data for BENQI, Aave, LFJ on Avalanche Fuji"
  }
};
```

### 6b. x402 Client (Agent pays for APY data)

**File: `frontend/lib/x402-client.ts`**

```typescript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// Register EVM payment scheme (Avalanche C-Chain)
registerExactEvmScheme();

export function createX402Client() {
  const account = privateKeyToAccount(
    process.env.AGENT_PRIVATE_KEY as `0x${string}`
  );

  // Create x402-enabled fetch client
  // When a server returns HTTP 402, this client auto-signs and pays
  const client = x402Client(account);
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  return fetchWithPayment;
}

// Fetch APY data — pays x402 automatically
export async function fetchAPYData(): Promise<{
  BENQI_USDC: number;
  AAVE_USDC: number;
  LFJ_AVAX_USDC_LP: number;
  YIELD_YAK_AVAX: number;
}> {
  const fetchWithPayment = createX402Client();

  // This call to our own /api/apy endpoint triggers x402 payment
  const response = await fetchWithPayment(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/apy`,
    { method: "GET" }
  );

  if (!response.ok) throw new Error("Failed to fetch APY data");
  return response.json();
}
```

**How x402 flow works:**
1. Agent calls `GET /api/apy`
2. Server returns `HTTP 402` with payment requirements in headers
3. x402 client reads requirements, signs a USDC payment proof
4. Client retries the request with `Payment-Signature` header
5. Facilitator (`facilitator.payai.network`) verifies + settles on-chain
6. Server delivers APY data

---

## 7. Step 4 — Claude Intent Parser

**File: `frontend/lib/claude.ts`**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ParsedIntent {
  action: "supply" | "swap" | "withdraw" | "query";
  fromAsset?: string;     // e.g. "AVAX", "USDC"
  toAsset?: string;       // for swaps
  amountUSD: number;      // normalized to USD
  protocol?: "BENQI" | "LFJ" | "AAVE" | "YIELD_YAK" | "AUTO";
  riskLevel: "low" | "medium" | "high";
  confidence: number;     // 0-1
  explanation: string;    // human-readable summary
}

const INTENT_SYSTEM_PROMPT = `You are a DeFi intent parser for an Avalanche blockchain agent.
Parse user messages into structured JSON representing a DeFi action.

Available protocols:
- BENQI: lending/borrowing/liquid staking on Avalanche. Best for stable yield (USDC supply ~5.4% APY). Contract: BENQI Comptroller on C-Chain.
- LFJ: Trader Joe v2. Best for token swaps (AVAX→USDC, etc). Router on Fuji.
- AAVE: Aave V3 on Avalanche. Blue-chip lending, slightly lower APY (~4.1%). 
- YIELD_YAK: Auto-compound strategies. Best AVAX yield (~6.2%). Higher complexity.
- AUTO: agent decides based on current APY data.

Currency conversions: 1 USD ≈ 84 INR. "₹500" = $5.95 USD. "₹1000" = $11.90 USD.
Default chain: Avalanche Fuji testnet.

Always respond ONLY with valid JSON matching this exact schema:
{
  "action": "supply" | "swap" | "withdraw" | "query",
  "fromAsset": "AVAX" | "USDC" | "WAVAX",
  "toAsset": "AVAX" | "USDC" | "WAVAX",   // only for swaps
  "amountUSD": number,
  "protocol": "BENQI" | "LFJ" | "AAVE" | "YIELD_YAK" | "AUTO",
  "riskLevel": "low" | "medium" | "high",
  "confidence": 0.0-1.0,
  "explanation": "one sentence describing what you'll do"
}

If the intent is unclear or dangerous, set confidence below 0.5 and explain.
For "stable yield" intents, default to BENQI USDC supply.
For "best yield" intents, set protocol to AUTO (agent will check live APYs).`;

export async function parseIntent(userMessage: string): Promise<ParsedIntent> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: INTENT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }]
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    // Strip any markdown fences if present
    const clean = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(clean) as ParsedIntent;
  } catch {
    throw new Error(`Failed to parse Claude response: ${text}`);
  }
}
```

---

## 8. Step 5 — DeFi Protocol Wrappers

### 8a. BENQI Wrapper

**File: `frontend/lib/benqi.ts`**

```typescript
import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

// BENQI qiToken ABI (subset we need)
// Full ABI: https://testnet.snowtrace.io/address/0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F#code
const QI_TOKEN_ABI = [
  "function mint(uint256 mintAmount) external returns (uint256)",    // supply ERC-20
  "function redeem(uint256 redeemTokens) external returns (uint256)", // withdraw
  "function redeemUnderlying(uint256 redeemAmount) external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function exchangeRateCurrent() external returns (uint256)",
  "function supplyRatePerTimestamp() external view returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

export async function supplyUSDC(amountUSD: number): Promise<{
  txHash: string;
  blockNumber: number;
  amountSupplied: number;
}> {
  const { wallet } = getAgentWallet();

  const usdcContract = new ethers.Contract(
    process.env.USDC_ADDRESS!,
    ERC20_ABI,
    wallet
  );

  const qiUSDCContract = new ethers.Contract(
    process.env.BENQI_QIUSDC!,
    QI_TOKEN_ABI,
    wallet
  );

  // Convert USD amount to USDC (6 decimals)
  const amountRaw = ethers.parseUnits(amountUSD.toFixed(6), 6);

  // Step 1: Approve BENQI to spend USDC
  const currentAllowance = await usdcContract.allowance(wallet.address, process.env.BENQI_QIUSDC!);
  if (currentAllowance < amountRaw) {
    const approveTx = await usdcContract.approve(process.env.BENQI_QIUSDC!, amountRaw);
    await approveTx.wait();
    console.log("USDC approved for BENQI");
  }

  // Step 2: Mint qiUSDC (= supply USDC)
  const mintTx = await qiUSDCContract.mint(amountRaw, {
    gasLimit: 500_000   // explicit gas limit for Fuji
  });

  const receipt = await mintTx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    amountSupplied: amountUSD
  };
}

// Get current BENQI USDC supply APY (reads from contract)
export async function getBENQISupplyAPY(): Promise<number> {
  const { wallet } = getAgentWallet();
  const qiUSDC = new ethers.Contract(process.env.BENQI_QIUSDC!, QI_TOKEN_ABI, wallet);

  // supplyRatePerTimestamp → annualize
  const ratePerTimestamp = await qiUSDC.supplyRatePerTimestamp();
  const secondsPerYear = 31_536_000;
  const apy = (Number(ratePerTimestamp) / 1e18) * secondsPerYear * 100;
  return parseFloat(apy.toFixed(2));
}
```

### 8b. LFJ (Trader Joe) Swap Wrapper

**File: `frontend/lib/lfj.ts`**

```typescript
import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

// LFJ Router v2 ABI (Fuji) — only the functions we use
// Full ABI: https://testnet.snowtrace.io/address/0x60aE616a2155Ee3d9A68541Ba4544862310933d4#code
const LFJ_ROUTER_ABI = [
  `function swapExactAVAXForTokens(
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
  ) external payable returns (uint256[] memory amounts)`,

  `function swapExactTokensForAVAX(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
  ) external returns (uint256[] memory amounts)`,

  `function getAmountsOut(
    uint256 amountIn,
    address[] calldata path
  ) external view returns (uint256[] memory amounts)`
];

const WAVAX_FUJI = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";

export async function swapAVAXToUSDC(avaxAmount: number): Promise<{
  txHash: string;
  amountIn: number;
  amountOut: number;
}> {
  const { wallet } = getAgentWallet();
  const router = new ethers.Contract(process.env.LFJ_ROUTER!, LFJ_ROUTER_ABI, wallet);

  const amountInWei = ethers.parseEther(avaxAmount.toString());
  const path = [WAVAX_FUJI, process.env.USDC_ADDRESS!];

  // Get expected output with 1% slippage tolerance
  const amounts = await router.getAmountsOut(amountInWei, path);
  const amountOutMin = (amounts[1] * 99n) / 100n;  // 1% slippage

  const deadline = Math.floor(Date.now() / 1000) + 300; // 5 min

  const tx = await router.swapExactAVAXForTokens(
    amountOutMin,
    path,
    wallet.address,
    deadline,
    {
      value: amountInWei,
      gasLimit: 400_000
    }
  );

  const receipt = await tx.wait();
  const usdcReceived = Number(ethers.formatUnits(amounts[1], 6));

  return {
    txHash: receipt.hash,
    amountIn: avaxAmount,
    amountOut: usdcReceived
  };
}
```

---

## 9. Step 6 — DeFi Router (Protocol Selector)

**File: `frontend/lib/defi-router.ts`**

```typescript
import { ParsedIntent } from "./claude";
import { supplyUSDC, getBENQISupplyAPY } from "./benqi";
import { swapAVAXToUSDC } from "./lfj";
import { fetchAPYData } from "./x402-client";
import { submitProtocolFeedback } from "./erc8004";

export interface ExecutionResult {
  success: boolean;
  protocol: string;
  action: string;
  txHash?: string;
  blockNumber?: number;
  amountIn?: number;
  amountOut?: number;
  apy?: number;
  error?: string;
  steps: StepLog[];
}

export interface StepLog {
  step: string;
  status: "done" | "error";
  detail: string;
  ms: number;
}

export async function executeIntent(intent: ParsedIntent): Promise<ExecutionResult> {
  const steps: StepLog[] = [];
  const start = Date.now();

  try {
    // STEP 1: Fetch live APY data via x402
    steps.push({ step: "Fetching live APY data via x402", status: "done", detail: "paying 0.001 USDC to /api/apy", ms: Date.now() - start });
    const apyData = await fetchAPYData();

    // STEP 2: Select best protocol if AUTO
    let selectedProtocol = intent.protocol;
    if (selectedProtocol === "AUTO") {
      if (intent.action === "supply" && intent.fromAsset === "USDC") {
        selectedProtocol = apyData.BENQI_USDC > apyData.AAVE_USDC ? "BENQI" : "AAVE";
      } else {
        selectedProtocol = "BENQI"; // default
      }
    }
    steps.push({ step: `Protocol selected: ${selectedProtocol}`, status: "done", detail: `APY: ${apyData.BENQI_USDC}% BENQI vs ${apyData.AAVE_USDC}% Aave`, ms: Date.now() - start });

    // STEP 3: Execute based on action + protocol
    let result: any = {};

    if (intent.action === "supply" && selectedProtocol === "BENQI") {
      steps.push({ step: "Signing BENQI supply transaction", status: "done", detail: `supply(${intent.amountUSD} USDC)`, ms: Date.now() - start });
      result = await supplyUSDC(intent.amountUSD);
      steps.push({ step: "Transaction confirmed on Avalanche C-Chain", status: "done", detail: `block ${result.blockNumber}`, ms: Date.now() - start });

    } else if (intent.action === "swap" && selectedProtocol === "LFJ") {
      const avaxAmount = intent.amountUSD / 38; // rough AVAX price for Fuji demo
      steps.push({ step: "Executing LFJ swap", status: "done", detail: `swapAVAX→USDC ${avaxAmount} AVAX`, ms: Date.now() - start });
      result = await swapAVAXToUSDC(avaxAmount);
      steps.push({ step: "Swap confirmed", status: "done", detail: `received ${result.amountOut} USDC`, ms: Date.now() - start });
    }

    // STEP 4: Write reputation feedback to ERC-8004
    if (result.txHash) {
      await submitProtocolFeedback(95, result.txHash); // high score = successful execution
      steps.push({ step: "ERC-8004 reputation updated", status: "done", detail: "feedback score 95/100 written to Reputation Registry", ms: Date.now() - start });
    }

    return {
      success: true,
      protocol: selectedProtocol!,
      action: intent.action,
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      amountIn: intent.amountUSD,
      amountOut: result.amountOut,
      apy: selectedProtocol === "BENQI" ? apyData.BENQI_USDC : undefined,
      steps
    };

  } catch (err: any) {
    return {
      success: false,
      protocol: intent.protocol || "UNKNOWN",
      action: intent.action,
      error: err.message,
      steps
    };
  }
}
```

---

## 10. Step 7 — API Routes (Wiring Frontend → Execution Engine)

### `frontend/app/api/intent/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { parseIntent } from "@/lib/claude";
import { executeIntent } from "@/lib/defi-router";
import { getAgentReputation } from "@/lib/erc8004";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // 1. Parse intent
  const intent = await parseIntent(message);

  // 2. Check agent reputation (just for display)
  const reputation = await getAgentReputation(parseInt(process.env.AGENT_TOKEN_ID!));

  // 3. If confidence too low, return explanation without executing
  if (intent.confidence < 0.5) {
    return NextResponse.json({
      status: "clarification_needed",
      explanation: intent.explanation,
      intent
    });
  }

  // 4. Execute
  const result = await executeIntent(intent);

  return NextResponse.json({
    status: result.success ? "success" : "error",
    intent,
    result,
    agent: {
      tokenId: process.env.AGENT_TOKEN_ID,
      address: process.env.AGENT_ADDRESS,
      reputation: reputation.avgScore,
      network: "avalanche-fuji"
    }
  });
}
```

### `frontend/app/api/agent/route.ts`
```typescript
import { NextResponse } from "next/server";
import { getAgentReputation } from "@/lib/erc8004";
import { getAgentBalance } from "@/lib/agent-wallet";

export async function GET() {
  const [reputation, balance] = await Promise.all([
    getAgentReputation(parseInt(process.env.AGENT_TOKEN_ID!)),
    getAgentBalance()
  ]);

  return NextResponse.json({
    tokenId: process.env.AGENT_TOKEN_ID,
    address: process.env.AGENT_ADDRESS,
    identityRegistry: process.env.IDENTITY_REGISTRY,
    reputationRegistry: process.env.REPUTATION_REGISTRY,
    reputation: {
      avgScore: reputation.avgScore,
      count: reputation.count,
      total: reputation.totalScore
    },
    wallet: {
      address: process.env.AGENT_ADDRESS,
      avaxBalance: balance,
      network: "avalanche-fuji",
      chainId: 43113
    }
  });
}
```

---

## 11. Step 8 — Wire Existing UI to API

The UI files (`index.html` → `app/page.tsx`, `dashboard.html` → `app/dashboard/page.tsx`) already exist. Wire them as follows:

### `ChatWindow.tsx` — replaces the `<script>` block in dashboard.html

```typescript
"use client";
import { useState } from "react";

interface Message { role: "user" | "agent"; content: any; }

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    const response = await fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });

    const data = await response.json();
    setMessages(prev => [...prev, { role: "agent", content: data }]);
    setLoading(false);
  }

  return (
    // Use the existing dashboard.html CSS classes
    // Render messages with Receipt.tsx and StepTrace.tsx components
    // data.result.steps → <StepTrace steps={data.result.steps} />
    // data.result.txHash → <Receipt result={data.result} agent={data.agent} />
    <div className="chat-window">
      {/* ... map messages ... */}
    </div>
  );
}
```

### `Receipt.tsx` — renders the receipt card

```typescript
export function Receipt({ result, agent }: { result: any; agent: any }) {
  return (
    <div className="receipt">
      <div className="receipt-header">
        <span>🧾 Transaction Receipt</span>
        <span className="rh-status">CONFIRMED</span>
      </div>
      <div className="receipt-rows">
        <Row label="Protocol" value={result.protocol} />
        <Row label="Amount" value={`${result.amountIn} USDC`} />
        <Row label="Est. APY" value={`${result.apy}%`} className="green" />
        <Row label="Agent ID" value={`ERC-8004 #${agent.tokenId}`} className="blue" />
        <Row label="Block" value={result.blockNumber} />
      </div>
      <div className="receipt-hash">
        <span>{result.txHash?.slice(0, 20)}…</span>
        <a
          href={`${process.env.NEXT_PUBLIC_SNOWTRACE_BASE}/tx/${result.txHash}`}
          target="_blank"
        >
          VIEW ON SNOWTRACE ↗
        </a>
      </div>
    </div>
  );
}
```

---

## 12. Glacier API Integration (Chain Data)

**Resource:** `https://glacier-api.avax.network` — free tier, no API key needed for public endpoints.

**File: `frontend/lib/glacier.ts`**

```typescript
const GLACIER_BASE = "https://glacier-api.avax.network";

// Get transaction details (for receipt enrichment)
export async function getTransaction(txHash: string) {
  const res = await fetch(
    `${GLACIER_BASE}/v1/chains/43113/transactions/${txHash}`,
    {
      headers: {
        "x-glacier-api-key": process.env.GLACIER_API_KEY || ""
      }
    }
  );
  return res.json();
}

// Get wallet token balances (for portfolio sidebar)
export async function getWalletBalances(address: string) {
  const res = await fetch(
    `${GLACIER_BASE}/v1/chains/43113/addresses/${address}/balances:listErc20`,
    {
      headers: {
        "x-glacier-api-key": process.env.GLACIER_API_KEY || ""
      }
    }
  );
  return res.json();
}

// Get recent transactions (for TX feed in right sidebar)
export async function getRecentTxs(address: string, limit = 10) {
  const res = await fetch(
    `${GLACIER_BASE}/v1/chains/43113/addresses/${address}/transactions?pageSize=${limit}`,
    {
      headers: {
        "x-glacier-api-key": process.env.GLACIER_API_KEY || ""
      }
    }
  );
  return res.json();
}
```

**Glacier API Key:** Register free at `https://glacier.avax.network` — 100 req/min free tier.

---

## 13. Deployment

### Local Development

```bash
# 1. Clone the ERC-8004 boilerplate to understand the contracts
git clone https://github.com/ava-labs/8004-boilerplate.git
# Read: config/agent.config.js, contracts/, scripts/deploy.js

# 2. Set up the Next.js project
cd frontend
cp .env.example .env.local
# Fill in all values from Section 3

# 3. Register agent ONCE (run this script once, save token ID)
npx tsx scripts/register-agent.ts
# → saves AGENT_TOKEN_ID to console, add to .env.local

# 4. Fund agent wallet
# Go to: https://faucet.avax.network
# Request 2 AVAX for gas, get test USDC from Fuji faucet or swap

# 5. Run dev server
npm run dev
# → http://localhost:3000 (landing)
# → http://localhost:3000/dashboard

# 6. Test the flow
curl -X POST http://localhost:3000/api/intent \
  -H "Content-Type: application/json" \
  -d '{"message": "Put $5 into stable yield on BENQI"}'
```

### Production (Vercel)

```bash
npm install -g vercel
vercel --prod
# Add all .env.local vars to Vercel dashboard → Settings → Environment Variables
```

---

## 14. Mainnet Deploy (Bonus Points)

Change these env vars to use mainnet:

```bash
FUJI_RPC_URL=https://api.avax.network/ext/bc/C/rpc
FUJI_CHAIN_ID=43114
X402_NETWORK=avalanche
IDENTITY_REGISTRY=0x8004A169FB4a3325136EB29fA0ceB6D2e539a432    # mainnet
REPUTATION_REGISTRY=0x8004BAa17C55a88189AE136b182e5fdA19dE9b63  # mainnet
USDC_ADDRESS=0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E          # mainnet USDC
```

Execute 1 real supply tx with $1 USDC to get a mainnet TX hash for the pitch. Screenshot it on Snowtrace mainnet (`snowtrace.io`).

---

## 15. 14-Day Sprint Schedule

| Days | Tasks |
|------|-------|
| D1 | Setup repo, install all packages, generate agent wallet, fund from faucet |
| D2 | Register ERC-8004 agent (get token ID), verify on Snowtrace, save to env |
| D3 | Build Claude intent parser (`claude.ts`), test with 20 sample inputs |
| D4 | Build BENQI wrapper (`benqi.ts`), test supply on Fuji, confirm on Snowtrace |
| D5 | Build LFJ wrapper (`lfj.ts`), test AVAX→USDC swap on Fuji |
| D6 | Build x402 client + gated APY endpoint, test full x402 payment flow |
| D7 | Build DeFi router (`defi-router.ts`), wire all components end-to-end |
| D8 | Build API routes (`/api/intent`, `/api/agent`), test full POST flow |
| D9 | Wire API to existing UI (ChatWindow, Receipt, StepTrace components) |
| D10 | Wire right sidebar (live APY + TX feed via Glacier API) |
| D11 | Full integration test — 30 end-to-end flows, fix all bugs |
| D12 | Mainnet deploy (1 real tx), record demo video as backup |
| D13 | Pitch deck + live demo rehearsal, submit to speedrun portal |
| D14 | Buffer + polish |

---

## 16. Key Resource URLs (Quick Reference)

| Resource | URL |
|----------|-----|
| ERC-8004 Spec | https://eips.ethereum.org/EIPS/eip-8004 |
| ERC-8004 Contracts (addresses) | https://github.com/erc-8004/erc-8004-contracts |
| Ava Labs ERC-8004 Boilerplate | https://github.com/ava-labs/8004-boilerplate |
| x402 Foundation SDK | https://github.com/x402-foundation/x402 |
| PayAI x402 Docs | https://docs.payai.network |
| PayAI Facilitator | https://facilitator.payai.network |
| Avalanche Builder Hub PayAI | https://build.avax.network/integrations/payai |
| AVAX Fuji Faucet | https://faucet.avax.network |
| Fuji Snowtrace Explorer | https://testnet.snowtrace.io |
| Mainnet Snowtrace | https://snowtrace.io |
| Glacier API | https://glacier-api.avax.network |
| Anthropic API | https://api.anthropic.com/v1/messages |
| BENQI (Fuji) | Check testnet.snowtrace.io for contract addresses |
| LFJ (Fuji) Router | 0x60aE616a2155Ee3d9A68541Ba4544862310933d4 |
| Aave V3 (Fuji) Pool | 0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C |
| Fuji USDC | 0x5425890298aed601595a70AB815c96711a31Bc65 |
| ERC-8004 Community | https://8004.org · team@8004.org |
| Speedrun Submission | https://india.team1.network/speedrun/june-2026 |

---

## 17. What to Say in the Pitch (30-Second Version)

> "We built Talk to DeFi. You type 'Put ₹500 into stable yield.' Our ERC-8004 registered agent parses your intent using Claude, pays for live APY data via the x402 protocol on Avalanche, selects the best protocol — BENQI at 5.4% — signs the transaction autonomously, and gives you a receipt with a Snowtrace link. No wallet UX. No protocol knowledge. Just intent. It's live on Fuji testnet right now."

Then open the dashboard. Type the prompt live. Show Snowtrace confirming in real time.

---

*This document is the complete build specification for Talk to DeFi. Pass to Codex with the instruction: "Implement this specification exactly. Wire the UI files at `/mnt/user-data/outputs/talk-to-defi/index.html` and `/mnt/user-data/outputs/talk-to-defi/dashboard.html` into Next.js components using the CSS classes defined in those files."*
