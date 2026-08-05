import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  SearchCode, 
  BrainCircuit, 
  UserCheck, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import ExplainabilityTimeline from '../components/ExplainabilityTimeline.jsx';

export default function ClaimDetailView({ claim, onBack, onNavigateOfficer }) {
  if (!claim) {
    return (
      <div class="p-12 text-center text-slate-400">
        <p>No claim selected. Please choose a claim from the overview table.</p>
        <button onClick={onBack} class="mt-4 px-4 py-2 bg-slate-800 text-xs text-white rounded-lg">Return to Overview</button>
      </div>
    );
  }

  const isApproved = claim.status === 'Approved';
  const isReview = claim.status === 'Human Review';

  return (
    <div class="space-y-6 max-w-5xl mx-auto">
      {/* Top Nav Action */}
      <div class="flex items-center justify-between">
        <button
          onClick={onBack}
          class="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Back to Claims Overview</span>
        </button>

        <div class="flex items-center gap-3">
          {isReview && (
            <button
              onClick={onNavigateOfficer}
              class="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <UserCheck class="w-4 h-4" />
              <span>Review in Officer Workspace</span>
            </button>
          )}
          <span class="text-xs text-slate-500 font-mono">Claim ID: {claim.id}</span>
        </div>
      </div>

      {/* Main Claim Header Card */}
      <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold text-white font-mono">{claim.id}</h1>
              <span class={isApproved ? 'badge-approved' : isReview ? 'badge-review' : 'badge-rejected'}>
                {isApproved && <CheckCircle2 class="w-3.5 h-3.5" />}
                {isReview && <Clock class="w-3.5 h-3.5" />}
                {!isApproved && !isReview && <AlertTriangle class="w-3.5 h-3.5" />}
                {claim.status}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Claimant: <strong class="text-white">{claim.claimantName}</strong> • Policy: <span class="font-mono text-slate-300">{claim.policyNumber}</span> ({claim.policyType})
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-slate-400">Total Claim Amount</p>
            <p class="text-2xl font-bold text-white font-mono">${claim.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* AI Explainability Metric Grid */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Confidence Gauge */}
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>AI Decision Confidence</span>
              <BrainCircuit class="w-4 h-4 text-blue-400" />
            </div>
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-white font-mono">{claim.confidence}%</span>
              <span class={`text-xs font-semibold ${claim.confidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {claim.confidence >= 90 ? '≥ 90% Auto Threshold' : '< 90% Escalation'}
              </span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                class={`h-full rounded-full ${claim.confidence >= 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${claim.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Fraud Risk Indicator */}
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>Fraud Risk Assessment</span>
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{claim.fraudRisk}</span>
            </div>
            <p class="text-[11px] text-slate-500">
              Verified against duplicate invoice hashes & velocity pattern check.
            </p>
          </div>

          {/* Supporting Document */}
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>Extracted Source Document</span>
              <FileText class="w-4 h-4 text-indigo-400" />
            </div>
            <div class="font-mono text-xs text-blue-300 font-semibold truncate">
              {claim.documentName}
            </div>
            <p class="text-[11px] text-slate-500">Parsed by Azure AI Document Intelligence</p>
          </div>
        </div>
      </div>

      {/* Interactive Explainability Timeline */}
      <ExplainabilityTimeline timeline={claim.timeline} />

      {/* RAG Policy Clause Citations */}
      <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <SearchCode class="w-4 h-4 text-blue-400" />
            Retrieved Policy Clause (Azure AI Search RAG)
          </h3>
          <span class="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            Cosine Similarity Match: 0.94
          </span>
        </div>

        <div class="p-4 rounded-lg bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 font-mono leading-relaxed">
          "{claim.retrievedClause}"
        </div>
      </div>

      {/* Grounded Explanation & Evidence List */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-3">
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <BrainCircuit class="w-4 h-4 text-indigo-400" />
            Azure OpenAI Grounded Reasoning
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            {claim.explanation}
          </p>
        </div>

        <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-3">
          <h3 class="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            Verifiable Evidence Chain
          </h3>
          <ul class="space-y-2 text-xs text-slate-300">
            {claim.evidence?.map((item, idx) => (
              <li key={idx} class="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
