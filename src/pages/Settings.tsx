import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { APP_LIST, type AppKey } from '../lib/apps';
import { DEFAULTS, FREQUENCIES, isPaused, loadSettings, pauseFor, saveSettings, type Frequency } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function Settings() {
  useTitle('Your settings: UnlockDrill');
  const [s, setS] = useState(loadSettings);
  function update(patch: Partial<typeof s>) { const n = { ...s, ...patch }; setS(n); saveSettings(n); }
  const paused = isPaused(s);
  return (
    <Shell>
      <div className="wrap" style={{ paddingTop: 48, maxWidth: 720 }}>
        <h1>Your settings</h1>
        <p className="quiet" style={{ marginTop: 10 }}>Saved on this phone only.</p>
        <div style={{ marginTop: 32 }}>
          <div className="field">
            <label htmlFor="app">App</label>
            <select id="app" value={s.app ?? ''} onChange={e => update({ app: (e.target.value || null) as AppKey | null })}>
              <option value="">Not chosen</option>
              {APP_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="freq">How often</label>
            <select id="freq" value={s.frequency} onChange={e => update({ frequency: e.target.value as Frequency })}>
              {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </div>
          <div className="field">
            <span className="label">Pause</span>
            {paused
              ? <p>Paused until {new Date(s.pausedUntil!).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}. <button className="link-btn" onClick={() => update({ pausedUntil: null })}>Resume now</button></p>
              : <div className="actions">
                  <button className="link-btn" onClick={() => update(pauseFor(s, 60))}>Pause for an hour</button>
                  <button className="link-btn" onClick={() => update(pauseFor(s, 24 * 60))}>Pause until tomorrow</button>
                </div>}
          </div>
        </div>
        <p className="small quiet" style={{ marginTop: 36 }}>
          You’ve seen {s.seen.length} {s.seen.length === 1 ? 'question' : 'questions'}.{' '}
          <button className="link-btn small" onClick={() => update({ ...DEFAULTS, installedAt: Date.now() })}>Reset</button>
        </p>
        <p style={{ marginTop: 20 }}>Changing the app here doesn’t change your Shortcuts automation. <Link to="/setup">Here’s how to point it at another app.</Link></p>
      </div>
    </Shell>
  );
}
