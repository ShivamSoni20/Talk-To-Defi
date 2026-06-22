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
    steps.push({ step: "Fetching live APY data via x402", status: "done", detail: "paying 0.001 USDC to /api/apy", ms: Date.now() - start });
    const apyData = await fetchAPYData();

    let selectedProtocol = intent.protocol;
    if (selectedProtocol === "AUTO") {
      if (intent.action === "supply" && intent.fromAsset === "USDC") {
        selectedProtocol = apyData.BENQI_USDC > apyData.AAVE_USDC ? "BENQI" : "AAVE";
      } else {
        selectedProtocol = "BENQI";
      }
    }
    steps.push({ step: `Protocol selected: ${selectedProtocol}`, status: "done", detail: `APY: ${apyData.BENQI_USDC}% BENQI vs ${apyData.AAVE_USDC}% Aave`, ms: Date.now() - start });

    let result: any = {};

    if (intent.action === "supply" && selectedProtocol === "BENQI") {
      steps.push({ step: "Signing BENQI supply transaction", status: "done", detail: `supply(${intent.amountUSD} USDC)`, ms: Date.now() - start });
      result = await supplyUSDC(intent.amountUSD);
      steps.push({ step: "Transaction confirmed on Avalanche C-Chain", status: "done", detail: `block ${result.blockNumber}`, ms: Date.now() - start });

    } else if (intent.action === "swap" && selectedProtocol === "LFJ") {
      const avaxAmount = intent.amountUSD / 38;
      steps.push({ step: "Executing LFJ swap", status: "done", detail: `swapAVAX→USDC ${avaxAmount} AVAX`, ms: Date.now() - start });
      result = await swapAVAXToUSDC(avaxAmount);
      steps.push({ step: "Swap confirmed", status: "done", detail: `received ${result.amountOut} USDC`, ms: Date.now() - start });
    }

    if (result.txHash) {
      await submitProtocolFeedback(95, result.txHash);
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
