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
      <div className="wrap narrow page-head">
        <h1>Your settings</h1>
        <p className="lead">Saved on this phone only.</p>
      </div>
      <div className="wrap narrow groups">
        <section className="gsection" aria-labelledby="ask-title">
          <h2 id="ask-title" className="gtitle">Questions</h2>
          <div className="group fields">
            <div className="frow">
              <label htmlFor="app">App</label>
              <select id="app" value={s.app ?? ''} onChange={e => update({ app: (e.target.value || null) as AppKey | null })}>
                <option value="">Not chosen</option>
                {APP_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </select>
            </div>
            <div className="frow">
              <label htmlFor="freq">How often</label>
              <select id="freq" value={s.frequency} onChange={e => update({ frequency: e.target.value as Frequency })}>
                {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
              <p className="frow-help">{FREQUENCIES.find(f => f.key === s.frequency)?.help}</p>
            </div>
          </div>
          <p className="gfoot">Changing the app here doesn’t change your Shortcuts automation. <Link to="/setup">Here’s how to point it at another app.</Link></p>
        </section>

        <section className="gsection" aria-labelledby="pause-title">
          <h2 id="pause-title" className="gtitle">Pause</h2>
          <div className="group">
            {paused ? (
              <div className="grow">
                <div><p className="grow-title">Paused</p><p className="grow-sub">Until {new Date(s.pausedUntil!).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</p></div>
                <button className="btn btn-quiet" onClick={() => update({ pausedUntil: null })}>Resume now</button>
              </div>
            ) : (
              <>
                <button className="grow grow-link" onClick={() => update(pauseFor(s, 60))}><span className="grow-title">Pause for an hour</span></button>
                <button className="grow grow-link" onClick={() => update(pauseFor(s, 24 * 60))}><span className="grow-title">Pause until tomorrow</span></button>
              </>
            )}
          </div>
        </section>

        <section className="gsection" aria-labelledby="hist-title">
          <h2 id="hist-title" className="gtitle">History</h2>
          <div className="group">
            <div className="grow">
              <p className="grow-title">Questions seen</p>
              <span className="num grow-value">{s.seen.length}</span>
            </div>
            <button className="grow grow-link danger" onClick={() => update({ ...DEFAULTS, installedAt: Date.now() })}><span className="grow-title">Reset settings and history</span></button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
