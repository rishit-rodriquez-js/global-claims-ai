import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  Search, 
  UserCheck, 
  Bot, 
  ShieldCheck, 
  Sparkles,
  Activity
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, pendingCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'submit', label: 'Submit Claim', icon: FilePlus },
    { id: 'detail', label: 'Claim Explainability', icon: Search },
    { id: 'officer', label: 'Human Review', icon: UserCheck, badge: pendingCount },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, highlight: true },
    { id: 'audit', label: 'Audit Trail', icon: Activity },
  ];

  return (
    <aside class="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div class="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              GlobalClaims <span class="text-blue-400 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
            </div>
            <p class="text-[11px] text-slate-400 font-medium">Enterprise GenAI MVP</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div class="p-3 space-y-1">
          <div class="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                class={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div class="flex items-center gap-2.5">
                  <Icon class={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span class="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles class="w-2.5 h-2.5" /> Copilot
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div class="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="text-slate-400">Azure AI Status</span>
          <span class="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
          </span>
        </div>
        <div class="text-[11px] text-slate-500 space-y-1">
          <div class="flex justify-between">
            <span>RAG Engine:</span>
            <span class="text-slate-400 font-mono">Azure AI Search</span>
          </div>
          <div class="flex justify-between">
            <span>OCR Agent:</span>
            <span class="text-slate-400 font-mono">Doc Intelligence</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
