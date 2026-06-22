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
