export default function PortfolioView() {
  return (
    <div className="main" style={{ padding: '30px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Your Portfolio</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>A complete overview of your active DeFi positions on Avalanche.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {/* BENQI Position */}
        <div className="agent-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="pi-icon" style={{ background: "#0d2e4f", width: '40px', height: '40px', fontSize: '20px' }}>🏔</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>USDC</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>BENQI Supply</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green)' }}>$6.12</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--faint)', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Current APY</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--green)' }}>5.4%</span>
          </div>
        </div>

        {/* Aave Position */}
        <div className="agent-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="pi-icon" style={{ background: "#2a0d2e", width: '40px', height: '40px', fontSize: '20px' }}>👻</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>USDC</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Aave V3 Supply</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green)' }}>$4.88</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--faint)', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Current APY</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--green)' }}>4.1%</span>
          </div>
        </div>

        {/* Yield Yak Position */}
        <div className="agent-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="pi-icon" style={{ background: "#2e2a0d", width: '40px', height: '40px', fontSize: '20px' }}>🦅</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>AVAX</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Yield Yak Vault</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green)' }}>$11.20</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--faint)', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Current APY</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--green)' }}>6.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
