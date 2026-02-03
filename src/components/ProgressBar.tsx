import React from 'react'
export default function ProgressBar({ total, left }: { total: number; left: number }) {
  const pct = Math.max(0, Math.min(100, (left / total) * 100))
  const elapsed = total - left

  let gradient = 'from-green-400 to-emerald-500'
  if (elapsed > 20) gradient = 'from-yellow-400 to-orange-500'
  if (elapsed > 25) gradient = 'from-red-400 to-rose-600'

  return (
    <div className="w-full h-8 bg-sky-100 rounded-full overflow-hidden shadow-inner border-4 border-white">
      <div
        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-linear rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}