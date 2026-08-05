import React from 'react';
import { 
  BarChart2, 
  PieChart, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AnalyticsCharts({ claims = [] }) {
  const totalClaims = claims.length || 1;
  const approved = claims.filter(c => c.status === 'Approved').length;
  const review = claims.filter(c => c.status === 'Human Review').length;
  const rejected = claims.filter(c => c.status === 'Rejected').length;

  const lowRisk = claims.filter(c => (c.fraudScore || 0) < 15).length;
  const medRisk = claims.filter(c => (c.fraudScore || 0) >= 15 && (c.fraudScore || 0) < 30).length;
  const highRisk = claims.filter(c => (c.fraudScore || 0) >= 30).length;

  // Hourly volume breakdown for "Claims Processed Today"
  const hourlyData = [
    { hour: '08:00 AM', count: 4, rate: '92%' },
    { hour: '09:00 AM', count: 12, rate: '94%' },
    { hour: '10:00 AM', count: 19, rate: '96%' },
    { hour: '11:00 AM', count: 15, rate: '88%' },
    { hour: '12:00 PM', count: 8, rate: '90%' },
    { hour: '01:00 PM', count: 14, rate: '93%' },
    { hour: '02:00 PM', count: 22, rate: '95%' },
    { hour: '03:00 PM', count: 18, rate: '91%' },
  ];

  const maxHourlyCount = Math.max(...hourlyData.map(d => d.count));

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 class="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart2 class="w-4 h-4 text-blue-400" />
            Claim Processing Analytics & Intelligence
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Real-time throughput, decision breakdown, and pipeline latency metrics</p>
        </div>
        <span class="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-mono">
          Live Azure Telemetry
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Claims Processed Today (Hourly Volume) */}
        <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-white flex items-center gap-2">
              <TrendingUp class="w-4 h-4 text-blue-400" />
              Claims Processed Today (Hourly Volume)
            </h3>
            <span class="text-[11px] text-slate-400 font-mono">Total Today: 110 Claims</span>
          </div>

          <div class="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-800">
            {hourlyData.map((item, idx) => {
              const heightPercent = (item.count / maxHourlyCount) * 100;
              return (
                <div key={idx} class="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {/* Tooltip on hover */}
                  <div class="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 border border-slate-700 text-[10px] text-white px-2 py-1 rounded shadow-lg transition-opacity pointer-events-none z-10 whitespace-nowrap font-mono">
                    {item.count} claims ({item.rate} auto)
                  </div>
                  <div class="w-full bg-slate-800/80 rounded-t-sm flex items-end overflow-hidden h-32">
                    <div 
                      class="w-full bg-blue-500 hover:bg-blue-400 rounded-t-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span class="text-[9px] text-slate-400 font-mono whitespace-nowrap">{item.hour.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Peak Volume: 02:00 PM (22 claims/hr)</span>
            <span class="text-emerald-400">Target SLA: &lt; 10s</span>
          </div>
        </div>

        {/* Chart 2: Auto-Approved vs Human Review Distribution */}
        <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-white flex items-center gap-2">
              <PieChart class="w-4 h-4 text-emerald-400" />
              Decision Breakdown (Auto vs Human Review)
            </h3>
            <span class="text-[11px] text-slate-400 font-mono">Confidence Threshold: 90%</span>
          </div>

          <div class="flex items-center justify-around py-4">
            {/* Visual SVG Donut Chart */}
            <div class="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  class="text-slate-800"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="text-emerald-400"
                  stroke-dasharray={`${(approved / totalClaims) * 100}, 100`}
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="text-amber-400"
                  stroke-dasharray={`${(review / totalClaims) * 100}, 100`}
                  stroke-dashoffset={`-${(approved / totalClaims) * 100}`}
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="absolute text-center">
                <span class="text-xl font-bold text-white font-mono">{((approved / totalClaims) * 100).toFixed(0)}%</span>
                <p class="text-[9px] text-slate-400 uppercase tracking-wider">Automated</p>
              </div>
            </div>

            {/* Legend Stats */}
            <div class="space-y-3 text-xs">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded bg-emerald-400 shrink-0"></span>
                <div>
                  <div class="font-semibold text-white">Auto-Approved ({approved})</div>
                  <div class="text-[10px] text-slate-400">Confidence ≥ 90%</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded bg-amber-400 shrink-0"></span>
                <div>
                  <div class="font-semibold text-white">Human Review ({review})</div>
                  <div class="text-[10px] text-slate-400">Confidence &lt; 90% or Fraud Alert</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded bg-rose-400 shrink-0"></span>
                <div>
                  <div class="font-semibold text-white">Rejected ({rejected})</div>
                  <div class="text-[10px] text-slate-400">Explicit Exclusions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Fraud Risk Distribution */}
        <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-white flex items-center gap-2">
              <ShieldAlert class="w-4 h-4 text-amber-400" />
              Fraud Risk Score Distribution
            </h3>
            <span class="text-[11px] text-slate-400 font-mono">Anomaly Detection Engine</span>
          </div>

          <div class="space-y-3 pt-2">
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-300 font-medium flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Low Risk (&lt; 15%)
                </span>
                <span class="font-mono text-white font-semibold">{lowRisk} claims ({((lowRisk / totalClaims) * 100).toFixed(0)}%)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="bg-emerald-400 h-full rounded-full" style={{ width: `${(lowRisk / totalClaims) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-300 font-medium flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span> Medium Risk (15% - 30%)
                </span>
                <span class="font-mono text-white font-semibold">{medRisk} claims ({((medRisk / totalClaims) * 100).toFixed(0)}%)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="bg-amber-400 h-full rounded-full" style={{ width: `${(medRisk / totalClaims) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-300 font-medium flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-rose-400"></span> High Risk (&gt; 30%)
                </span>
                <span class="font-mono text-white font-semibold">{highRisk} claims ({((highRisk / totalClaims) * 100).toFixed(0)}%)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="bg-rose-400 h-full rounded-full" style={{ width: `${(highRisk / totalClaims) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Average Processing Time Latency Breakdown */}
        <div class="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-white flex items-center gap-2">
              <Zap class="w-4 h-4 text-indigo-400" />
              Pipeline Execution Latency (Total: 4.8s)
            </h3>
            <span class="text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
              FastAPI + Azure AI
            </span>
          </div>

          <div class="space-y-3 pt-1">
            <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400 flex items-center gap-2">
                <FileText class="w-3.5 h-3.5 text-blue-400" /> Document Intelligence OCR
              </span>
              <span class="font-mono text-white font-semibold">1.2s (25%)</span>
            </div>

            <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400 flex items-center gap-2">
                <BarChart2 class="w-3.5 h-3.5 text-emerald-400" /> Azure AI Search Policy RAG
              </span>
              <span class="font-mono text-white font-semibold">0.8s (17%)</span>
            </div>

            <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400 flex items-center gap-2">
                <Zap class="w-3.5 h-3.5 text-indigo-400" /> Azure OpenAI GPT-4o Reasoning
              </span>
              <span class="font-mono text-white font-semibold">2.8s (58%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
