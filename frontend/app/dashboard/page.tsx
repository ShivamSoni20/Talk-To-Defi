"use client";

import Link from "next/link";
import ChatWindow from "@/components/ChatWindow";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PortfolioView from "@/components/PortfolioView";
import HistoryView from "@/components/HistoryView";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"chat" | "portfolio" | "history">("chat");

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Prevent rendering before redirect kicks in to avoid flash of content
  if (!isConnected) return null;

  return (
    <>
      <div className="topbar">
        <div className="tb-logo">
          <div className="tb-logo-mark">T1</div>
          <div className="tb-logo-text">Talk to <span>DeFi</span></div>
        </div>
        <div className="tb-nav">
        </div>
        <div className="tb-right">
          <div className="tb-network"><div className="tb-dot"></div>FUJI TESTNET</div>
          <ConnectButton />
          <Link href="/" className="tb-home-btn">← Home</Link>
        </div>
      </div>

      <div className="app">
        <aside className="sidebar">
          <div className="sb-section" style={{ borderBottom: 'none', paddingBottom: '0' }}>
            <div className="sb-nav">
              <div className={`sb-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
                <div className="sb-nav-icon">💬</div> Chat
              </div>
              <div className={`sb-nav-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
                <div className="sb-nav-icon">💼</div> Portfolio
              </div>
              <div className={`sb-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                <div className="sb-nav-icon">📜</div> History
              </div>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-label">Your Agent</div>
            <div className="agent-card">
              <div className="agent-top">
                <div className="agent-avatar">🤖</div>
                <div>
                  <div className="agent-name">DeFi Agent</div>
                  <div className="agent-id">ERC-8004 · 0x4f2a…c9e1</div>
                </div>
              </div>
              <div className="agent-stats">
                <div className="agent-stat-row">
                  <span className="ast-label">Reputation</span>
                  <span className="ast-val green">94 / 100</span>
                </div>
                <div className="rep-bar-track"><div className="rep-bar-fill"></div></div>
                <div className="agent-stat-row">
                  <span className="ast-label">x402 balance</span>
                  <span className="ast-val blue">12.40 USDC</span>
                </div>
                <div className="agent-stat-row">
                  <span className="ast-label">Txs executed</span>
                  <span className="ast-val">47</span>
                </div>
                <div className="agent-stat-row">
                  <span className="ast-label">Network</span>
                  <span className="ast-val red">Fuji 43113</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-label">Active Positions</div>
            <div className="portfolio-items">
              <div className="port-item">
                <div className="pi-left">
                  <div className="pi-icon" style={{background:"#0d2e4f"}}>🏔</div>
                  <div>
                    <div className="pi-name">USDC</div>
                    <div className="pi-proto">BENQI Supply</div>
                  </div>
                </div>
                <div className="pi-right">
                  <div className="pi-val">$6.12</div>
                  <div className="pi-apy">5.4% APY</div>
                </div>
              </div>
              <div className="port-item">
                <div className="pi-left">
                  <div className="pi-icon" style={{background:"#2a0d2e"}}>👻</div>
                  <div>
                    <div className="pi-name">USDC</div>
                    <div className="pi-proto">Aave V3 Supply</div>
                  </div>
                </div>
                <div className="pi-right">
                  <div className="pi-val">$4.88</div>
                  <div className="pi-apy">4.1% APY</div>
                </div>
              </div>
              <div className="port-item">
                <div className="pi-left">
                  <div className="pi-icon" style={{background:"#2e2a0d"}}>🦅</div>
                  <div>
                    <div className="pi-name">AVAX</div>
                    <div className="pi-proto">Yield Yak Vault</div>
                  </div>
                </div>
                <div className="pi-right">
                  <div className="pi-val">$11.20</div>
                  <div className="pi-apy">6.2% APY</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {activeTab === 'chat' && <ChatWindow />}
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'history' && <HistoryView />}

        <aside className="right-panel">
          <div className="rp-section">
            <div className="rp-label">Live APY (via x402)</div>
            <div className="yield-cards">
              <div className="yc">
                <div className="yc-icon">🦅</div>
                <div className="yc-body">
                  <div className="yc-name">Yield Yak</div>
                  <div className="yc-meta">AVAX auto-compound</div>
                </div>
                <div className="yc-right">
                  <div className="yc-apy">6.2%</div>
                  <div className="yc-label">APY</div>
                </div>
              </div>
              <div className="yc" style={{borderColor:"rgba(74,222,128,0.25)",background:"rgba(74,222,128,0.04)"}}>
                <div className="yc-icon">🏔</div>
                <div className="yc-body">
                  <div className="yc-name">BENQI</div>
                  <div className="yc-meta">USDC supply · best stable</div>
                </div>
                <div className="yc-right">
                  <div className="yc-apy">5.4%</div>
                  <div className="yc-label">APY</div>
                </div>
              </div>
              <div className="yc">
                <div className="yc-icon">👻</div>
                <div className="yc-body">
                  <div className="yc-name">Aave V3</div>
                  <div className="yc-meta">USDC supply</div>
                </div>
                <div className="yc-right">
                  <div className="yc-apy">4.1%</div>
                  <div className="yc-label">APY</div>
                </div>
              </div>
              <div className="yc">
                <div className="yc-icon">🥞</div>
                <div className="yc-body">
                  <div className="yc-name">LFJ Pool</div>
                  <div className="yc-meta">AVAX/USDC LP</div>
                </div>
                <div className="yc-right">
                  <div className="yc-apy">9.1%</div>
                  <div className="yc-label">APY*</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rp-section">
            <div className="rp-label">Recent Transactions</div>
            <div className="tx-feed">
              <div className="tx-item">
                <div className="tx-top">
                  <div className="tx-action">🟢 BENQI Supply</div>
                  <div className="tx-time">2m ago</div>
                </div>
                <div className="tx-detail">6.12 USDC · block 41,209,847</div>
                <div className="tx-hash-small">0x4a7f3c…8d2e</div>
                <div className="tx-confirmed" style={{marginTop:"4px"}}><div className="tx-blink"></div>CONFIRMED</div>
              </div>
              <div className="tx-item">
                <div className="tx-top">
                  <div className="tx-action">🔄 LFJ Swap</div>
                  <div className="tx-time">18m ago</div>
                </div>
                <div className="tx-detail">0.05 AVAX → 1.92 USDC</div>
                <div className="tx-hash-small">0x2de8b9…1c74</div>
                <div className="tx-confirmed" style={{marginTop:"4px"}}><div className="tx-blink"></div>CONFIRMED</div>
              </div>
            </div>
          </div>

          <div className="rp-section">
            <div className="rp-label">ERC-8004 Activity</div>
            <div className="erc-log">
              <div className="erc-item">
                <div className="erc-event">ReputationUpdated</div>
                <div>agent <span className="erc-val">0x4f2a</span> · score: <span style={{color:"var(--green)"}}>94</span> · +1 after BENQI supply</div>
              </div>
              <div className="erc-item">
                <div className="erc-event">IdentityVerified</div>
                <div>agent <span className="erc-val">0x4f2a</span> · token #147 · authorized</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
