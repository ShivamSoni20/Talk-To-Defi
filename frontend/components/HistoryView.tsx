export default function HistoryView() {
  return (
    <div className="main" style={{ padding: '30px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Transaction History</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Recent activities executed autonomously by your AI agent.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Transaction 1 */}
        <div className="agent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(74,222,128,0.1)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ↑
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Supplied USDC to BENQI</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>6.12 USDC · Block 41,209,847</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>2m ago</div>
            <a href="#" className="tx-hash-small" style={{ display: 'inline-block', marginTop: '4px' }}>0x4a7f3c…8d2e ↗</a>
          </div>
        </div>

        {/* Transaction 2 */}
        <div className="agent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ⇄
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Swapped AVAX on LFJ</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>0.05 AVAX → 1.92 USDC</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>18m ago</div>
            <a href="#" className="tx-hash-small" style={{ display: 'inline-block', marginTop: '4px' }}>0x2de8b9…1c74 ↗</a>
          </div>
        </div>

        {/* Transaction 3 */}
        <div className="agent-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(168,85,247,0.1)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Identity Registration (ERC-8004)</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>agent 0x4f2a authorized</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>1h ago</div>
            <a href="#" className="tx-hash-small" style={{ display: 'inline-block', marginTop: '4px' }}>0x918d3a…2f99 ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}
