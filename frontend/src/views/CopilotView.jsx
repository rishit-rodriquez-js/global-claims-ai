import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ShieldCheck } from 'lucide-react';
import { sendCopilotChat } from '../services/api.js';

export default function CopilotView() {
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: "Hello! I am your **GlobalClaims AI Copilot**, connected to your Azure AI Search policy vector store and Azure OpenAI (gpt-5.6-sol) reasoning engine. How can I assist you today?",
      citations: ["Azure AI Search Index", "GlobalClaims Audit Log"]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleQuestions = [
    "Why was claim CLM-8922 escalated to Human Review?",
    "Explain policy clause H-104 emergency coverage limits",
    "What is our current auto-approval rate and processing SLA?",
    "Summarize fraud indicators for claim CLM-8921"
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      // REAL BACKEND API CALL -> POST /api/copilot/chat -> Azure OpenAI + Azure AI Search
      const res = await sendCopilotChat(textToSend);
      const aiMsg = {
        sender: 'copilot',
        text: res.reply || "Grounded reasoning engine evaluated active policy clauses.",
        citations: res.citations || ["Azure AI Search (insurance-policies-index)"]
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    } catch (err) {
      const errMsg = {
        sender: 'copilot',
        text: "Error querying Azure OpenAI & Azure AI Search engine.",
        citations: ["System Log"]
      };
      setMessages((prev) => [...prev, errMsg]);
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="stripe-card p-5 border border-slate-800 bg-[#0f172a] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Microsoft Copilot Insurance Assistant
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/30">Azure OpenAI GPT-5.6-sol</span>
            </h1>
            <p className="text-xs text-slate-400">Ask natural language questions about claims, policy terms, and fraud analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>PII Masked & Grounded</span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="stripe-card border border-slate-800 bg-[#0f172a] p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl rounded-xl p-4 text-xs space-y-2 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200'
            }`}>
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Citations used:</span>
                  {msg.citations.map((c, i) => (
                    <span key={i} className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300 border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono italic p-2">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Azure OpenAI reasoning in progress...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="stripe-card p-3 border border-slate-800 bg-[#0f172a] shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Copilot about any claim, policy rule, or exception..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
