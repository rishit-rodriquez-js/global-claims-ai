import React from 'react';
import { ShieldCheck, Cpu, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center p-6">
      <div class="stripe-card p-8 max-w-md w-full text-center space-y-4">
        <div class="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto text-blue-400">
          <ShieldCheck class="w-7 h-7" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-white">GlobalClaims AI</h1>
        <p class="text-sm text-slate-400">
          Automated & Explainable Insurance Claim Processing Platform
        </p>
        <div class="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 class="w-4 h-4" />
          <span>Phase 1 Initialized & Active</span>
        </div>
      </div>
    </div>
  );
}
