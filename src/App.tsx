import React, { useEffect, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import BigLetter from './components/BigLetter'
import ProgressBar from './components/ProgressBar'
import AttemptsList from './components/AttemptsList'
import VoiceControls from './components/VoiceControls'
import LiveHeard from './components/LiveHeard'
import LetterGrid from './components/LetterGrid'
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

  const infoText = useMemo(()=> finished ? '🎉 Bravo ! Tu as trouvé toutes les lettres !' : (!voice.target ? 'Appuie sur le bouton rose pour commencer !' : 'Dis la lettre bien fort ! 🗣️'), [finished, voice.target])

  return (
    <div className="min-h-screen w-full bg-pattern text-slate-800 font-sans">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-3xl shadow-lg border-4 border-sky-100">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-sky-600 tracking-tight mb-2">Joue avec les lettres ! 🎨</h1>
            <p className="text-base text-sky-400 font-medium">Apprends l'alphabet en t'amusant !</p>
            {voice.support === 'unsupported' && <p className="mt-2 text-sm font-bold text-rose-500 bg-rose-50 p-2 rounded-xl">Oups ! Ton navigateur ne peut pas nous entendre. 🎤</p>}
          </div>
          <VoiceControls />
        </header>

        <div className="mb-6 rounded-3xl border-4 border-yellow-200 bg-yellow-50 p-5 md:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-lg md:text-xl font-bold text-yellow-700 text-center md:text-left">{infoText}</p>
          {voice.target && (
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm text-yellow-600 font-bold border-2 border-yellow-100">
              Chrono : <span>{voice.timeLeft}s</span>
            </div>
          )}
        </div>

        <LiveHeard />

        <div className="mb-8"><ProgressBar total={voice.total} left={voice.target ? voice.timeLeft : voice.total} /></div>

        <div className="mb-8 max-w-2xl mx-auto">
          <BigLetter letter={voice.target} blinkOk={voice.lastBlinkOk} />
        </div>

        <LetterGrid />

        <AttemptsList />

        <footer className="mt-10 text-center text-sm font-medium text-sky-300">
          Fait avec ❤️ pour les enfants
        </footer>
      </div>
    </div>
  )
}