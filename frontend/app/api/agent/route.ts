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
