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
  searchQuery = ''
}) {
  const [activeSubTab, setActiveSubTab] = useState('analytics'); // 'analytics' or 'table'

  const filteredClaims = claims.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.policyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClaims = claims.length;
  const approvedCount = claims.filter(c => c.status === 'Approved').length;
  const reviewCount = claims.filter(c => c.status === 'Human Review').length;
  const autoApprovalRate = totalClaims > 0 ? ((approvedCount / totalClaims) * 100).toFixed(1) : 0;

  return (
    <div class="space-y-6">
      {/* Top Banner / Welcome */}
      <div class="stripe-card p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Zap class="w-4 h-4 text-blue-400" />
            <span>GenAI Autonomous Insurance Engine</span>
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight">Claims Processing & Intelligence Dashboard</h1>
          <p class="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time policy validation, AI fraud scoring, and explainable decisioning powered by Azure AI Document Intelligence, Azure AI Search (RAG), and Azure OpenAI.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateOfficer}
            class="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-2 transition-all"
          >
            <UserCheck class="w-3.5 h-3.5 text-amber-400" />
            <span>Human Review ({reviewCount})</span>
          </button>
          <button
            onClick={onNavigateSubmit}
            class="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 shadow-sm transition-all"
          >
            <FileText class="w-3.5 h-3.5" />
            <span>Submit Claim</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Claims Processed</span>
            <FileText class="w-4 h-4 text-blue-400" />
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold text-white">{totalClaims}</span>
            <span class="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp class="w-3 h-3" /> +12% this week
            </span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1">Target decision SLA: &lt; 10s</p>
        </div>

        <div class="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Auto-Approval Rate</span>
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold text-white">{autoApprovalRate}%</span>
            <span class="text-[11px] text-emerald-400 font-medium">Confidence ≥ 90%</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1">{approvedCount} claims automated</p>
        </div>

        <div class="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Human Review Queue</span>
            <Clock class="w-4 h-4 text-amber-400" />
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold text-amber-400">{reviewCount}</span>
            <span class="text-[11px] text-amber-300 font-medium">Action Required</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1">Escalated due to confidence &lt; 90%</p>
        </div>

        <div class="stripe-card p-4 border border-slate-800 bg-[#0f172a]">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg Processing Time</span>
            <Zap class="w-4 h-4 text-indigo-400" />
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold text-white">4.8s</span>
            <span class="text-[11px] text-indigo-400 font-medium">OCR + RAG + LLM</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1">Azure AI Pipeline active</p>
        </div>
      </div>

      {/* Analytics vs Table Sub-Tab Toggle Bar */}
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <div class="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('analytics')}
            class={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart2 class="w-3.5 h-3.5" />
            <span>Processing Analytics (Charts)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('table')}
            class={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'table'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <List class="w-3.5 h-3.5" />
            <span>Recent Claims Table ({filteredClaims.length})</span>
          </button>
        </div>

        <button
          onClick={onNavigateCopilot}
          class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
        >
          <span>Ask Copilot about analytics</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Conditional Render: Analytics Charts or Recent Claims Table */}
      {activeSubTab === 'analytics' && (
        <AnalyticsCharts claims={claims} />
      )}

      {activeSubTab === 'table' && (
        <div class="stripe-card border border-slate-800 bg-[#0f172a] overflow-hidden">
          <div class="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-white">Recent Insurance Claims</h3>
              <p class="text-xs text-slate-400">Click any row to inspect full AI explainability breakdown</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="py-3 px-4">Claim ID</th>
                  <th class="py-3 px-4">Claimant & Policy</th>
                  <th class="py-3 px-4">Claim Type</th>
                  <th class="py-3 px-4">Amount</th>
                  <th class="py-3 px-4">AI Confidence</th>
                  <th class="py-3 px-4">Fraud Risk</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                {filteredClaims.map((claim) => (
                  <tr 
                    key={claim.id}
                    onClick={() => onSelectClaim(claim)}
                    class="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td class="py-3.5 px-4 font-mono font-medium text-blue-400">{claim.id}</td>
                    <td class="py-3.5 px-4">
                      <div class="font-semibold text-white">{claim.claimantName}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{claim.policyNumber} ({claim.policyType})</div>
                    </td>
                    <td class="py-3.5 px-4">{claim.claimType}</td>
                    <td class="py-3.5 px-4 font-mono font-medium text-white">${claim.amount.toLocaleString()}</td>
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            class={`h-full rounded-full ${claim.confidence >= 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ width: `${claim.confidence}%` }}
                          ></div>
                        </div>
                        <span class="font-mono text-xs text-white">{claim.confidence}%</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-medium">
                      <span class={claim.fraudScore > 20 ? 'text-amber-400' : 'text-slate-300'}>
                        {claim.fraudRisk}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class={
                        claim.status === 'Approved' ? 'badge-approved' :
                        claim.status === 'Human Review' ? 'badge-review' : 'badge-rejected'
                      }>
                        {claim.status === 'Approved' && <CheckCircle2 class="w-3 h-3" />}
                        {claim.status === 'Human Review' && <Clock class="w-3 h-3" />}
                        {claim.status === 'Rejected' && <AlertTriangle class="w-3 h-3" />}
                        {claim.status}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectClaim(claim); }}
                        class="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredClaims.length === 0 && (
                  <tr>
                    <td colspan="8" class="py-8 text-center text-xs text-slate-500">
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
