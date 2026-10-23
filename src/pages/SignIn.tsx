import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Buddy } from '../components/Logo';
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
        <div className="wrap auth">
          <Buddy size={64} />
          <h1>Check your email.</h1>
          <p className="lead">We sent a link to {email.trim()}. Open it to confirm your account, then sign in here.</p>
          <button type="button" className="btn btn-block" onClick={() => switchTo('signin')}>Back to sign in</button>
        </div>
      </Shell>
    );
  }

  const creating = mode === 'create';
  return (
    <Shell>
      <div className="wrap auth">
        <Buddy size={64} />
        <h1>{creating ? 'Create an account' : 'Welcome back.'}</h1>
        <p className="lead">
          {creating ? 'Your profile keeps your questions, mistake log and diagnostic in one place.' : 'Sign in to see your questions, mistake log and diagnostic.'}
        </p>

        <form onSubmit={submit} noValidate>
          <div className="group fields">
            {creating && (
              <div className="frow">
                <label htmlFor="si-name">Name</label>
                <input id="si-name" type="text" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="frow">
              <label htmlFor="si-email">Email</label>
              <input id="si-email" type="text" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="none" placeholder="name@example.com" value={email}
                aria-invalid={error ? true : undefined} aria-describedby={error ? 'si-error' : undefined}
                onChange={e => { setEmail(e.target.value); setError(null); }} />
            </div>
            <div className="frow">
              <label htmlFor="si-password">Password</label>
              <input id="si-password" type="password" autoComplete={creating ? 'new-password' : 'current-password'} value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                aria-describedby={[creating ? 'si-password-help' : '', error ? 'si-error' : ''].filter(Boolean).join(' ') || undefined} />
            </div>
          </div>
          {creating && <p id="si-password-help" className="gfoot">At least {MIN_PASSWORD} characters.</p>}
          <p id="si-error" className="err" role="alert">{error}</p>
          <button type="submit" className="btn btn-block btn-big" disabled={busy}>{busy ? 'One moment…' : creating ? 'Create account' : 'Sign in'}</button>
          <Link className="btn btn-quiet btn-block" to="/">Not now</Link>
        </form>
        <p className="auth-switch">
          {creating ? 'Already have an account?' : 'New here?'}{' '}
          <button type="button" className="link-btn" onClick={() => switchTo(creating ? 'signin' : 'create')}>
            {creating ? 'Sign in instead' : 'Create an account'}
          </button>
        </p>
        <p className="auth-note">Anything you practiced before signing in moves into your profile. For adults 18 and over.</p>
      </div>
    </Shell>
  );
}
