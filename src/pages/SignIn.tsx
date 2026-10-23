import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { signIn, signUp } from '../lib/account';
import { adoptGuestProgress, syncProgress } from '../lib/progress';
import { isValidEmail } from '../lib/signup';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

type Mode = 'signin' | 'create';
const MIN_PASSWORD = 8;

export default function SignIn() {
  const [mode, setMode] = useState<Mode>('signin');
  useTitle(`${mode === 'signin' ? 'Sign in' : 'Create an account'}: UnlockDrill`);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);

  function switchTo(m: Mode) { setMode(m); setError(null); setCheckInbox(false); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { setError('That email does not look right.'); return; }
    if (password.length < MIN_PASSWORD) { setError(`Use at least ${MIN_PASSWORD} characters for your password.`); return; }
    setBusy(true); setError(null);
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(name, email, password);
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    track(mode === 'signin' ? 'login' : 'sign_up', {});
    if (!res.account) { setCheckInbox(true); return; }
    adoptGuestProgress(res.account.email);
    await syncProgress();
    nav('/profile');
  }

  if (checkInbox) {
    return (
      <Shell>
        <div className="wrap diag">
          <h1>Check your email.</h1>
          <p className="lead" style={{ marginTop: 16 }}>We sent a link to {email.trim()}. Open it to confirm your account, then sign in here.</p>
          <div className="actions" style={{ marginTop: 26 }}>
            <button type="button" className="btn" onClick={() => switchTo('signin')}>Back to sign in</button>
          </div>
        </div>
      </Shell>
    );
  }

  const creating = mode === 'create';
  return (
    <Shell>
      <div className="wrap diag">
        <h1>{creating ? 'Create an account' : 'Sign in'}</h1>
        <p className="quiet" style={{ marginTop: 10 }}>
          {creating ? 'Your profile keeps your questions, mistake log and diagnostic in one place.' : 'Welcome back.'}
        </p>
        <form className="signin" onSubmit={submit} noValidate>
          {creating && (
            <div className="field">
              <label htmlFor="si-name">Name</label>
              <input id="si-name" type="text" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label htmlFor="si-email">Email</label>
            <input id="si-email" type="text" inputMode="email" autoComplete="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }} />
          </div>
          <div className="field">
            <label htmlFor="si-password">Password</label>
            <input id="si-password" type="password" autoComplete={creating ? 'new-password' : 'current-password'} value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              aria-describedby={creating ? 'si-password-help' : undefined} />
            {creating && <p id="si-password-help" className="small quiet">At least {MIN_PASSWORD} characters.</p>}
          </div>
          {error && <p className="err" role="alert">{error}</p>}
          <div className="actions" style={{ marginTop: 26 }}>
            <button type="submit" className="btn" disabled={busy}>{busy ? 'One moment…' : creating ? 'Create account' : 'Sign in'}</button>
            <Link to="/">Not now</Link>
          </div>
        </form>
        <p style={{ marginTop: 28 }}>
          {creating ? 'Already have an account? ' : 'New here? '}
          <button type="button" className="link-btn" onClick={() => switchTo(creating ? 'signin' : 'create')}>
            {creating ? 'Sign in' : 'Create an account'}
          </button>
        </p>
        <p className="small quiet" style={{ marginTop: 8 }}>Anything you practiced before signing in moves into your profile. For adults 18 and over.</p>
      </div>
    </Shell>
  );
}
