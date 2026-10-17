import { track } from './analytics';
import type { AppKey } from './apps';

type PracticeEvent = 'shown' | 'answered' | 'skipped' | 'paused' | 'returned';

const URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

function deviceId(): string {
  try {
    const k = 'unlockdrill.device';
    let id = localStorage.getItem(k);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(k, id); }
    return id;
  } catch { return 'anon'; }
}

/** Fire-and-forget practice event: GA always (if configured), Supabase when configured. */
export function logPractice(event: PracticeEvent, data: { app: AppKey | null; questionId?: string; correct?: boolean; msToAnswer?: number }): void {
  track(`practice_${event}`, { app: data.app ?? 'none', question_id: data.questionId, correct: data.correct, ms_to_answer: data.msToAnswer });
  if (!URL || !KEY) return;
  const body = JSON.stringify({
    device_id: deviceId(), app: data.app, question_id: data.questionId ?? null, event,
    correct: data.correct ?? null, ms_to_answer: data.msToAnswer ?? null,
  });
  fetch(`${URL}/rest/v1/practice_events`, {
    method: 'POST', keepalive: true,
    headers: { 'content-type': 'application/json', apikey: KEY, authorization: `Bearer ${KEY}`, prefer: 'return=minimal' },
    body,
  }).catch(() => { /* best effort */ });
}
