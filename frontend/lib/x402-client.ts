import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

export function createX402Client() {
  const account = privateKeyToAccount(
    process.env.AGENT_PRIVATE_KEY as `0x${string}`
  );

  const coreClient = new x402Client()
    .register('eip155:*', new ExactEvmScheme(account));

  const fetchWithPayment = wrapFetchWithPayment(fetch, coreClient);
  return fetchWithPayment;
}

export async function fetchAPYData(): Promise<{
  BENQI_USDC: number;
  AAVE_USDC: number;
  LFJ_AVAX_USDC_LP: number;
  YIELD_YAK_AVAX: number;
}> {
  const fetchWithPayment = createX402Client();

  let baseUrl = "http://localhost:3000";
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL !== "http://localhost:3000") {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  }

  const response = await fetchWithPayment(
    `${baseUrl}/api/apy`,
    { method: "GET" }
  );

  if (!response.ok) throw new Error("Failed to fetch APY data");
  return response.json();
}
