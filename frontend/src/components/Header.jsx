import React from 'react';
import { Search, Bell, Shield, Sparkles, User, LogOut, Command, Cpu } from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';

export default function Header({ searchQuery, setSearchQuery, currentUser, onLogout, onNewClaimClick, onOpenCmdPalette }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Customer':
        return 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]';
      case 'Claim Officer':
        return 'bg-[#7C5CFF]/10 text-[#7C5CFF] border-[#7C5CFF]/30 shadow-[0_0_10px_rgba(124,92,255,0.2)]';
      case 'Admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="h-16 border-b border-[#7C5CFF]/20 bg-[#0F1326]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Global Search Bar with Ctrl+K trigger */}
      <div 
        onClick={onOpenCmdPalette}
        className="relative w-80 md:w-96 cursor-pointer group"
      >
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#00E5FF] transition-colors" />
        <input
          type="text"
          readOnly
          placeholder="Global AI Search claims, policies, logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#151B34] border border-[#7C5CFF]/20 group-hover:border-[#00E5FF]/50 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner cursor-pointer"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-[#060816] px-1.5 py-0.5 rounded border border-slate-700 font-mono">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Environment AI Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#151B34] border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-mono shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <Cpu className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          <span>Azure OpenAI GPT-5.6-sol</span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onNewClaimClick}
          className="bg-gradient-to-r from-[#00E5FF] to-[#7C5CFF] hover:from-[#00E5FF]/90 hover:to-[#7C5CFF]/90 text-[#060816] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>File New Claim</span>
        </button>

        {/* Notification & User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <NotificationCenter />

          <div className="flex items-center gap-3 pl-1">
            {/* User Avatar with Online Dot */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs overflow-hidden">
                {currentUser?.profileImageUrl ? (
                  <img src={currentUser.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span 
                title="Online Status: Active"
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f172a]"
              ></span>
            </div>

            {/* Name, Role Badge & Last Login */}
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-white leading-none">{currentUser?.name || "User"}</p>
                <span className={`text-[9px] px-1.5 py-0.2 font-semibold rounded border ${getRoleBadgeStyle(currentUser?.role)}`}>
                  {currentUser?.role || "Customer"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {currentUser?.lastLogin ? `Last login: ${currentUser.lastLogin}` : currentUser?.email || "Active Session"}
              </p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
