import React from 'react'
export default function BigLetter({ letter, blinkOk }: { letter: string | null; blinkOk: boolean }){
  return (
    <div className={`rounded-3xl border bg-white shadow-sm aspect-[3/1] flex items-center justify-center text-7xl md:text-8xl font-black tracking-wider ${blinkOk?'border-emerald-300 bg-emerald-50 text-emerald-700 blink-green':'border-slate-200 text-slate-800'}`}>
      <span>{letter ?? '—'}</span>
    </div>
  )
}