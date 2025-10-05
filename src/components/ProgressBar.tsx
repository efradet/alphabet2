import React from 'react'
export default function ProgressBar({ total, left }: { total: number; left: number }) {
  const pct = Math.max(0, Math.min(100, (left / total) * 100))
  const elapsed = total - left
  let color = 'bg-emerald-500'
  if (elapsed > 25) color = 'bg-rose-500'
  return <div className="w-full h-4 bg-slate-200 rounded-xl overflow-hidden"><div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }}/></div>
}