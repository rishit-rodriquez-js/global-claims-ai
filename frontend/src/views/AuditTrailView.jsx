import React, { useState } from 'react';
import { Activity, ShieldCheck, Filter, Search, FileText, CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditTrailView({ auditLogs = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="stripe-card p-6 border border-slate-800 bg-[#0f172a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>Verifiable AI Governance Log</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Audit Trail & AI Reasoning Logs</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Immutably logged timeline of every executed AI agent step, extracted input, RAG vector retrieval, confidence score, evidence, and PII redactions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs text-emerald-300 shrink-0 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PII Sanitization Active</span>
        </div>
      </div>

      {/* Interactive Timeline Stream */}
      <div className="stripe-card p-6 border border-slate-800 bg-[#0f172a] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Audit Event Stream</h3>
          <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Logged Events</span>
        </div>

        <div className="relative pl-6 space-y-6 border-l-2 border-slate-800">
          {auditLogs.map((log, index) => {
            const isExpanded = expandedId === log.id;
            return (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="relative group"
              >
                {/* Timeline Bullet Node */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                </div>

                {/* Event Card */}
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className="stripe-card p-4 border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/50 cursor-pointer transition-all space-y-2 rounded-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
                        {log.agent}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-400">{log.claimId}</span>
                      <span className="text-xs font-bold text-white">{log.action}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {log.timestamp}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <p className="line-clamp-1">{log.decision}</p>
                    <div className="flex items-center gap-2 shrink-0 ml-2 font-mono">
                      <span className="text-emerald-400 font-bold">{log.confidence}% Conf.</span>
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pt-3 border-t border-slate-800/80 space-y-3 overflow-hidden text-xs"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Evidence & Policy Citation</span>
                            <p className="text-slate-300 leading-relaxed font-sans">{log.evidence}</p>
                          </div>

                          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-400" /> Security & PII Redaction
                            </span>
                            <p className="text-emerald-300 font-mono text-[11px]">{log.piiStatus}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
