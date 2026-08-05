import React from 'react';
import { FileSearch, Sparkles, FolderOpen, AlertCircle } from 'lucide-react';

export default function EmptyState({ 
  icon: IconComponent = FileSearch, 
  title = "No Claims Found", 
  description = "No insurance claims match your current filter criteria.",
  actionText,
  onAction
}) {
  return (
    <div className="stripe-card p-10 border border-slate-800 bg-[#0f172a] text-center space-y-4 my-4 animate-fade-in">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
        <IconComponent className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all border border-blue-400/30"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
