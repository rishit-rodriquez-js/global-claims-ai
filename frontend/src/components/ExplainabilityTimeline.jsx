import React, { useState } from 'react';
import { UploadCloud, FileScan, SearchCode, ShieldAlert, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ExplainabilityTimeline({ timeline = [] }) {
  const [selectedStage, setSelectedStage] = useState(0);

  const defaultStages = [
    {
      step: "Upload",
      icon: UploadCloud,
      status: "completed",
      title: "Document Ingestion & File Validation",
      detail: "Uploaded binary stream validated. PII masking filters initialized. Passed prompt injection security checks."
    },
    {
      step: "OCR",
      icon: FileScan,
      status: "completed",
      title: "Azure Document Intelligence Extraction",
      detail: "Structured extraction converted raw invoice scan into JSON. Extracted Claim Amount, Service Provider ID, and Billing Items."
    },
    {
      step: "Policy Match",
      icon: SearchCode,
      status: "completed",
      title: "Azure AI Search RAG Retrieval",
      detail: "Queried policy clause vector database. Retrieved top matching clause section with cosine similarity 0.94."
    },
    {
      step: "Fraud Check",
      icon: ShieldAlert,
      status: "completed",
      title: "Fraud & Anomaly Scoring Agent",
      detail: "Scanned historical claims database for duplicate invoice hashes, suspicious billing amounts, and claim velocity anomalies."
    },
    {
      step: "Reasoning",
      icon: BrainCircuit,
      status: "completed",
      title: "Azure OpenAI Policy Coverage Validation",
      detail: "Grounded reasoning engine evaluated extracted claim fields strictly against retrieved policy clauses."
    },
    {
      step: "Decision",
      icon: CheckCircle2,
      status: "completed",
      title: "Final Recommendation & Confidence Calculation",
      detail: "Generated final confidence score and explainable citation summary. Passed safety guardrails."
    }
  ];

  const stages = timeline.length > 0 ? timeline.map((item, idx) => ({
    ...defaultStages[idx % defaultStages.length],
    detail: item.detail || defaultStages[idx % defaultStages.length].detail,
    timestamp: item.timestamp
  })) : defaultStages;

  const currentActive = stages[selectedStage] || stages[0];
  const IconComponent = currentActive.icon || CheckCircle2;

  return (
    <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <BrainCircuit class="w-4 h-4 text-blue-400" />
            AI Explainability Timeline
          </h3>
          <p class="text-xs text-slate-400">Click any phase to inspect evidence and reasoning logs</p>
        </div>
        <span class="text-[11px] text-slate-400 bg-slate-800 px-2 py-1 rounded font-mono border border-slate-700">
          6-Agent Traced Stages
        </span>
      </div>

      {/* Horizontal Flow Line */}
      <div class="grid grid-cols-6 gap-2 relative">
        {stages.map((st, index) => {
          const Icon = st.icon;
          const isSelected = selectedStage === index;
          return (
            <button
              key={index}
              onClick={() => setSelectedStage(index)}
              class={`flex flex-col items-center p-2.5 rounded-lg border text-center transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div class={`w-7 h-7 rounded-md flex items-center justify-center mb-1.5 ${
                isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <Icon class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-semibold leading-tight">{st.step}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Active Stage Detail Box */}
      <div class="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <IconComponent class="w-4 h-4" />
        </div>
        <div class="space-y-1 text-left">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-semibold text-white">{currentActive.title}</h4>
            {currentActive.timestamp && (
              <span class="text-[10px] text-slate-500 font-mono">{currentActive.timestamp}</span>
            )}
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">{currentActive.detail}</p>
        </div>
      </div>
    </div>
  );
}
