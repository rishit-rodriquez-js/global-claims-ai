import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ChevronRight,
  UserCheck,
  Zap,
  ArrowUpRight,
  BarChart2,
  List
} from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';

export default function DashboardView({ 
  claims = [], 
  onSelectClaim, 
  onNavigateSubmit, 
  onNavigateOfficer,
  onNavigateCopilot,
  searchQuery = '',
  currentUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('analytics'); // 'analytics' or 'table'

  const filteredClaims = claims.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.policyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomer = currentUser?.role === 'Customer';
  const customerClaims = claims.filter(c => c.userId === currentUser?.id || c.claimantName === currentUser?.name);

  const totalClaims = isCustomer ? customerClaims.length : claims.length;
  const approvedCount = (isCustomer ? customerClaims : claims).filter(c => c.status === 'Approved').length;
  const reviewCount = (isCustomer ? customerClaims : claims).filter(c => c.status === 'Human Review').length;
  const autoApprovalRate = totalClaims > 0 ? ((approvedCount / totalClaims) * 100).toFixed(1) : 0;

  // Customer Portal View
  if (isCustomer) {
    return (
      <div className="space-y-6">
        <div className="stripe-card p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Customer Self-Service Claims Portal</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, {currentUser?.name || 'Customer'}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Track your active insurance claims, upload supporting bills/invoices, and view grounded AI evaluation timelines.
            </p>
          </div>
          <button
            onClick={onNavigateSubmit}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>File New Claim</span>
          </button>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>My Total Claims</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white font-mono">{customerClaims.length}</span>
          </div>

          <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Approved Claims</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{approvedCount}</span>
          </div>

          <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Under Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-amber-400 font-mono">{reviewCount}</span>
          </div>
        </div>

        {/* Customer Claims List */}
        <div className="stripe-card border border-slate-800 bg-[#0f172a] overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">My Submitted Claims & AI Status</h3>
          </div>

          <div className="divide-y divide-slate-800/60">
            {customerClaims.map((claim) => (
              <div 
                key={claim.id} 
                onClick={() => onSelectClaim(claim)}
                className="p-4 hover:bg-slate-800/40 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{claim.id}</span>
                    <span className={claim.status === 'Approved' ? 'badge-approved' : 'badge-review'}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white">{claim.claimType} • ${claim.amount?.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400">{claim.hospitalName || 'Facility'} • Diagnosis: {claim.diagnosis || 'Condition'}</p>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Submitted: {claim.submittedDate}</span>
                    <span className="text-xs text-blue-400 hover:underline font-medium">View AI Timeline & Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="stripe-card p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>GenAI Autonomous Insurance Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Claims Officer Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time policy validation, AI fraud scoring, and explainable decisioning powered by Azure AI Document Intelligence, Azure AI Search (RAG), and Azure OpenAI.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateOfficer}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-2 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Human Review Queue ({reviewCount})</span>
          </button>
          <button
            onClick={onNavigateSubmit}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Submit Claim</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Claims Processed</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{totalClaims}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12% this week
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Target decision SLA: &lt; 10s</p>
        </div>

        <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Auto-Approval Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{autoApprovalRate}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">Confidence ≥ 90%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{approvedCount} claims automated</p>
        </div>

        <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Human Review Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-400">{reviewCount}</span>
            <span className="text-[11px] text-amber-300 font-medium">Action Required</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Escalated due to confidence &lt; 90%</p>
        </div>

        <div className="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg Pipeline Latency</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">3.92s</span>
            <span className="text-[11px] text-indigo-400 font-medium">1.4s OCR • 0.8s RAG</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">1.6s LLM Reasoning</p>
        </div>
      </div>

      {/* Analytics vs Table Sub-Tab Toggle Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Processing Analytics (Charts)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'table'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Recent Claims Table ({filteredClaims.length})</span>
          </button>
        </div>

        <button
          onClick={onNavigateCopilot}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
        >
          <span>Ask Copilot about analytics</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Conditional Render: Analytics Charts or Recent Claims Table */}
      {activeSubTab === 'analytics' && (
        <AnalyticsCharts claims={claims} />
      )}

      {activeSubTab === 'table' && (
        <div className="stripe-card border border-slate-800 bg-[#0f172a] overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Insurance Claims</h3>
              <p className="text-xs text-slate-400">Click any row to inspect full AI explainability breakdown</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Claimant & Policy</th>
                  <th className="py-3 px-4">Claim Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">AI Confidence</th>
                  <th className="py-3 px-4">Fraud Risk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClaims.map((claim) => (
                  <tr 
                    key={claim.id}
                    onClick={() => onSelectClaim(claim)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-400">{claim.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{claim.claimantName}</div>
                      <div className="text-[10px] text-slate-400">{claim.hospitalName || 'Metro Health'} • <span className="text-blue-300">{claim.diagnosis || 'Care'}</span></div>
                      <div className="text-[10px] text-slate-500 font-mono">{claim.policyNumber} ({claim.policyType})</div>
                    </td>
                    <td className="py-3.5 px-4">{claim.claimType}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-white">${claim.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${claim.confidence >= 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ width: `${claim.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs text-white">{claim.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <span className={claim.fraudScore > 20 ? 'text-amber-400' : 'text-slate-300'}>
                        {claim.fraudRisk}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={
                        claim.status === 'Approved' ? 'badge-approved' :
                        claim.status === 'Human Review' ? 'badge-review' : 'badge-rejected'
                      }>
                        {claim.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                        {claim.status === 'Human Review' && <Clock className="w-3 h-3" />}
                        {claim.status === 'Rejected' && <AlertTriangle className="w-3 h-3" />}
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectClaim(claim); }}
                        className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredClaims.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-xs text-slate-500">
                      No insurance claims found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

}
