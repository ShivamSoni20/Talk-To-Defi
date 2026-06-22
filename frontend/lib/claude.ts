import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://your-app.vercel.app",
    "X-Title": "Talk to DeFi"
  }
});

export interface ParsedIntent {
  action: "supply" | "swap" | "withdraw" | "query";
  fromAsset?: string;
  toAsset?: string;
  amountUSD: number;
  protocol?: "BENQI" | "LFJ" | "AAVE" | "YIELD_YAK" | "AUTO";
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  explanation: string;
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
  const response = await client.chat.completions.create({
    model: "anthropic/claude-sonnet-4-5",
    max_tokens: 512,
    messages: [
      { role: "system", content: INTENT_SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ]
  });

  const text = response.choices[0].message.content || "";

  try {
    const clean = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(clean) as ParsedIntent;
  } catch {
    throw new Error(`Failed to parse Claude response: ${text}`);
  }
}
