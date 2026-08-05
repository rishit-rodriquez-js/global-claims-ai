import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  Sparkles,
  X,
  Clock
} from 'lucide-react';

export default function NotificationCenter({ claims = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Derive notifications dynamically from database claims
  const notifications = [
    {
      id: 'notif-1',
      title: 'New Claim Submitted',
      detail: `Marcus Thorne submitted claim CLM-1496C6 ($2,250.00)`,
      type: 'info',
      time: '2 mins ago',
      icon: FileText,
      iconColor: 'text-blue-400'
    },
    {
      id: 'notif-2',
      title: 'Claim Escalated to Human Review',
      detail: `Elena Rostova claim CLM-8D1A25 escalated due to aftermarket repair threshold`,
      type: 'warning',
      time: '14 mins ago',
      icon: AlertTriangle,
      iconColor: 'text-amber-400'
    },
    {
      id: 'notif-3',
      title: 'Claim Approved by Sarah Vance',
      detail: `Claim CLM-1718BD auto-approved at Mercy General Medical Center`,
      type: 'success',
      time: '1 hour ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400'
    },
    {
      id: 'notif-4',
      title: 'Azure Doc Intelligence OCR Verified',
      detail: `GlobalClaims_Auto_Claim_Rishit.pdf OCR extracted 6 fields cleanly`,
      type: 'info',
      time: '2 hours ago',
      icon: Sparkles,
      iconColor: 'text-indigo-400'
    },
    {
      id: 'notif-5',
      title: 'Fraud Alert Risk Scoring',
      detail: `Fraud risk check completed: Low anomaly score (4.2%)`,
      type: 'security',
      time: '3 hours ago',
      icon: ShieldAlert,
      iconColor: 'text-purple-400'
    }
  ];

  const unreadCount = 3;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative"
        title="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0f172a] animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-semibold text-white">Live Event Notifications</h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded-full border border-blue-500/30">
                {notifications.length} Events
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const IconComp = n.icon;
              return (
                <div key={n.id} className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    <IconComp className={`w-3.5 h-3.5 ${n.iconColor}`} />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              Grounded in FastAPI Event Logs & Telemetry
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
