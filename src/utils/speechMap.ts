import { normalize } from './text'
const entries: Array<[string,string[]]> = [
  ['A',['a','ah']],['B',['be','bé','bee','b']],['C',['ce','cé','c']],['D',['de','dé','d']],
  ['E',['e','eu','eux']],['F',['effe','ef','f']],['G',['ge','gé','jé','g']],['H',['h','ache']],
  ['I',['i','y']],['J',['ji','j']],['K',['ka','car']],['L',['elle','el','l']],
  ['M',['emme','em','m']],['N',['enne','en','n']],['O',['o','oh']],['P',['pe','pé','p']],
  ['Q',['ku','q']],['R',['erre','er','r']],['S',['esse','es','s']],['T',['te','té','t']],
  ['U',['u','ou']],['V',['ve','vé','v']],['W',['double ve','doublevé','double v','double u','w']],
  ['X',['iks','x']],['Y',['i grec','ygrec','y grec','y']],['Z',['zede','zède','z']],
]
const lookup = new Map<string,string>(); for(const [L,names] of entries) for(const n of names) lookup.set(normalize(n), L)
export function nameToLetter(input:string){ return lookup.get(normalize(input)) ?? null }
export function allNameEntries(){ const out: Array<{name:string;letter:string}> = []; for(const [L,names] of entries) for(const n of names) out.push({name:n,letter:L}); return out }