import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectVoice } from '../redux/voiceGameSlice'
export default function LiveHeard(){
  const { heardRaw } = useAppSelector(selectVoice)
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Ce que j'entends</div>
      <div className="min-h-6 text-slate-800">{heardRaw ? <span className="font-medium">« {heardRaw} »</span> : <span className="text-slate-400">—</span>}</div>
    </div>
  )
}