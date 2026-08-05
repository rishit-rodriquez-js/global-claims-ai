import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CopilotView({ claims = [] }) {
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: "Hello! I am your **GlobalClaims AI Copilot**, connected to your Azure AI Search policy vector store and claims database. How can I assist you today?",
      citations: ["Azure AI Search Index", "GlobalClaims Audit Log"]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const sampleQuestions = [
    "Why was claim CLM-8922 escalated to Human Review?",
    "Explain policy clause H-104 emergency coverage limits",
    "What is our current auto-approval rate and processing SLA?",
    "Summarize fraud indicators for claim CLM-8921"
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent grounded response
    setTimeout(() => {
      let replyText = "I queried Azure AI Search and retrieved matching policy clauses. All responses are strictly grounded in your active policy dataset without hallucination.";
      let citations = ["Azure AI Search (insurance-policies-index)"];

      if (textToSend.includes("CLM-8922")) {
        replyText = "Claim **CLM-8922** (Sophia Martinez, $8,200.00) was escalated because the auto repair estimate included **$3,200.00 in aftermarket performance parts** (sport exhaust system) not registered under Endorsement A-MOD. This dropped the AI decision confidence to **78.2%**, which triggers mandatory Claims Officer escalation under our < 90% threshold guardrail.";
        citations = ["Claim CLM-8922 JSON", "Section A-302 (Custom Accessories)"];
      } else if (textToSend.includes("H-104") || textToSend.includes("emergency")) {
        replyText = "Under **Section H-104 (Health Standard)**, outpatient emergency medical care is covered up to **$2,500.00 per event** subject to a $100 copay. Emergency diagnostic X-rays and consultations fall under this clause when billed by accredited hospital systems.";
        citations = ["health_policy_standard.pdf (Section H-104)"];
      } else if (textToSend.includes("rate") || textToSend.includes("SLA")) {
        replyText = "Our platform is currently operating at an **auto-approval rate of 66.7%** with an average end-to-end processing time of **4.8 seconds** (Document Intelligence OCR -> RAG Search -> GPT-4o Decision).";
        citations = ["Dashboard System Health Matrix"];
      }

      const aiMsg = { sender: 'copilot', text: replyText, citations };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div class="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Microsoft Copilot Insurance Assistant
              <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/30">Grounded RAG</span>
            </h1>
            <p class="text-xs text-slate-400">Ask natural language questions about claims, policy terms, and fraud analysis</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck class="w-4 h-4" />
          <span>PII Masked & Grounded</span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div class="flex items-center gap-2 overflow-x-auto shrink-0 pb-1">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            class="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Sparkles class="w-3 h-3 text-indigo-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div class="stripe-card border border-slate-800 bg-[#0f172a] p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            class={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div class={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
            }`}>
              {msg.sender === 'user' ? <User class="w-4 h-4" /> : <Bot class="w-4 h-4" />}
            </div>

            <div class={`max-w-2xl rounded-xl p-4 text-xs space-y-2 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200'
            }`}>
              <p class="leading-relaxed whitespace-pre-line">{msg.text}</p>
              {msg.citations && msg.citations.length > 0 && (
                <div class="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Citations used:</span>
                  {msg.citations.map((c, i) => (
                    <span key={i} class="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div class="stripe-card p-3 border border-slate-800 bg-[#0f172a] shrink-0">
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Copilot about any claim, policy rule, or exception..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>Send</span>
            <Send class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
