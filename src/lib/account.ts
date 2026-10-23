import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

/**
 * Email and password accounts through Supabase Auth (on when Supabase is configured, see ACCOUNTS in progress.ts).
 * The signed-in account is also cached in localStorage so the header can read it synchronously.
 */
export interface Account { id: string; name: string; email: string }

const URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const CACHE = 'unlockdrill.account.v1';

let client: SupabaseClient | null = null;

/** Created on first use so production builds, which never call it, don't pull in the Supabase client. */
export function supabase(): SupabaseClient | null {
  if (client || !URL || !ANON) return client;
  client = createClient(URL, ANON);
  client.auth.onAuthStateChange((_event, session) => { if (session) remember(session.user); else forget(); });
  return client;
}

function remember(u: User): Account {
  const a = { id: u.id, email: u.email ?? '', name: (u.user_metadata?.name as string | undefined) ?? '' };
  try { localStorage.setItem(CACHE, JSON.stringify(a)); } catch { /* ignore */ }
  return a;
}

function forget(): void {
  try { localStorage.removeItem(CACHE); } catch { /* ignore */ }
}

export function currentAccount(): Account | null {
  try {
    const raw = localStorage.getItem(CACHE);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch { return null; }
}

export type AuthResult = { ok: true; account: Account | null } | { ok: false; error: string };

/** With "Confirm email" on in Supabase, account is null until the person clicks the link in their inbox. */
export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  const sb = supabase();
  if (!sb) return { ok: false, error: 'Sign-in isn’t configured on this build.' };
  const { data, error } = await sb.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { name: name.trim() } } });
  if (error) return { ok: false, error: error.message };
  return { ok: true, account: data.session && data.user ? remember(data.user) : null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const sb = supabase();
  if (!sb) return { ok: false, error: 'Sign-in isn’t configured on this build.' };
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) return { ok: false, error: error.message === 'Invalid login credentials' ? 'That email and password don’t match.' : error.message };
  return { ok: true, account: remember(data.user) };
}

export async function signOut(): Promise<void> {
  forget();
  await supabase()?.auth.signOut();
}

export function initials(a: Account | null): string {
  if (!a) return 'You';
  const parts = (a.name || a.email).split(/[\s@.]+/).filter(Boolean);
  return parts.slice(0, 2).map(p => p[0]!.toUpperCase()).join('') || 'You';
}
