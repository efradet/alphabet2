import { normalize } from './text'
export type OnTranscript = (text:string)=>void
export type OnInterim = (text:string)=>void
export type Recognizer = { start:()=>void; stop:()=>void; isSupported:boolean; readonly active:boolean }
export function createSpeechRecognizer(onTranscript:OnTranscript, onInterim?:OnInterim):Recognizer{
  const Impl:any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  let rec:any=null, _active=false; const isSupported=!!Impl
  function start(){ if(!isSupported||_active) return; rec=new Impl(); rec.lang='fr-FR'; rec.interimResults=true; rec.continuous=true; _active=true;
    rec.onresult=(e:any)=>{ for(let i=e.resultIndex;i<e.results.length;i++){ const r=e.results[i]; const txt=r[0].transcript??''; if(r.isFinal){ const text=normalize(txt); if(text) onTranscript(text) } else { onInterim?.(txt) } } }
    rec.onerror=(e:any)=>{ console.error('SpeechRecognition error:', e) }
    rec.onend=()=>{ if(_active){ try{ rec.start() }catch{} } }
    try{ rec.start() }catch{}
  }
  function stop(){ _active=false; try{ rec?.stop() }catch{} }
  return { start, stop, isSupported, get active(){ return _active } }
}