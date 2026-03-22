import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { pickNextTarget, resetGame, selectFinished, selectVoice, setMic } from '../redux/voiceGameSlice'
import { ensureMicPermission } from '../utils/mic'
export default function VoiceControls(){
  const dispatch = useAppDispatch()
  const voice = useAppSelector(selectVoice)
  const finished = useAppSelector(selectFinished)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={async()=>{ if(voice.target) return; const ok = await ensureMicPermission(); if(ok && !voice.micOn) dispatch(setMic(true)); dispatch(pickNextTarget()) }}
        className={`
          rounded-2xl px-6 py-3 text-base font-bold text-white shadow-lg transition-all active:scale-95
          ${voice.target ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}
        `}
      >
        {voice.target ? 'C\'est parti !' : (finished ? 'Rejouer 🎮' : 'Commencer ! 🚀')}
      </button>

      <button
        onClick={()=>dispatch(resetGame())}
        className="rounded-2xl px-4 py-3 text-sm font-bold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-md transition-all active:scale-95"
      >
        Recommencer 🔄
      </button>

      <button
        onClick={()=>dispatch(setMic(!voice.micOn))}
        className={`
          rounded-2xl px-4 py-3 text-sm font-bold shadow-md transition-all active:scale-95
          ${voice.micOn
            ? 'bg-sky-400 text-white hover:bg-sky-500'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }
        `}
        title={voice.micOn?'Couper le micro':'Activer le micro'}
      >
        {voice.micOn ? 'Micro ON 🎤' : 'Micro OFF 🔇'}
      </button>
    </div>
  )
}