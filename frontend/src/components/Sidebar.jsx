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
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="space-y-1 py-1.5">
        {!isCollapsed && (
          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <GroupIcon className="w-3 h-3 text-slate-500" />
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
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-medium relative transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && (
                <>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-[#0f172a] border-r border-slate-800/90 flex flex-col justify-between shrink-0 select-none z-20 relative"
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  GlobalClaims <span className="text-blue-400 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise AI OS</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Grouped Navigation Sections */}
        <div className="p-3 space-y-2">
          {renderNavGroup('Workspace', workspaceNav, Layers)}
          {renderNavGroup('AI Engine', aiNav, Brain)}
          {renderNavGroup('Analytics & Audit', analyticsNav, BarChart3)}
        </div>
      </div>

      {/* System Status Footer */}
      {!isCollapsed ? (
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Azure AI Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
            </span>
          </div>
          <div className="text-[10px] text-slate-500 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Vector Search:</span>
              <span className="text-slate-400">Azure RAG</span>
            </div>
            <div className="flex justify-between">
              <span>OCR Agent:</span>
              <span className="text-slate-400">Doc Intel</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" title="Azure AI Status: Online"></span>
        </div>
      )}
    </motion.aside>
  );
}
