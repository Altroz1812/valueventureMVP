import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { normalizeLocaleNumberWords, matchLocalizedSpokenOption } from '@/lib/vp-voice-locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type VoiceLang = 'en-IN' | 'te-IN' | 'hi-IN';

type RecognizedAlternative = { transcript: string };
type RecognizedResult = { isFinal: boolean; [index: number]: RecognizedAlternative };
type RecognizedEvent = { resultIndex: number; results: ArrayLike<RecognizedResult> };
type SpeechEngine = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognizedEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechEngine;
  webkitSpeechRecognition?: new () => SpeechEngine;
};

let activeEngine: SpeechEngine | null = null;

export function VoiceLanguage({ value, onChange }: {
  value: VoiceLang; onChange: (next: VoiceLang) => void;
}) {
  return <div className="flex items-center gap-2 text-xs">
    <span className="text-muted-foreground">Voice language</span>
    <Select value={value} onValueChange={v => onChange(v as VoiceLang)}>
      <SelectTrigger aria-label="Voice recognition language" className="h-8 w-32"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="en-IN">English (India)</SelectItem>
        <SelectItem value="te-IN">Telugu</SelectItem>
        <SelectItem value="hi-IN">Hindi</SelectItem>
      </SelectContent>
    </Select>
  </div>;
}

export function VoiceMic({ onTranscript, lang = 'en-IN', disabled = false, label = 'field' }: {
  onTranscript: (transcript: string) => void;
  lang?: VoiceLang;
  disabled?: boolean;
  label?: string;
}) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const engineRef = useRef<SpeechEngine | null>(null);
  const callbackRef = useRef(onTranscript);
  callbackRef.current = onTranscript;

  useEffect(() => () => {
    engineRef.current?.abort();
    if (activeEngine === engineRef.current) activeEngine = null;
    engineRef.current = null;
  }, []);

  function toggle() {
    if (listening) {
      engineRef.current?.stop();
      return;
    }
    if (disabled || typeof window === 'undefined') return;
    const host = window as SpeechWindow;
    const Ctor = host.SpeechRecognition ?? host.webkitSpeechRecognition;
    if (!Ctor) {
      setMessage('Speech recognition unavailable. Enter manually or use supported Chrome/Edge.');
      return;
    }
    if (!window.isSecureContext) {
      setMessage('Microphone requires HTTPS or localhost.');
      return;
    }
    try {
      activeEngine?.abort();
      const engine = new Ctor();
      activeEngine = engine;
      engineRef.current = engine;
      engine.lang = lang;
      engine.continuous = false;
      engine.interimResults = false;
      engine.maxAlternatives = 1;
      engine.onresult = event => {
        const chunks: string[] = [];
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i]?.isFinal) {
            const spoken = event.results[i]?.[0]?.transcript?.trim();
            if (spoken) chunks.push(spoken);
          }
        }
        if (chunks.length) callbackRef.current(chunks.join(' '));
      };
      engine.onerror = event => {
        const hints: Record<string, string> = {
          'not-allowed': 'Microphone permission denied.',
          'no-speech': 'No speech detected. Try again.',
          'network': 'Speech service unavailable. Use manual entry.',
          'language-not-supported': 'This recognition language is not supported on this device.',
        };
        setMessage(hints[event.error] ?? `Microphone error: ${event.error}`);
      };
      engine.onend = () => {
        if (activeEngine === engine) activeEngine = null;
        if (engineRef.current === engine) engineRef.current = null;
        setListening(false);
      };
      setMessage('');
      engine.start();
      setListening(true);
    } catch (error) {
      setListening(false);
      setMessage(error instanceof Error ? error.message : 'Microphone could not start.');
    }
  }

  return <div className="inline-flex shrink-0 items-center gap-1">
    <Button type="button" size="icon" className="min-h-11 min-w-11 md:min-h-9 md:min-w-9" variant={listening ? 'destructive' : 'outline'}
      aria-label={`${listening ? 'Stop voice entry for' : 'Dictate'} ${label}`}
      title={listening ? `Stop dictation: ${label}` : `Dictate: ${label}`}
      disabled={disabled} onClick={toggle}>
      {listening ? <Square className="size-4" /> : disabled ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </Button>
    {message && <span role="status" className="max-w-48 text-xs text-muted-foreground">{message}</span>}
  </div>;
}

export function spokenNumber(value: string): string | null {
  const mapped = Array.from(normalizeLocaleNumberWords(value)).map(ch => {
    const cp=ch.codePointAt(0)??0;
    if(cp>=0x0966&&cp<=0x096f) return String(cp-0x0966); // Hindi/Devanagari digits
    if(cp>=0x0c66&&cp<=0x0c6f) return String(cp-0x0c66); // Telugu digits
    return ch;
  }).join('').toLowerCase().trim();
  const clean=mapped.replace(/\b(rupees?|feet|foot|meters?|sq\.?\s?ft|percent|kilometers?|km)\b/g,'').trim();
  const compact=clean.replace(/[₹,%\s,]/g,'');
  if (/^-?\d+(?:\.\d+)?$/.test(compact)) return compact;
  const units:Record<string,number> = {
    zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
    ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,
    seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,
    sixty:60,seventy:70,eighty:80,ninety:90,
  };
  const magnitudes:Record<string,number>={thousand:1_000,lakh:100_000,lac:100_000,crore:10_000_000};
  const parts=clean.replace(/-/g,' ').split(/\s+/).filter(t=>t&&t!=='and');
  if(!parts.length)return null;
  const point=parts.indexOf('point');
  const integerParts=point>=0?parts.slice(0,point):parts;
  if(integerParts.length===0)return null;
  let total=0, group=0;
  if(integerParts.length>1 && integerParts.every(t=>units[t]!==undefined && units[t]<10)) {
    total=Number(integerParts.map(t=>units[t]).join(''));
  } else {
    for(const token of integerParts){
      if(units[token]!==undefined){group+=units[token];continue;}
      if(token==='hundred'){group=(group||1)*100;continue;}
      if(magnitudes[token]!==undefined){total+=(group||1)*magnitudes[token];group=0;continue;}
      if(/^\d+$/.test(token)){group+=Number(token);continue;}
      return null;
    }
    total+=group;
  }
  if(point<0)return String(total);
  const decimal=parts.slice(point+1).map(t => {
    if(units[t]!==undefined&&units[t]<10)return String(units[t]);
    if(/^\d$/.test(t))return t;
    return null;
  });
  if(!decimal.length||decimal.some(x=>x===null))return null;
  return `${total}.${decimal.join('')}`;
}

function matchSpokenOption(text: string, options: readonly string[]): string | null {
  const normalize = (s: string) => s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const spoken = normalize(text);
  return options.find(o => normalize(o) === spoken) ?? matchLocalizedSpokenOption(text,options);
}

export function VoiceOption({ options, onSelect, lang, disabled, label }: {
  options: readonly string[];
  onSelect: (option: string) => void;
  lang?: VoiceLang;
  disabled?: boolean;
  label: string;
}) {
  const [hint, setHint] = useState('');
  return <div className="inline-flex items-center gap-1">
    <VoiceMic label={label} lang={lang ?? 'en-IN'} disabled={disabled ?? false} onTranscript={spoken => {
      const chosen = matchSpokenOption(spoken, options);
      if (chosen) { setHint(''); onSelect(chosen); }
      else setHint(`No exact option for “${spoken}”. Select manually.`);
    }}/>
    {hint && <span role="status" className="max-w-48 text-xs text-muted-foreground">{hint}</span>}
  </div>;
}
