"use client";

import Link from "next/link";
import "./home.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <>
      <nav>
        <div className="nav-logo">
          <div className="nav-logo-mark">T1</div>
          <div className="nav-logo-text">Talk to <span>DeFi</span></div>
        </div>
        <ul className="nav-links">
          <li><a href="#how">HOW IT WORKS</a></li>
          <li><a href="#protocols">PROTOCOLS</a></li>
        </ul>
        <div className="nav-cta">
          <ConnectButton />
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">Speedrun June 2026 · Avalanche C-Chain · ERC-8004 + x402</div>

        <h1 className="hero-headline">
          <span className="accent">Talk</span> to DeFi.<br/>
          <span className="line2">It listens. It moves.</span>
        </h1>

        <p className="hero-sub">
          Type a financial intent in plain English. A verified onchain AI agent routes it through Avalanche DeFi, executes autonomously, and hands you a receipt.
        </p>

        <div className="terminal">
          <div className="terminal-bar">
            <div className="tb-dot r"></div>
            <div className="tb-dot y"></div>
            <div className="tb-dot g"></div>
            <div className="tb-title">agent-session · fuji.avax · ERC-8004:0x4f2a</div>
          </div>
          <div className="terminal-body">
            <div className="t-row">
              <span className="t-prompt">$</span>
              <span className="t-text t-dim">agent registered → identity:0x4f2a · rep:94/100 · x402:active</span>
            </div>
            <div className="t-row">
              <span className="t-prompt">$</span>
              <span className="t-text t-dim">connected to BENQI · LFJ · Aave V3 · Yield Yak</span>
            </div>
            <div className="t-input-row">
              <span className="t-prompt">›</span>
              <span id="typed-text"></span><span className="t-cursor"></span>
            </div>
          </div>
          <div className="terminal-footer">
            <div className="tf-status"><div className="tf-dot"></div>AGENT READY · FUJI TESTNET</div>
            <div>AVALANCHE C-CHAIN · ID 43113</div>
          </div>
        </div>

        <div className="hero-badges">
          <div className="hero-badge"><div className="dot" style={{background:"var(--red)"}}></div>x402 Payments</div>
          <div className="hero-badge"><div className="dot" style={{background:"var(--blue)"}}></div>ERC-8004 Identity</div>
          <div className="hero-badge"><div className="dot" style={{background:"#4ade80"}}></div>Avalanche C-Chain</div>
          <div className="hero-badge"><div className="dot" style={{background:"#a78bfa"}}></div>Claude AI Routing</div>
        </div>
      </section>
      
      <div className="strip" id="protocols">
        <div className="strip-label">INTEGRATIONS</div>
        <div style={{ display: "flex", overflow: "hidden", flex: 1 }}>
          <div className="strip-track" id="strip1">
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d2e4f" }}>🏔</div>BENQI · Lending & Liquid Staking</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#1a2e0d" }}>🥞</div>LFJ · Swaps & Liquidity</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2a0d2e" }}>👻</div>Aave V3 · Blue-chip Lending</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2e2a0d" }}>🦅</div>Yield Yak · Auto-compound</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d1e2e" }}>💧</div>Glacier API · Chain Data</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2e0d0d" }}>🟥</div>x402 Protocol · Payments</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d1e2e" }}>🪪</div>ERC-8004 · Agent Identity</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d2e4f" }}>🏔</div>BENQI · Lending & Liquid Staking</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#1a2e0d" }}>🥞</div>LFJ · Swaps & Liquidity</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2a0d2e" }}>👻</div>Aave V3 · Blue-chip Lending</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2e2a0d" }}>🦅</div>Yield Yak · Auto-compound</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d1e2e" }}>💧</div>Glacier API · Chain Data</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#2e0d0d" }}>🟥</div>x402 Protocol · Payments</div>
            <div className="strip-sep">·</div>
            <div className="proto-item"><div className="proto-icon" style={{ background: "#0d1e2e" }}>🪪</div>ERC-8004 · Agent Identity</div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="section-eyebrow">WHAT IT DOES</div>
        <h2 className="section-title">Three primitives.<br/>Zero friction.</h2>
        <p className="section-sub">Plain English goes in. Verified, autonomous DeFi execution comes out. No wallet UX. No protocol knowledge required.</p>

        <div className="feat-grid">
          <div className="feat-card">
            <div className="feat-num">01</div>
            <div className="feat-icon" style={{ background: "var(--red-dim)" }}>🧠</div>
            <div className="feat-title">Intent Parser</div>
            <p className="feat-desc">Claude parses your request into a structured action — amount, protocol, risk tolerance, deadline — and hands it to the routing engine.</p>
            <div className="feat-tags">
              <span className="feat-tag">NL → JSON</span>
              <span className="feat-tag">Claude API</span>
              <span className="feat-tag">Tool calling</span>
            </div>
          </div>

          <div className="feat-card">
            <div className="feat-num">02</div>
            <div className="feat-icon" style={{ background: "var(--blue-dim)" }}>🪪</div>
            <div className="feat-title">Verified Agent Identity</div>
            <p className="feat-desc">The agent holds an ERC-8004 onchain identity. Every transaction is traceable to a registered, reputation-scored agent — not an anonymous wallet.</p>
            <div className="feat-tags">
              <span className="feat-tag">ERC-8004</span>
              <span className="feat-tag">Identity Registry</span>
              <span className="feat-tag">Reputation 94/100</span>
            </div>
          </div>

          <div className="feat-card">
            <div className="feat-num">03</div>
            <div className="feat-icon" style={{ background: "rgba(74,222,128,0.08)" }}>⚡</div>
            <div className="feat-title">Autonomous Execution</div>
            <p className="feat-desc">The agent picks the best protocol for your intent, pays for market data via x402, signs the tx, broadcasts to Avalanche, and returns your receipt.</p>
            <div className="feat-tags">
              <span className="feat-tag">x402 payments</span>
              <span className="feat-tag">ethers.js</span>
              <span className="feat-tag">C-Chain</span>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-inner">
          <div>
            <div className="section-eyebrow">HOW IT WORKS</div>
            <h2 className="section-title">Five steps.<br/>Fifteen seconds.</h2>
            <p className="section-sub" style={{ marginBottom: "48px" }}>From a plain-English prompt to a confirmed onchain transaction.</p>

            <div className="how-steps">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-body">
                  <div className="step-title">You type your intent</div>
                  <p className="step-desc">&quot;Put ₹500 in stable yield&quot; or &quot;Swap 0.1 AVAX for USDC and deposit in BENQI.&quot; Any phrasing, any amount.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div className="step-body">
                  <div className="step-title">Claude parses the intent</div>
                  <p className="step-desc">Claude extracts action, amount, risk level, and preferred protocol. Validates it. Returns structured JSON to the execution engine.</p>
                  <div className="step-tech">claude-sonnet-4-6 · tool_use</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div className="step-body">
                  <div className="step-title">Agent checks identity + buys data</div>
                  <p className="step-desc">ERC-8004 verifies the agent is registered and authorized. The agent pays a micro-fee via x402 to fetch live APY rates before routing.</p>
                  <div className="step-tech">ERC-8004 Identity Registry · x402 PayAI</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">4</div>
                <div className="step-body">
                  <div className="step-title">Transaction executes on Avalanche</div>
                  <p className="step-desc">Agent signs and broadcasts the tx to C-Chain. BENQI, LFJ, or Aave receives it. Block confirms in ~2 seconds.</p>
                  <div className="step-tech">ethers.js · Fuji 43113 · Snowtrace</div>
                </div>
              </div>
              <div className="step">
                <div className="step-num">5</div>
                <div className="step-body">
                  <div className="step-title">Receipt + reputation update</div>
                  <p className="step-desc">You get a receipt with TX hash, protocol used, and estimated APY. Agent writes feedback to the ERC-8004 Reputation Registry.</p>
                  <div className="step-tech">Glacier API · ERC-8004 Reputation Registry</div>
                </div>
              </div>
            </div>
          </div>

          <div className="how-visual">
            <div className="how-card">
              <div className="how-card-title">LIVE EXECUTION · 14.2s AGO</div>
              <div className="flow-items">
                <div className="flow-item done">
                  <div className="fi-icon">✅</div>
                  <div className="fi-text"><strong>Intent parsed</strong><span>action:supply · protocol:BENQI · amount:$6.12</span></div>
                  <div className="fi-status done">DONE</div>
                </div>
                <div className="flow-arrow">↓</div>
                <div className="flow-item done">
                  <div className="fi-icon">✅</div>
                  <div className="fi-text"><strong>ERC-8004 verified</strong><span>agent:0x4f2a · rep:94 · authorized</span></div>
                  <div className="fi-status done">DONE</div>
                </div>
                <div className="flow-arrow">↓</div>
                <div className="flow-item done">
                  <div className="fi-icon">✅</div>
                  <div className="fi-text"><strong>x402 data purchase</strong><span>paid 0.01 USDC → APY:5.4% confirmed</span></div>
                  <div className="fi-status done">DONE</div>
                </div>
                <div className="flow-arrow">↓</div>
                <div className="flow-item done">
                  <div className="fi-icon">✅</div>
                  <div className="fi-text"><strong>Tx broadcast</strong><span>BENQI supply(6.12 USDC) · C-Chain</span></div>
                  <div className="fi-status done">DONE</div>
                </div>
              </div>
              <div className="tx-hash">
                <span>TX CONFIRMED</span>
                <span>0x4a7f…c82d · block 41,209,847</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding: "80px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-num">~2<span className="unit">s</span></div>
            <div className="stat-label">Avalanche C-Chain block finality</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5.4<span className="unit">%</span></div>
            <div className="stat-label">Current BENQI USDC supply APY</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">0<span className="unit">$</span></div>
            <div className="stat-label">Protocol fee. Free to use on Fuji.</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">94<span className="unit">/100</span></div>
            <div className="stat-label">Agent reputation score (ERC-8004)</div>
          </div>
        </div>
      </div>

      <section className="cta-section">
        <div className="cta-eyebrow">TEAM1 INDIA · SPEEDRUN JUNE 2026</div>
        <h2 className="cta-title">Ready to talk?</h2>
        <p className="cta-sub">Connect your wallet to launch the dashboard and execute your first intent.</p>
        <div className="cta-btns">
          <ConnectButton />
        </div>
      </section>

      <footer>
        <div className="footer-left">
          <div className="nav-logo-mark" style={{width: 24, height: 24, borderRadius: 4, background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "#fff"}}>T1</div>
          Built for Team1 India · Speedrun June 2026 · Agentic Payments
        </div>
      </footer>
    </>
  );
}
