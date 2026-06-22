export function Receipt({ result, agent }: { result: any; agent: any }) {
  if (!result) return null;

  return (
    <div className="receipt">
      <div className="receipt-header">
        <div className="rh-title">🧾 Transaction Receipt</div>
        <div className="rh-status">CONFIRMED</div>
      </div>
      <div className="receipt-rows">
        <div className="rr">
          <span className="rr-label">Protocol</span>
          <span className="rr-val">{result.protocol}</span>
        </div>
        <div className="rr">
          <span className="rr-label">Action</span>
          <span className="rr-val">{result.action}</span>
        </div>
        <div className="rr">
          <span className="rr-label">Amount</span>
          <span className="rr-val">{result.amountIn} USDC</span>
        </div>
        {result.apy && (
          <div className="rr">
            <span className="rr-label">Est. APY</span>
            <span className="rr-val green">{result.apy}%</span>
          </div>
        )}
        <div className="rr">
          <span className="rr-label">Agent ID</span>
          <span className="rr-val blue">ERC-8004 · 0x{agent.tokenId?.toString(16)}</span>
        </div>
        <div className="rr">
          <span className="rr-label">Block</span>
          <span className="rr-val">{result.blockNumber}</span>
        </div>
      </div>
      <div className="receipt-hash">
        <span className="rh-hash">{result.txHash?.slice(0, 10)}…{result.txHash?.slice(-4)} · confirmed</span>
        <a
          href={`${process.env.NEXT_PUBLIC_SNOWTRACE_BASE}/tx/${result.txHash}`}
          target="_blank"
          rel="noreferrer"
          className="rh-link"
        >
          VIEW ON SNOWTRACE ↗
        </a>
      </div>
    </div>
  );
}
