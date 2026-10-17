import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitSignup, isValidEmail } from '../lib/signup';
import { track } from '../lib/analytics';

interface Props {
  /** Slug of the value prop this form sits under; reported with the signup so pages can be compared. */
  variant: string;
  cta?: string;
  idSuffix?: string;
}

export function SignupForm({ variant, cta = 'Get early access', idSuffix = '' }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation();
  const id = `email-${variant}${idSuffix}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    setBusy(true);
    track('signup_submit', { variant });
    const res = await submitSignup({ email, page: loc.pathname, variant });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    nav(`/thanks?from=${encodeURIComponent(variant)}`);
  }

  return (
    <form onSubmit={onSubmit} className="card stack" noValidate aria-describedby={`${id}-help`}>
      <div className="field">
        <label htmlFor={id}>Email</label>
        <input id={id} type="email" inputMode="email" autoComplete="email" required
          value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          aria-invalid={error ? true : undefined} />
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="btn-row">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : cta}</button>
      </div>
      <p id={`${id}-help`} className="small muted" style={{ margin: 0 }}>
        One email when the first version is ready. No newsletter, no sharing. Adults 18 and over only.
      </p>
    </form>
  );
}
