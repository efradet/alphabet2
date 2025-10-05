import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ALPHABET } from '../constants/alphabet'
import type { RootState, AppDispatch } from './store'
import { nameToLetter, allNameEntries } from '../utils/speechMap'
import { normalize } from '../utils/text'
import { similarity } from '../utils/fuzzy'

export type Attempt = { id:number; target:string; said:string; success:boolean; at:number }

export interface VoiceGameState {
  pending: string[]
  recognized: Record<string, boolean>
  target: string | null
  attempts: Attempt[]
  running: boolean
  timeLeft: number
  total: number
  micOn: boolean
  lastBlinkOk: boolean
  support: 'ok' | 'unsupported'
  heardRaw: string
  heardNormalized: string
}

const TOTAL_SECONDS = 30
const initialState: VoiceGameState = {
  pending: [...ALPHABET],
  recognized: {},
  target: null,
  attempts: [],
  running: false,
  timeLeft: TOTAL_SECONDS,
  total: TOTAL_SECONDS,
  micOn: false,
  lastBlinkOk: false,
  support: 'ok',
  heardRaw: '',
  heardNormalized: '',
}

const slice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setSupport: (s, a:PayloadAction<'ok'|'unsupported'>) => { s.support = a.payload },
    startRound: (s, a:PayloadAction<string>) => { s.target=a.payload; s.running=true; s.timeLeft=s.total; s.lastBlinkOk=false; s.heardRaw=''; s.heardNormalized='' },
    stopRound: (s) => { s.running=false; s.target=null; s.timeLeft=s.total; s.heardRaw=''; s.heardNormalized='' },
    tick: (s) => { if(s.running) s.timeLeft = Math.max(0, s.timeLeft - 1) },
    setMic: (s, a:PayloadAction<boolean>) => { s.micOn = a.payload },
    addAttempt: (s, a:PayloadAction<Omit<Attempt,'id'|'at'>>) => { const id=s.attempts.length+1; s.attempts.unshift({ id, at: Date.now(), ...a.payload }) },
    markRecognized: (s, a:PayloadAction<string>) => { const L=a.payload; if(!s.recognized[L]){ s.recognized[L]=true; s.pending=s.pending.filter(x=>x!==L) } },
    blinkOk: (s) => { s.lastBlinkOk = true },
    clearBlinkOk: (s) => { s.lastBlinkOk = false },
    resetGame: () => ({ ...initialState }),
    setTimeLeft: (s, a:PayloadAction<number>) => { s.timeLeft = a.payload },
    setHeard: (s, a:PayloadAction<{raw:string; normalized:string}>) => { s.heardRaw=a.payload.raw; s.heardNormalized=a.payload.normalized },
    clearHeard: (s) => { s.heardRaw=''; s.heardNormalized='' },
  },
})

export const {
  setSupport, startRound, stopRound, tick, setMic, addAttempt,
  markRecognized, blinkOk, clearBlinkOk, resetGame, setTimeLeft,
  setHeard, clearHeard
} = slice.actions

export const selectVoice = (s:RootState)=>s.voice
export const selectFinished = (s:RootState)=>s.voice.pending.length===0

function pickRandom<T>(arr:T[]){ return arr[Math.floor(Math.random()*arr.length)] }

export const pickNextTarget = () => (dispatch:AppDispatch, getState:()=>RootState) => {
  const { pending } = getState().voice
  if (pending.length===0){ dispatch(stopRound()); return }
  dispatch(startRound(pickRandom(pending)))
}

export const onFinalTranscript = (text:string) => (dispatch:AppDispatch, getState:()=>RootState) => {
  const { target } = getState().voice
  if (!target) return
  const letter = mapTranscriptToLetter(text)
  if (!letter){ dispatch(addAttempt({ target, said: text, success: false })); return }
  if (letter===target){
    dispatch(addAttempt({ target, said: letter, success: true }))
    dispatch(markRecognized(target)); dispatch(blinkOk()); setTimeout(()=>dispatch(clearBlinkOk()),700)
    dispatch(stopRound()); setTimeout(()=>dispatch(pickNextTarget()),400)
  } else {
    dispatch(addAttempt({ target, said: letter, success: false }))
  }
}

export const onInterimTranscript = (text:string) => (dispatch:AppDispatch) => {
  const norm = normalize(text); dispatch(setHeard({ raw: text, normalized: norm }))
}

export const handleTimeout = () => (dispatch:AppDispatch, getState:()=>RootState) => {
  const { target } = getState().voice; if(!target) return
  dispatch(addAttempt({ target, said: '(temps écoulé)', success: false }))
  dispatch(stopRound()); dispatch(pickNextTarget())
}

export function mapTranscriptToLetter(text:string): string | null {
  if (!text) return null
  const cleaned = normalize(text)
  if (/^[a-z]$/.test(cleaned)) return cleaned.toUpperCase()
  const fillers = new Set(['la','le','les','un','une','des','c','est','cest','lettre','je','pense','dirais'])
  const tokens = cleaned.split(' ').filter(t=>t && !fillers.has(t))
  for (let win=Math.min(4,tokens.length); win>=1; win--) {
    for (let i=0; i+win<=tokens.length; i++) {
      const seg = tokens.slice(i,i+win).join(' ')
      const L = nameToLetter(seg); if (L) return L
    }
  }
  const entries = allNameEntries()
  let best: { letter:string; score:number } | null = null
  const candidates = new Set<string>(); for (let win=Math.min(4,tokens.length); win>=1; win--) for (let i=0;i+win<=tokens.length;i++){ candidates.add(tokens.slice(i,i+win).join(' ')) }
  candidates.add(tokens.join(' '))
  for (const cand of candidates) for (const {name,letter} of entries) {
    const s = similarity(cand, normalize(name)); if (s>=0.78 && (!best || s>best.score)) best={ letter, score:s }
  }
  return best?.letter ?? null
}

export default slice.reducer