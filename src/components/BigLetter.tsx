import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function BigLetter({ letter, blinkOk }: { letter: string | null; blinkOk: boolean }){
  useEffect(() => {
    if (blinkOk) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#FFD700', '#00CED1', '#ADFF2F', '#FFA500']
      })
    }
  }, [blinkOk])

  return (
    <div className={`
      rounded-[3rem] border-8 bg-white shadow-2xl aspect-[2/1] md:aspect-[3/1] flex items-center justify-center
      text-8xl md:text-9xl font-black tracking-tighter transition-all duration-300 transform
      ${blinkOk
        ? 'border-green-400 bg-green-50 text-green-600 scale-110 rotate-3'
        : 'border-sky-200 text-sky-500 hover:scale-105'
      }
      ${letter ? 'animate-pop' : ''}
    `}>
      <span className="drop-shadow-lg">{letter ?? '?'}</span>
    </div>
  )
}