import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  Sparkles,
  X,
  Clock,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter({ claims = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'claims', 'approvals', 'fraud', 'ocr'

  const rawNotifications = [
    {
      id: 'notif-1',
      category: 'claims',
      title: 'New Claim Submitted',
      detail: `Marcus Thorne submitted claim CLM-1496C6 ($2,250.00)`,
      time: '2 mins ago',
      icon: FileText,
      iconColor: 'text-blue-400'
    },
    {
      id: 'notif-2',
      category: 'fraud',
      title: 'Claim Escalated to Human Review',
      detail: `Elena Rostova claim CLM-8D1A25 escalated due to aftermarket repair threshold`,
      time: '14 mins ago',
      icon: AlertTriangle,
      iconColor: 'text-amber-400'
    },
    {
      id: 'notif-3',
      category: 'approvals',
      title: 'Claim Approved by Officer',
      detail: `Claim CLM-1718BD auto-approved at Mercy General Medical Center`,
      time: '1 hour ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400'
    },
    {
      id: 'notif-4',
      category: 'ocr',
      title: 'Azure Doc Intelligence OCR Verified',
      detail: `GlobalClaims_Auto_Claim_Rishit.pdf OCR extracted 6 fields cleanly`,
      time: '2 hours ago',
      icon: Sparkles,
      iconColor: 'text-indigo-400'
    },
    {
      id: 'notif-5',
      category: 'fraud',
      title: 'Fraud Alert Risk Scoring',
      detail: `Fraud risk check completed: Low anomaly score (4.2%)`,
      time: '3 hours ago',
      icon: ShieldAlert,
      iconColor: 'text-purple-400'
    }
  ];

  const filteredNotifications = filterTab === 'all' 
    ? rawNotifications 
    : rawNotifications.filter(n => n.category === filterTab);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative"
        title="Live Notification Drawer"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0f172a] animate-pulse"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />

            {/* Slide-Over Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-96 max-w-full bg-[#0f172a] border-l border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">Live Notification Drawer</h3>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                {['all', 'claims', 'approvals', 'fraud', 'ocr'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${
                      filterTab === tab
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tab === 'all' ? 'All Events' : tab}
                  </button>
                ))}
              </div>

              {/* Notification Stream */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {filteredNotifications.map((n) => {
                  const IconComp = n.icon;
                  return (
                    <motion.div 
                      key={n.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 hover:bg-slate-800/40 transition-colors flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5 shadow-inner">
                        <IconComp className={`w-4 h-4 ${n.iconColor}`} />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" /> {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{n.detail}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  Grounded in FastAPI Event Telemetry & Azure Stream Analytics
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
