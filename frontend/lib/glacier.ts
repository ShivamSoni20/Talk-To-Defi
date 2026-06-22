const GLACIER_BASE = "https://glacier-api.avax.network";

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
