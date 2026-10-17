import { getUtm } from './analytics';
import { EXAM } from '../config/exam';

export interface SignupInput { email: string; page: string; variant: string }
export type SignupResult = { ok: true; mode: 'supabase' | 'local' } | { ok: false; error: string };

const URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/**
 * Store a signup. With Supabase configured it inserts into `signups` (see supabase/schema.sql).
 * Without it, the row is kept in localStorage so the flow still completes during development.
 */
export async function submitSignup(input: SignupInput): Promise<SignupResult> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: 'That email does not look right.' };
  const utm = getUtm();
  const row = {
    email,
    page: input.page,
    variant: input.variant,
    exam: EXAM.key,
    utm_source: utm.utm_source ?? null,
    utm_medium: utm.utm_medium ?? null,
    utm_campaign: utm.utm_campaign ?? null,
    utm_content: utm.utm_content ?? null,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent.slice(0, 200),
  };

  if (URL && KEY) {
    try {
      const res = await fetch(`${URL}/rest/v1/signups`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: KEY, authorization: `Bearer ${KEY}`, prefer: 'return=minimal' },
        body: JSON.stringify(row),
      });
      if (res.status === 409) return { ok: true, mode: 'supabase' }; // already signed up: treat as success
      if (!res.ok) return { ok: false, error: `Signup failed (${res.status}). Please try again.` };
      return { ok: true, mode: 'supabase' };
    } catch {
      return { ok: false, error: 'Network error. Please try again.' };
    }
  }

  try {
    const k = 'unlockdrill.signups.local';
    const list = JSON.parse(localStorage.getItem(k) ?? '[]') as unknown[];
    list.push({ ...row, at: new Date().toISOString() });
    localStorage.setItem(k, JSON.stringify(list));
  } catch { /* ignore */ }
  if (import.meta.env.DEV) console.warn('[signup] Supabase not configured; stored locally', row);
  return { ok: true, mode: 'local' };
}
