import type { AppKey } from './apps';

export type Frequency = 'always' | 'every3' | 'hourly' | 'daily';

export interface Settings {
  app: AppKey | null;
  frequency: Frequency;
  /** Epoch ms until which prompts are paused, or null. */
  pausedUntil: number | null;
  opens: number;
  lastPromptAt: number | null;
  /** Question ids already shown, oldest first. */
  seen: string[];
  installedAt: number;
}

const KEY = 'unlockdrill.settings.v1';

export const FREQUENCIES: { key: Frequency; label: string; help: string }[] = [
  { key: 'always', label: 'Every time I open it', help: 'One question on each open.' },
  { key: 'every3', label: 'Every third open', help: 'Two opens pass, the third asks.' },
  { key: 'hourly', label: 'At most once an hour', help: 'Checking something quickly stays quick.' },
  { key: 'daily', label: 'Once a day', help: 'A single question, then the phone is yours.' },
];

export const DEFAULTS: Settings = {
  app: null, frequency: 'hourly', pausedUntil: null, opens: 0, lastPromptAt: null, seen: [], installedAt: Date.now(),
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS, installedAt: Date.now() };
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch { return { ...DEFAULTS }; }
}

export function saveSettings(s: Settings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: run stateless */ }
}

export function isPaused(s: Settings, now = Date.now()): boolean {
  return s.pausedUntil !== null && s.pausedUntil > now;
}

/** Decide whether this app opening gets a question. Pure: does not mutate. */
export function shouldPrompt(s: Settings, now = Date.now()): boolean {
  if (isPaused(s, now)) return false;
  const since = s.lastPromptAt === null ? Infinity : now - s.lastPromptAt;
  switch (s.frequency) {
    case 'always': return true;
    case 'every3': return (s.opens + 1) % 3 === 0;
    case 'hourly': return since >= 60 * 60 * 1000;
    case 'daily':  return since >= 24 * 60 * 60 * 1000;
  }
}

export function pauseFor(s: Settings, minutes: number, now = Date.now()): Settings {
  return { ...s, pausedUntil: now + minutes * 60 * 1000 };
}
