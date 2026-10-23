import type { Question } from './questions';
import { currentAccount, supabase } from './account';

/**
 * On-device practice history for the profile preview: answers, optional mistake tags, diagnostic results.
 * Kept in localStorage; when signed in it is also synced to the user's row in public.user_progress.
 */

/** Local dev builds only until sign-in exists; production keeps today's behavior. */
export const PREVIEW = import.meta.env.DEV;

export type MistakeTag = 'careless' | 'concept' | 'time';
export const MISTAKE_TAGS: { key: MistakeTag; label: string }[] = [
  { key: 'careless', label: 'Careless' },
  { key: 'concept', label: 'Concept' },
  { key: 'time', label: 'Time' },
];

export interface AnswerRecord {
  questionId: string;
  section: string;
  topic: string;
  correct: boolean;
  at: number;
  source: 'practice' | 'diagnostic';
  tag?: MistakeTag;
}

export interface DiagnosticResult { at: number; total: number; correct: number; missedTopics: string[] }

export interface Progress { answers: AnswerRecord[]; diagnostic: DiagnosticResult | null; referral: string | null }

const BASE_KEY = 'unlockdrill.progress.v1';
/** Each preview account gets its own history; signed out uses the guest one. */
const keyFor = (email: string | null) => email ? `${BASE_KEY}:${email}` : BASE_KEY;
const key = () => keyFor(currentAccount()?.email ?? null);
const EMPTY: Progress = { answers: [], diagnostic: null, referral: null };
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(key());
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) } : { ...EMPTY };
  } catch { return { ...EMPTY }; }
}

export function saveProgress(p: Progress): void {
  try { localStorage.setItem(key(), JSON.stringify(p)); } catch { /* private mode: run stateless */ }
  schedulePush();
}

let pushTimer: number | undefined;
function schedulePush(): void {
  if (!currentAccount()) return;
  window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => { void pushProgress(); }, 600);
}

async function pushProgress(): Promise<void> {
  const a = currentAccount();
  const sb = supabase();
  if (!a || !sb) return;
  await sb.from('user_progress').upsert({ user_id: a.id, name: a.name || null, data: loadProgress(), updated_at: new Date().toISOString() });
}

/** Merges the account's saved progress into this device and pushes the result back. Safe to call on every profile visit. */
export async function syncProgress(): Promise<void> {
  const a = currentAccount();
  const sb = supabase();
  if (!a || !sb) return;
  const { data } = await sb.from('user_progress').select('data').eq('user_id', a.id).maybeSingle();
  const remote = (data?.data ?? null) as Partial<Progress> | null;
  const local = loadProgress();
  if (remote) {
    const seen = new Map<string, AnswerRecord>();
    for (const r of [...(remote.answers ?? []), ...local.answers]) seen.set(`${r.questionId}:${r.at}`, { ...seen.get(`${r.questionId}:${r.at}`), ...r });
    const answers = [...seen.values()].sort((x, y) => x.at - y.at).slice(-500);
    const diagnostic = [remote.diagnostic ?? null, local.diagnostic].filter(Boolean).sort((x, y) => y!.at - x!.at)[0] ?? null;
    try { localStorage.setItem(key(), JSON.stringify({ answers, diagnostic, referral: remote.referral ?? local.referral })); } catch { /* ignore */ }
  }
  await pushProgress();
}

export function recordAnswer(q: Question, correct: boolean, source: AnswerRecord['source'] = 'practice'): void {
  if (!PREVIEW) return;
  const p = loadProgress();
  const rec: AnswerRecord = { questionId: q.id, section: q.section, topic: q.topic, correct, at: Date.now(), source };
  saveProgress({ ...p, answers: [...p.answers, rec].slice(-500) });
}

/** Tags the most recent wrong answer to this question. Passing null clears it. */
export function tagMistake(questionId: string, tag: MistakeTag | null): void {
  const p = loadProgress();
  const i = p.answers.map(a => !a.correct && a.questionId === questionId).lastIndexOf(true);
  if (i < 0) return;
  const answers = [...p.answers];
  answers[i] = { ...answers[i], tag: tag ?? undefined };
  saveProgress({ ...p, answers });
}

export interface WeekSummary { answered: number; correct: number; topMissTopic: string | null; missesByTopic: [string, number][] }

export function weekSummary(p: Progress, now = Date.now()): WeekSummary {
  const week = p.answers.filter(a => now - a.at < WEEK);
  const misses = new Map<string, number>();
  for (const a of week) if (!a.correct) misses.set(a.topic, (misses.get(a.topic) ?? 0) + 1);
  const missesByTopic = [...misses.entries()].sort((a, b) => b[1] - a[1]);
  return { answered: week.length, correct: week.filter(a => a.correct).length, topMissTopic: missesByTopic[0]?.[0] ?? null, missesByTopic };
}

export function referralCode(): string {
  const p = loadProgress();
  if (p.referral) return p.referral;
  const code = Math.random().toString(36).slice(2, 8);
  saveProgress({ ...p, referral: code });
  return code;
}

/** Fills the profile with a believable week so the team can review the layout. Clearly labeled as sample data in the UI. */
export function loadSampleData(bank: Question[]): void {
  const now = Date.now();
  const tags: (MistakeTag | undefined)[] = ['concept', 'careless', undefined, 'time', 'concept'];
  let miss = 0;
  const answers: AnswerRecord[] = Array.from({ length: 12 }, (_, i) => {
    const q = bank[(i * 5) % bank.length];
    const correct = q.section === 'Math' ? i % 3 === 0 : i % 4 !== 0;
    return {
      questionId: q.id, section: q.section, topic: q.topic, correct, source: 'practice' as const,
      at: now - (12 - i) * 9 * 60 * 60 * 1000, tag: correct ? undefined : tags[miss++ % tags.length],
    };
  });
  saveProgress({ ...loadProgress(), answers });
}

export function clearProgress(): void {
  saveProgress({ ...EMPTY, referral: loadProgress().referral });
}

/** On first sign-in, carry over what was practiced as a guest so nothing is lost. */
export function adoptGuestProgress(email: string): void {
  try {
    const guest = localStorage.getItem(BASE_KEY);
    if (guest && !localStorage.getItem(keyFor(email))) {
      localStorage.setItem(keyFor(email), guest);
      localStorage.removeItem(BASE_KEY);
    }
  } catch { /* ignore */ }
}
