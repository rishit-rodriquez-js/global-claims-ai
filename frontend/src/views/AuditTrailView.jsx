import React from 'react';
import { Activity, ShieldCheck, Filter, Search, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function AuditTrailView({ auditLogs = [] }) {
  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="stripe-card p-6 border border-slate-800 bg-[#0f172a] flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Activity class="w-4 h-4" />
            <span>Verifiable AI Governance Log</span>
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight">System Audit Trail & AI Reasoning Logs</h1>
          <p class="text-xs text-slate-400 mt-1">
            Every agent action, extracted input, decision, confidence score, evidence, and PII redactions are logged immutably.
          </p>
        </div>

        <div class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs text-emerald-300">
          <ShieldCheck class="w-4 h-4" />
          <span>PII Sanitization Active</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div class="stripe-card border border-slate-800 bg-[#0f172a] overflow-hidden">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-white">Recorded AI Agent Events</h3>
          <span class="text-xs text-slate-400 font-mono">{auditLogs.length} Total Audit Records</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4">Executing Agent</th>
                <th class="py-3 px-4">Claim ID</th>
                <th class="py-3 px-4">Action & Decision</th>
                <th class="py-3 px-4">Confidence</th>
                <th class="py-3 px-4">Evidence & Citations</th>
                <th class="py-3 px-4">PII Security Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} class="hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-sans font-semibold">
                      {log.agent}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-blue-400 font-semibold">{log.claimId}</td>
                  <td class="py-3.5 px-4 font-sans text-white">
                    <div class="font-medium">{log.action}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">{log.decision}</div>
                  </td>
                  <td class="py-3.5 px-4 text-emerald-400 font-bold">{log.confidence}%</td>
                  <td class="py-3.5 px-4 font-sans text-slate-300 max-w-xs text-[11px]">
                    {log.evidence}
                  </td>
                  <td class="py-3.5 px-4 text-slate-400 text-[10px]">
                    <span class="text-emerald-400">{log.piiStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
