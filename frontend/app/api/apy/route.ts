import { NextRequest, NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };

export async function GET(req: NextRequest) {
  const apyData = await fetchLiveAPYs();
  return NextResponse.json(apyData);
}

async function fetchLiveAPYs() {
  return {
    BENQI_USDC: 5.4,
    BENQI_AVAX: 3.2,
    AAVE_USDC: 4.1,
    LFJ_AVAX_USDC_LP: 9.1,
    YIELD_YAK_AVAX: 6.2,
    timestamp: Date.now()
  };
}
