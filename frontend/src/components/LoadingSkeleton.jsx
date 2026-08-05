import React from 'react';

export function CardSkeleton() {
  return (
    <div className="stripe-card p-5 border border-slate-800 bg-[#0f172a] space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/3 skeleton-shimmer"></div>
        <div className="h-4 bg-slate-800 rounded w-1/6 skeleton-shimmer"></div>
      </div>
      <div className="h-8 bg-slate-800/80 rounded-lg w-1/2 skeleton-shimmer"></div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-800/60 rounded w-full skeleton-shimmer"></div>
        <div className="h-3 bg-slate-800/60 rounded w-4/5 skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-slate-800/60">
          <td className="py-4 px-4"><div className="h-3 bg-slate-800 rounded w-20 skeleton-shimmer"></div></td>
          <td className="py-4 px-4">
            <div className="h-3.5 bg-slate-800 rounded w-32 mb-1.5 skeleton-shimmer"></div>
            <div className="h-2.5 bg-slate-800/60 rounded w-24 skeleton-shimmer"></div>
          </td>
          <td className="py-4 px-4"><div className="h-3 bg-slate-800 rounded w-24 skeleton-shimmer"></div></td>
          <td className="py-4 px-4"><div className="h-3.5 bg-slate-800 rounded w-16 skeleton-shimmer"></div></td>
          <td className="py-4 px-4"><div className="h-3 bg-slate-800 rounded w-20 skeleton-shimmer"></div></td>
          <td className="py-4 px-4"><div className="h-3 bg-slate-800 rounded w-16 skeleton-shimmer"></div></td>
          <td className="py-4 px-4"><div className="h-5 bg-slate-800 rounded-full w-20 skeleton-shimmer"></div></td>
          <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-800 rounded w-6 ml-auto skeleton-shimmer"></div></td>
        </tr>
      ))}
    </>
  );
}
