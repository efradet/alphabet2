import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { pickNextTarget, resetGame, selectFinished, selectVoice, setMic } from '../redux/voiceGameSlice'
import { ensureMicPermission } from '../utils/mic'
export default function VoiceControls(){
  const dispatch = useAppDispatch()
  const voice = useAppSelector(selectVoice)
  const finished = useAppSelector(selectFinished)
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={async()=>{ if(voice.target) return; const ok = await ensureMicPermission(); if(ok && !voice.micOn) dispatch(setMic(true)); dispatch(pickNextTarget()) }}
        className="rounded-2xl px-3 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow"
      >{voice.target ? 'En cours…' : (finished ? 'Rejouer' : 'Commencer')}</button>
      <button onClick={()=>dispatch(resetGame())} className="rounded-2xl px-3 py-2 text-sm font-medium bg-slate-200 hover:bg-slate-300 shadow">Réinitialiser</button>
      <button onClick={()=>dispatch(setMic(!voice.micOn))} className={`rounded-2xl px-3 py-2 text-sm font-medium shadow ${voice.micOn?'bg-emerald-200 hover:bg-emerald-300':'bg-rose-200 hover:bg-rose-300'}`} title={voice.micOn?'Couper le micro':'Activer le micro'}>{voice.micOn?'Micro ON':'Micro OFF'}</button>
    </div>
  )
}