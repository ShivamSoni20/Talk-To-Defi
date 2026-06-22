import { NextRequest, NextResponse } from "next/server";
import { parseIntent } from "@/lib/claude";
import { executeIntent } from "@/lib/defi-router";
import { getAgentReputation } from "@/lib/erc8004";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const intent = await parseIntent(message);

  const reputation = await getAgentReputation(parseInt(process.env.AGENT_TOKEN_ID!));

  if (intent.confidence < 0.5) {
    return NextResponse.json({
      status: "clarification_needed",
      explanation: intent.explanation,
      intent
    });
  }

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
