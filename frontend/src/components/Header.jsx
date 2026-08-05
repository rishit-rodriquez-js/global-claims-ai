import React from 'react';
import { Search, Bell, Shield, Sparkles, User, LogOut } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, currentUser, onLogout, onNewClaimClick }) {
  return (
    <header class="h-16 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur px-6 flex items-center justify-between shrink-0">
      {/* Search Bar */}
      <div class="relative w-96">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search claims by ID, claimant, or policy number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          class="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Header Actions */}
      <div class="flex items-center gap-4">
        {/* Environment Badge */}
        <div class="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Shield class="w-3.5 h-3.5 text-blue-400" />
          <span>Azure OpenAI GPT-5.6-sol</span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onNewClaimClick}
          class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>File New Claim</span>
        </button>

        {/* Notification & User Profile */}
        <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
          <button class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 relative transition-colors">
            <Bell class="w-4 h-4" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          <div class="flex items-center gap-2 pl-2">
            <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User class="w-4 h-4" />
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-xs font-semibold text-white leading-none">{currentUser?.name || "Senior Officer"}</p>
              <p class="text-[10px] text-slate-400">{currentUser?.role || "Claim Officer"}</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              >
                <LogOut class="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
