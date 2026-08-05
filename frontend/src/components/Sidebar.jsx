import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  Search, 
  UserCheck, 
  Bot, 
  ShieldCheck, 
  Sparkles,
  Activity,
  ChevronLeft,
  ChevronRight,
  Layers,
  Brain,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ currentTab, setCurrentTab, pendingCount, currentUser }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userRole = currentUser?.role || 'Customer';

  const workspaceNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Customer', 'Claim Officer'] },
    { id: 'submit', label: 'Submit Claim', icon: FilePlus, roles: ['Customer', 'Claim Officer'] },
    { id: 'detail', label: 'Claim Explainability', icon: Search, roles: ['Customer', 'Claim Officer'] },
    { id: 'officer', label: 'Human Review', icon: UserCheck, badge: pendingCount, roles: ['Claim Officer'] },
  ];

  const aiNav = [
    { id: 'copilot', label: 'AI Copilot', icon: Bot, highlight: true, roles: ['Customer', 'Claim Officer'] },
  ];

  const analyticsNav = [
    { id: 'audit', label: 'Audit Trail', icon: Activity, roles: ['Claim Officer'] },
  ];

  const filterNav = (items) => items.filter(i => i.roles.includes(userRole));

  const renderNavGroup = (title, items, GroupIcon) => {
    const visible = filterNav(items);
    if (visible.length === 0) return null;

    return (
      <div className="space-y-1 py-1">
        {!isCollapsed && (
          <div className="px-3 py-1 text-[10px] font-bold text-[#4DFFB4] uppercase tracking-wider flex items-center gap-1.5 opacity-90">
            <GroupIcon className="w-3 h-3 text-[#4DFFB4]" />
            <span>{title}</span>
          </div>
        )}
        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'} rounded-2xl text-xs font-semibold relative transition-all duration-200 ${
                isActive
                  ? 'bg-[#4DFFB4]/15 text-[#4DFFB4] border border-[#4DFFB4]/40 shadow-[0_0_20px_rgba(77,255,180,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePillIndicator"
                  className="absolute left-1.5 w-1.5 h-6 bg-[#4DFFB4] rounded-full shadow-[0_0_12px_#4DFFB4]"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4DFFB4]' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && (
                <>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FF8761]/20 text-[#FF8761] border border-[#FF8761]/30">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#3BCBFF]/20 text-[#3BCBFF] border border-[#3BCBFF]/30 font-mono">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className="m-3 my-4 rounded-3xl bg-[#10252E]/70 backdrop-blur-2xl border border-white/10 flex flex-col justify-between shrink-0 select-none z-30 shadow-2xl relative"
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#4DFFB4] via-[#3BCBFF] to-[#FF8761] flex items-center justify-center text-[#081018] shadow-[0_0_15px_rgba(77,255,180,0.3)] shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                  GlobalClaims <span className="text-[#4DFFB4] text-[10px] px-1.5 py-0.5 rounded-full bg-[#4DFFB4]/10 border border-[#4DFFB4]/30 font-mono">AI-OS</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Bioluminescent Engine</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Nav Sections */}
        <div className="p-3 space-y-2">
          {renderNavGroup('Workspace', workspaceNav, Layers)}
          {renderNavGroup('AI Engine', aiNav, Brain)}
          {renderNavGroup('Analytics & Audit', analyticsNav, BarChart3)}
        </div>
      </div>

      {/* System Status Footer */}
      {!isCollapsed ? (
        <div className="p-4 m-3 rounded-2xl border border-[#4DFFB4]/20 bg-[#081018]/60 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Azure AI Status</span>
            <span className="flex items-center gap-1.5 text-[#4DFFB4] font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#4DFFB4] animate-pulse shadow-[0_0_10px_#4DFFB4]"></span> Active
            </span>
          </div>
          <div className="text-[10px] text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Vector Search:</span>
              <span className="text-[#3BCBFF]">Azure RAG</span>
            </div>
            <div className="flex justify-between">
              <span>OCR Agent:</span>
              <span className="text-[#3BCBFF]">Doc Intel</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4DFFB4] inline-block animate-pulse shadow-[0_0_10px_#4DFFB4]" title="Azure AI Status: Active"></span>
        </div>
      )}
    </motion.aside>
  );
}
