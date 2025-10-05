import React, { useEffect, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import BigLetter from './components/BigLetter'
import ProgressBar from './components/ProgressBar'
import AttemptsList from './components/AttemptsList'
import VoiceControls from './components/VoiceControls'
import LiveHeard from './components/LiveHeard'
import { createSpeechRecognizer } from './utils/recognition'
import { handleTimeout, onFinalTranscript, onInterimTranscript, selectFinished, selectVoice, setSupport, setTimeLeft, tick } from './redux/voiceGameSlice'

export default function App(){
  const dispatch = useAppDispatch()
  const voice = useAppSelector(selectVoice)
  const finished = useAppSelector(selectFinished)
  const intervalRef = useRef<number|null>(null)
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer>|null>(null)

  useEffect(()=>{
    const rec = createSpeechRecognizer(
      (text)=>{ dispatch(onFinalTranscript(text)) },
      (interim)=>{ dispatch(onInterimTranscript(interim)) }
    )
    recognizerRef.current = rec
    dispatch(setSupport(rec.isSupported ? 'ok' : 'unsupported'))
    return ()=>{ rec.stop() }
  }, [dispatch])

  useEffect(()=>{
    const rec = recognizerRef.current; if(!rec) return
    if(voice.micOn && rec.isSupported) rec.start(); else rec.stop()
  }, [voice.micOn])

  useEffect(()=>{
    if(intervalRef.current){ window.clearInterval(intervalRef.current); intervalRef.current=null }
    if(!voice.target) return
    dispatch(setTimeLeft(voice.total))
    intervalRef.current = window.setInterval(()=>{ dispatch(tick()) }, 1000) as unknown as number
    return ()=>{ if(intervalRef.current){ window.clearInterval(intervalRef.current); intervalRef.current=null } }
  }, [voice.target, dispatch])

  useEffect(()=>{ if(voice.target && voice.timeLeft<=0) dispatch(handleTimeout()) }, [voice.timeLeft, voice.target, dispatch])

  const infoText = useMemo(()=> finished ? '🎉 Bravo ! Toutes les lettres ont été reconnues.' : (!voice.target ? 'Clique sur Commencer puis dis la lettre affichée.' : 'Dis la lettre à voix haute (ex: « bé », « dé », « i grec »)…'), [finished, voice.target])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Jeu des lettres — dire à haute voix</h1>
            <p className="text-sm text-slate-600">30s par lettre. Barre verte (0–20s), rouge (25–30s). Le jeu s'arrête quand toutes les lettres sont reconnues.</p>
            {voice.support === 'unsupported' && <p className="mt-1 text-xs text-rose-600">La reconnaissance vocale n'est pas supportée. Essaie Chrome desktop.</p>}
          </div>
          <VoiceControls />
        </header>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex items-center justify-between">
          <p className="text-sm text-slate-700">{infoText}</p>
          <div className="text-sm text-slate-500">Temps restant : <span className="font-semibold">{voice.target ? voice.timeLeft : 0}s</span></div>
        </div>

        <LiveHeard />

        <div className="mb-5"><ProgressBar total={voice.total} left={voice.target ? voice.timeLeft : voice.total} /></div>
        <div className="mb-5"><BigLetter letter={voice.target} blinkOk={voice.lastBlinkOk} /></div>
        <AttemptsList />

        <footer className="mt-6 text-xs text-slate-500">Astuce : dis les noms des lettres en français (ex. « bé », « cé », « double vé », « i grec »).</footer>
      </div>
    </div>
  )
}