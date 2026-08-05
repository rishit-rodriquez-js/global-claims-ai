import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Command, 
  FileText, 
  UserCheck, 
  Bot, 
  Activity, 
  FilePlus, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPaletteModal({ isOpen, onClose, claims = [], onSelectClaim, onNavigate }) {
  const [query, setQuery] = useState('');

  // Handle ESC and Ctrl+K keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open palette
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchingClaims = claims.filter(c => 
    c.id.toLowerCase().includes(query.toLowerCase()) ||
    c.claimantName.toLowerCase().includes(query.toLowerCase()) ||
    c.policyNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.claimType.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    { label: 'Submit New Claim', icon: FilePlus, action: () => { onNavigate('submit'); onClose(); } },
    { label: 'Review Pending Claims Queue', icon: UserCheck, action: () => { onNavigate('officer'); onClose(); } },
    { label: 'Launch AI Copilot Chat', icon: Bot, action: () => { onNavigate('copilot'); onClose(); } },
    { label: 'View System Audit Logs', icon: Activity, action: () => { onNavigate('audit'); onClose(); } },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-[#0F1326] border border-[#00E5FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden z-50 flex flex-col relative"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-[#7C5CFF]/20 flex items-center gap-3 bg-[#151B34]/60">
            <Search className="w-5 h-5 text-[#00E5FF]" />
            <input
              type="text"
              autoFocus
              placeholder="Search claims by ID, claimant, policy, invoice, or type (Ctrl+K)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
            />
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-4 divide-y divide-slate-800/60">
            {/* Matching Claims */}
            {query.trim() !== '' && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider px-2">Matching Claims</span>
                {matchingClaims.length === 0 ? (
                  <p className="text-xs text-slate-500 p-2 italic">No claims match "{query}"</p>
                ) : (
                  matchingClaims.map((claim) => (
                    <button
                      key={claim.id}
                      onClick={() => { onSelectClaim(claim); onClose(); }}
                      className="w-full p-2.5 rounded-xl hover:bg-[#151B34] flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0 font-mono text-xs font-bold">
                          {claim.id.slice(-3)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">{claim.claimantName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{claim.id} • {claim.policyNumber} (${claim.amount?.toLocaleString()})</p>
                        </div>
                      </div>
                      <span className={claim.status === 'Approved' ? 'badge-approved' : 'badge-review'}>
                        {claim.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-1 pt-2">
              <span className="text-[10px] font-bold text-[#7C5CFF] uppercase tracking-wider px-2">Quick Navigation Shortcuts</span>
              {quickActions.map((qa, idx) => {
                const IconComp = qa.icon;
                return (
                  <button
                    key={idx}
                    onClick={qa.action}
                    className="w-full p-2.5 rounded-xl hover:bg-[#151B34] flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4 text-[#7C5CFF]" />
                      <span>{qa.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#060816] border-t border-[#7C5CFF]/20 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> to close</span>
            <span className="text-[#00E5FF]">Grounded in Azure AI Vector Search & Claims DB</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
