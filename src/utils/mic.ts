export async function ensureMicPermission(): Promise<boolean> {
  const navAny = navigator as any
  if (!navAny.mediaDevices || !navAny.mediaDevices.getUserMedia) return true
  try { const stream = await navAny.mediaDevices.getUserMedia({ audio: true }); stream.getTracks().forEach((t:MediaStreamTrack)=>t.stop()); return true }
  catch(e){ console.warn('Microphone permission denied or not available', e); return false }
}