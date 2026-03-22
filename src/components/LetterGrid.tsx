import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectVoice } from '../redux/voiceGameSlice'
import { ALPHABET } from '../constants/alphabet'

export default function LetterGrid() {
  const { recognized, target } = useAppSelector(selectVoice)

  return (
    <div className="mt-8 mb-8 p-6 bg-white rounded-3xl shadow-xl border-4 border-sky-100">
      <h3 className="text-xl font-bold text-sky-600 mb-4 text-center">Ta collection de lettres</h3>
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
        {ALPHABET.map((letter) => {
          const isRecognized = recognized[letter]
          const isTarget = target === letter

          return (
            <div
              key={letter}
              className={`
                aspect-square flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-300
                ${isRecognized
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md transform scale-105 rotate-3'
                  : isTarget
                    ? 'bg-sky-100 text-sky-600 border-2 border-sky-400 animate-pulse'
                    : 'bg-slate-50 text-slate-300 border border-slate-100'
                }
              `}
            >
              {letter}
            </div>
          )
        })}
      </div>
    </div>
  )
}
