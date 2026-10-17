import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitSignup, isValidEmail } from '../lib/signup';
import { track } from '../lib/analytics';

interface Props { variant: string; label?: string }

export function SignupForm({ variant, label = 'Your email' }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation();
  const id = `email-${variant}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) { setError('Enter an email address like name@example.com.'); return; }
    setBusy(true);
    track('signup_submit', { variant });
    const res = await submitSignup({ email, page: loc.pathname, variant });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    nav(`/thanks?from=${encodeURIComponent(variant)}`);
  }

  return (
    <form onSubmit={onSubmit} className="signup" noValidate>
      <label htmlFor={id}>{label}</label>
      <div className="row">
        <input id={id} type="email" inputMode="email" autoComplete="email" required
          value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
          aria-invalid={error ? true : undefined} aria-describedby={`${id}-note`} />
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Joining…' : 'Join the waitlist'}</button>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <p id={`${id}-note`} className="note small quiet">We'll email you once, when it's ready. 18 and over only.</p>
    </form>
  );
}
