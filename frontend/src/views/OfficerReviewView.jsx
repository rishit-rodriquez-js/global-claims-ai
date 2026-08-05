import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  ShieldAlert, 
  BrainCircuit, 
  SearchCode,
  AlertCircle,
  Command
} from 'lucide-react';
import { reviewClaimApi } from '../services/api.js';
import DocumentExtractionReport from '../components/DocumentExtractionReport.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfficerReviewView({ claims = [], onUpdateClaimStatus, currentUser }) {
  const pendingClaims = claims.filter(c => c.status === 'Human Review');
  const [selectedClaimId, setSelectedClaimId] = useState(pendingClaims[0]?.id || claims[0]?.id);
  const [officerNotes, setOfficerNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleDecision = async (action) => {
    if (!activeClaim) return;
    let newStatus = 'Approved';
    if (action === 'REJECT') newStatus = 'Rejected';
    if (action === 'REQUEST_INFO') newStatus = 'Human Review';

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // REAL BACKEND API CALL -> POST /api/claims/{id}/review
      await reviewClaimApi(activeClaim.id, newStatus, officerNotes, currentUser?.id || 'USR-801');
      onUpdateClaimStatus(activeClaim.id, newStatus, officerNotes);

      setStatusMessage(`Claim ${activeClaim.id} updated to ${newStatus} in Azure SQL database.`);
      setOfficerNotes('');
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(`Officer review error: ${err.message}`);
    }
  };

  // Power User Keyboard Shortcuts (Shift+A, Shift+R, Shift+I)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        handleDecision('APPROVE');
      } else if (e.shiftKey && e.key.toUpperCase() === 'R') {
        e.preventDefault();
        handleDecision('REJECT');
      } else if (e.shiftKey && e.key.toUpperCase() === 'I') {
        e.preventDefault();
        handleDecision('REQUEST_INFO');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeClaim, officerNotes]);

  if (!activeClaim) {
    return (
      <div className="p-12 text-center text-slate-400">
        <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white">No Claims Pending Human Review</h3>
        <p className="text-xs text-slate-500 mt-1">All routine claims have been automatically processed by AI agents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="stripe-card p-6 border border-slate-800 bg-[#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Claims Officer Review Workspace</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Human-in-the-Loop Decision Override</h1>
          <p className="text-xs text-slate-400 mt-1">
            Claims with confidence scores &lt; 90% or elevated fraud flags require manual review.
          </p>
        </div>

        {/* Claim Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {pendingClaims.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClaimId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
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
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!activeClaim ? (
        <EmptyState
          title="Review Queue Cleared"
          description="There are currently no claims requiring human officer review."
        />
      ) : (
        /* Vertical Review Workspace Flow */
        <div className="space-y-6">
        {/* Section 1 (Top - Full Width): Submitted Claim File & Metadata */}
        <div className="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Submitted Claim File & Metadata
          </h3>

          {/* Metadata Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-400 block text-[11px]">Claim ID:</span>
              <span className="font-mono text-blue-400 font-bold text-sm">{activeClaim.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Patient / Claimant:</span>
              <span className="font-semibold text-white">{activeClaim.claimantName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Hospital / Facility:</span>
              <span className="text-slate-200 font-medium">{activeClaim.hospitalName || 'Metro Health Medical Center'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Diagnosis / Treatment:</span>
              <span className="text-blue-300 font-medium">{activeClaim.diagnosis || 'Acute Care Consultation'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Invoice Number:</span>
              <span className="font-mono text-slate-300">{activeClaim.invoiceNumber || 'INV-9001'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Policy Number:</span>
              <span className="font-mono text-slate-300">{activeClaim.policyNumber} ({activeClaim.policyType})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Claim Amount:</span>
              <span className="font-mono text-white font-bold text-sm">${activeClaim.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Submitted Date:</span>
              <span className="text-slate-300">{activeClaim.submittedDate}</span>
            </div>
          </div>

          {/* Document Extraction Report Component (Full Width) */}
          <DocumentExtractionReport claim={activeClaim} />
        </div>

        {/* Section 2 (Below Section 1 - Full Width): AI Recommendation & Risk Analysis */}
        <div className="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. AI Recommendation & Risk Analysis
          </h3>

          {/* Confidence & Fraud Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5 text-xs">
                <BrainCircuit className="w-4 h-4" /> AI Confidence Score
              </span>
              <p className="text-3xl font-bold font-mono text-white">{activeClaim.confidence}%</p>
              <p className="text-[11px] text-slate-400">
                {activeClaim.confidence >= 90 ? '≥ 90% Auto-Approval Threshold' : 'Below 90% Auto-Approval Threshold'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Fraud Risk Score
              </span>
              <p className="text-3xl font-bold font-mono text-white">{activeClaim.fraudRisk}</p>
              <p className="text-[11px] text-slate-500">Anomaly check against duplicate invoice hashes & velocity pattern</p>
            </div>
          </div>

          {/* AI Reason & Retrieved Policy Clause */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <SearchCode className="w-4 h-4 text-blue-400" /> RAG Retrieved Policy Citation
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-blue-300 font-mono text-xs leading-relaxed">
              "{activeClaim.retrievedClause}"
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white">AI Reason & Evaluation Log</div>
            <p className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 leading-relaxed text-xs">
              {activeClaim.explanation}
            </p>
          </div>

          {/* Officer Decision Box */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <label className="block text-xs font-semibold text-white">Claims Officer Decision Notes</label>
            <textarea
              rows="3"
              placeholder="Enter mandatory reviewer rationale or notes..."
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            ></textarea>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('APPROVE')}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Claim</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('REJECT')}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Claim</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleDecision('REQUEST_INFO')}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Request Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
