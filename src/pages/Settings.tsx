import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { APP_LIST, type AppKey } from '../lib/apps';
import { DEFAULTS, FREQUENCIES, isPaused, loadSettings, pauseFor, saveSettings, type Frequency } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function Settings() {
  useTitle('Your settings · UnlockDrill');
  const [s, setS] = useState(loadSettings);
  function update(patch: Partial<typeof s>) { const n = { ...s, ...patch }; setS(n); saveSettings(n); }
  const paused = isPaused(s);
  return (
    <Shell>
      <section className="hero"><div className="container" style={{ maxWidth: 720 }}>
        <h1>Your settings</h1>
        <p className="lead">Everything here lives only on this device.</p>
        <div className="card stack">
          <div className="field">
            <label htmlFor="app">App</label>
            <select id="app" value={s.app ?? ''} onChange={e => update({ app: (e.target.value || null) as AppKey | null })}>
              <option value="">Not chosen</option>
              {APP_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="freq">Frequency</label>
            <select id="freq" value={s.frequency} onChange={e => update({ frequency: e.target.value as Frequency })}>
              {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </div>
          <div className="field">
            <p style={{ fontWeight: 700, marginBottom: 6 }}>Pause</p>
            {paused
              ? <p className="ok">Paused until {new Date(s.pausedUntil!).toLocaleString()}. <button className="btn quiet" onClick={() => update({ pausedUntil: null })}>Resume now</button></p>
              : <div className="btn-row">
                  <button className="btn secondary" onClick={() => update(pauseFor(s, 60))}>Pause for an hour</button>
                  <button className="btn secondary" onClick={() => update(pauseFor(s, 24 * 60))}>Pause for today</button>
                </div>}
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            Questions shown so far: {s.seen.length}. Opens counted: {s.opens}.
            {' '}<button className="btn quiet" onClick={() => update({ ...DEFAULTS, installedAt: Date.now() })}>Reset everything</button>
          </p>
        </div>
        <p style={{ marginTop: 24 }}>Changing the app here does not change your Shortcuts automation. <Link to="/setup">See the setup steps</Link> to point it at a different app.</p>
      </div></section>
    </Shell>
  );
}
