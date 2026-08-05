import React from 'react';
import { FileText, Database, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';

export default function ProgressTimeline({ currentStep }) {
  const steps = [
    { id: 1, label: 'Reading Documents', icon: FileText, desc: 'Azure AI Doc Intel' },
    { id: 2, label: 'Retrieving Policy', icon: Database, desc: 'Azure AI Search RAG' },
    { id: 3, label: 'Fraud Analysis', icon: ShieldAlert, desc: 'Anomaly & Pattern Check' },
    { id: 4, label: 'Decision & Explanation', icon: CheckCircle, desc: 'Azure OpenAI GPT-4o' },
  ];

  return (
    <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a]/90 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <Loader2 class="w-4 h-4 text-blue-400 animate-spin" />
            AI Processing Pipeline Active
          </h3>
          <p class="text-xs text-slate-400">Automated reasoning and policy validation in progress...</p>
        </div>
        <span class="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Step Indicators */}
      <div class="grid grid-cols-4 gap-3 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div 
              key={step.id} 
              class={`p-3 rounded-lg border text-left transition-all ${
                isCurrent 
                  ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : isDone
                  ? 'bg-slate-800/60 border-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div class="flex items-center justify-between mb-2">
                <div class={`w-7 h-7 rounded-md flex items-center justify-center ${
                  isCurrent ? 'bg-blue-500 text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon class="w-4 h-4" />
                </div>
                <span class="text-[10px] font-mono font-medium text-slate-500">0{step.id}</span>
              </div>
              <p class={`text-xs font-semibold ${isCurrent ? 'text-blue-300' : isDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                {step.label}
              </p>
              <p class="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Simple Animated Progress Bar */}
      <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          class="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
