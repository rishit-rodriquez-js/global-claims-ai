import React from 'react';
import { Search, Bell, Shield, Sparkles, User, LogOut } from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';

export default function Header({ searchQuery, setSearchQuery, currentUser, onLogout, onNewClaimClick }) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Customer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Claim Officer':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur px-6 flex items-center justify-between shrink-0 select-none">
      {/* Search Bar */}
      <div className="relative w-80 md:w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search claims by ID, claimant, or policy number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Azure OpenAI GPT-5.6-sol</span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onNewClaimClick}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
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
