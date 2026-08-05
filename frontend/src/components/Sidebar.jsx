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

export default function Sidebar({ currentTab, setCurrentTab, pendingCount, currentUser }) {
  const userRole = currentUser?.role || 'Customer';

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['Customer', 'Claim Officer'] },
    { id: 'submit', label: 'Submit Claim', icon: FilePlus, roles: ['Customer', 'Claim Officer'] },
    { id: 'detail', label: 'Claim Explainability', icon: Search, roles: ['Customer', 'Claim Officer'] },
    { id: 'officer', label: 'Human Review', icon: UserCheck, badge: pendingCount, roles: ['Claim Officer'] },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, highlight: true, roles: ['Customer', 'Claim Officer'] },
    { id: 'audit', label: 'Audit Trail', icon: Activity, roles: ['Claim Officer'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              GlobalClaims <span className="text-blue-400 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise GenAI MVP</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Navigation
          </div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="w-2.5 h-2.5" /> Copilot
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400">Azure AI Status</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
          </span>
        </div>
        <div className="text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>RAG Engine:</span>
            <span className="text-slate-400 font-mono">Azure AI Search</span>
          </div>
          <div className="flex justify-between">
            <span>OCR Agent:</span>
            <span className="text-slate-400 font-mono">Doc Intelligence</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
