import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectVoice } from '../redux/voiceGameSlice'
export default function AttemptsList(){
  const { attempts } = useAppSelector(selectVoice)
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Tentatives</h2>
      <div className="max-h-56 overflow-auto grid grid-cols-1 gap-2 pr-1">
        {attempts.length===0 && <p className="text-sm text-slate-500">Aucune tentative pour le moment.</p>}
        {attempts.map(a=>(
          <div key={a.id} className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${a.success?'border-emerald-200 bg-emerald-50 text-emerald-700':'border-rose-200 bg-rose-50 text-rose-700'}`}>
            <div className="font-semibold">Cible: {a.target}</div>
            <div className="opacity-70">Dit: <span className="font-mono">{a.said}</span></div>
            <div className="text-xs opacity-60">{new Date(a.at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}