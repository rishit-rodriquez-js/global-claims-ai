import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  ShieldAlert, 
  BrainCircuit, 
  SearchCode,
  AlertCircle
} from 'lucide-react';

export default function OfficerReviewView({ claims = [], onUpdateClaimStatus }) {
  const pendingClaims = claims.filter(c => c.status === 'Human Review');
  const [selectedClaimId, setSelectedClaimId] = useState(pendingClaims[0]?.id || claims[0]?.id);
  const [officerNotes, setOfficerNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const activeClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleDecision = (action) => {
    if (!activeClaim) return;
    let newStatus = 'Approved';
    if (action === 'REJECT') newStatus = 'Rejected';
    if (action === 'REQUEST_INFO') newStatus = 'Human Review';

    onUpdateClaimStatus(activeClaim.id, newStatus, officerNotes);
    setStatusMessage(`Claim ${activeClaim.id} updated to ${newStatus} with officer signature.`);
    setOfficerNotes('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  if (!activeClaim) {
    return (
      <div class="p-12 text-center text-slate-400">
        <UserCheck class="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 class="text-sm font-semibold text-white">No Claims Pending Human Review</h3>
        <p class="text-xs text-slate-500 mt-1">All routine claims have been automatically processed by AI agents.</p>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {/* Workspace Header */}
      <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <UserCheck class="w-4 h-4" />
            <span>Claims Officer Review Workspace</span>
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight">Human-in-the-Loop Decision Override</h1>
          <p class="text-xs text-slate-400 mt-1">
            Claims with confidence scores &lt; 90% or elevated fraud flags require manual review.
          </p>
        </div>

        {/* Claim Selector Pills */}
        <div class="flex items-center gap-2 overflow-x-auto">
          {pendingClaims.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClaimId(c.id)}
              class={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedClaimId === c.id
                  ? 'bg-blue-600 text-white border border-blue-400 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {c.id} (${c.amount})
            </button>
          ))}
        </div>
      </div>

      {statusMessage && (
        <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Split Review Workspace */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Claim Details & Document Viewer (5 cols) */}
        <div class="lg:col-span-5 space-y-4">
          <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
            <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              1. Submitted Claim File & Metadata
            </h3>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Claim ID:</span>
                <span class="font-mono text-blue-400 font-semibold">{activeClaim.id}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Claimant:</span>
                <span class="font-semibold text-white">{activeClaim.claimantName}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Policy:</span>
                <span class="font-mono text-slate-300">{activeClaim.policyNumber} ({activeClaim.policyType})</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Claim Amount:</span>
                <span class="font-mono text-white font-bold">${activeClaim.amount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-400">Submitted Date:</span>
                <span class="text-slate-300">{activeClaim.submittedDate}</span>
              </div>
            </div>

            {/* Document Preview Box */}
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <FileText class="w-8 h-8 text-blue-400 mx-auto" />
              <p class="text-xs font-semibold text-white font-mono">{activeClaim.documentName}</p>
              <p class="text-[11px] text-slate-500">OCR Extraction Completed (100% field coverage)</p>
              <div class="pt-2">
                <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 rounded-lg">
                  View Full Document PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: AI Recommendation & Action Buttons (7 cols) */}
        <div class="lg:col-span-7 space-y-4">
          <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
            <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              2. AI Recommendation & Risk Analysis
            </h3>

            {/* Confidence & Fraud Summary */}
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span class="text-amber-400 font-semibold flex items-center gap-1.5">
                  <BrainCircuit class="w-4 h-4" /> AI Confidence Score
                </span>
                <p class="text-2xl font-bold font-mono text-white">{activeClaim.confidence}%</p>
                <p class="text-[10px] text-slate-400">Below 90% auto-approval threshold</p>
              </div>

              <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-slate-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert class="w-4 h-4 text-emerald-400" /> Fraud Risk Score
                </span>
                <p class="text-2xl font-bold font-mono text-white">{activeClaim.fraudRisk}</p>
                <p class="text-[10px] text-slate-400">Duplicate invoice check cleared</p>
              </div>
            </div>

            {/* AI Reason & Retrieved Policy Clause */}
            <div class="space-y-2 text-xs">
              <div class="font-semibold text-white flex items-center gap-1.5">
                <SearchCode class="w-4 h-4 text-blue-400" /> RAG Retrieved Policy Citation
              </div>
              <div class="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-blue-300 font-mono text-[11px]">
                "{activeClaim.retrievedClause}"
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="font-semibold text-white">AI Reason for Escalation</div>
              <p class="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                {activeClaim.explanation}
              </p>
            </div>

            {/* Officer Decision Box */}
            <div class="pt-4 border-t border-slate-800 space-y-3">
              <label class="block text-xs font-semibold text-white">Claims Officer Decision Notes</label>
              <textarea
                rows="2"
                placeholder="Enter mandatory reviewer rationale or notes..."
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              ></textarea>

              <div class="grid grid-cols-3 gap-3 pt-1">
                <button
                  onClick={() => handleDecision('APPROVE')}
                  class="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  <span>Approve Claim</span>
                </button>

                <button
                  onClick={() => handleDecision('REJECT')}
                  class="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <XCircle class="w-4 h-4" />
                  <span>Reject Claim</span>
                </button>

                <button
                  onClick={() => handleDecision('REQUEST_INFO')}
                  class="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <HelpCircle class="w-4 h-4 text-amber-400" />
                  <span>Request Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
