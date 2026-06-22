"use client";
import { useState, useRef, useEffect } from "react";
import { Receipt } from "./Receipt";
import { StepTrace } from "./StepTrace";

interface Message {
  role: "user" | "agent";
  content?: string;
  data?: any;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "DeFi Agent online. ERC-8004 identity verified · reputation 94/100 · x402 payments active.\n\nI can swap tokens, supply liquidity, find yield, and execute DeFi transactions on Avalanche C-Chain — autonomously. Just tell me what you want in plain English."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    try {
      const response = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "agent", data }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "agent", content: "Error communicating with agent." }]);
    }

    setLoading(false);
  }

  return (
    <main className="main">
      <div className="chat-header">
        <div className="ch-left">
          <div>
            <div className="ch-title">Agent Chat</div>
            <div className="ch-sub">Type an intent. Agent executes on Avalanche.</div>
          </div>
        </div>
        <div className="ch-right">
          <div className="ch-badge x402">x402 ACTIVE</div>
          <div className="ch-badge erc">ERC-8004 VERIFIED</div>
        </div>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role === "user" ? "user" : ""}`}>
            <div className={`msg-avatar ${msg.role === "user" ? "user-av" : "agent"}`}>
              {msg.role === "user" ? "YOU" : "🤖"}
            </div>
            <div className="msg-bubble">
              {msg.content && <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>}
              
              {msg.data?.status === "clarification_needed" && (
                <p><strong>Clarification Needed:</strong> {msg.data.explanation}</p>
              )}

              {msg.data?.status === "success" && (
                <>
                  <p>Parsed intent: <strong>{msg.data.intent.action} {msg.data.intent.fromAsset || "asset"}</strong>.</p>
                  <StepTrace steps={msg.data.result.steps} />
                  <Receipt result={msg.data.result} agent={msg.data.agent} />
                </>
              )}

              {msg.data?.status === "error" && (
                <>
                  <p style={{ color: "var(--red)" }}>Error executing transaction: {msg.data.result?.error}</p>
                  <StepTrace steps={msg.data.result?.steps} />
                </>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg" id="typing-indicator">
            <div className="msg-avatar agent">🤖</div>
            <div className="msg-bubble">
              <div className="typing"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-bar">
        <div className="input-context">
          <div className="ctx-chip on">⚡ x402 active</div>
          <div className="ctx-chip on">🪪 ERC-8004</div>
          <div className="ctx-chip">🔴 Mainnet mode</div>
        </div>
        <div className="input-row">
          <textarea
            id="chat-input"
            placeholder="Tell the agent what to do… 'Put $20 into the best yield', 'Swap AVAX for USDC'"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button id="send-btn" onClick={sendMessage} disabled={loading}>
            ↑
          </button>
        </div>
        <div className="input-hint">ENTER to send · SHIFT+ENTER for new line · agent signs + broadcasts autonomously</div>
      </div>
    </main>
  );
}
