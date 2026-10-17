import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { APP_LIST, type AppKey } from '../lib/apps';
import { FREQUENCIES, loadSettings, saveSettings, type Frequency } from '../lib/settings';
import { SITE_URL } from '../config/exam';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

/**
 * iOS Shortcuts automation guide. "When <app> is opened → Open URL" runs without confirmation on iOS 17+,
 * which is what lets a web app sit in front of another app with no special entitlement.
 */
export default function Setup() {
  useTitle('Set up UnlockDrill on iPhone');
  const [s, setS] = useState(loadSettings);
  const base = (SITE_URL || window.location.origin + import.meta.env.BASE_URL).replace(/\/$/, '');
  const url = `${base}/q?app=${s.app ?? 'instagram'}`;
  const [copied, setCopied] = useState(false);

  function update(patch: Partial<typeof s>) {
    const next = { ...s, ...patch };
    setS(next); saveSettings(next);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); track('setup_copy_url', { app: s.app ?? 'none' }); setTimeout(() => setCopied(false), 2000); } catch { /* show url anyway */ }
  }

  return (
    <Shell>
      <section className="hero"><div className="container">
        <p className="eyebrow">Setup · about two minutes</p>
        <h1>Put one question in front of an app.</h1>
        <p className="lead">UnlockDrill uses the Shortcuts app that is already on your iPhone (iOS 17 or later). You create one automation: when your chosen app opens, open UnlockDrill. No download, no special permissions.</p>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card stack">
          <h2>1. Choose your app and frequency</h2>
          <div className="field">
            <label htmlFor="app">Which app should ask first?</label>
            <select id="app" value={s.app ?? ''} onChange={e => update({ app: (e.target.value || null) as AppKey | null })}>
              <option value="">Choose an app</option>
              {APP_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="freq">How often?</label>
            <select id="freq" value={s.frequency} onChange={e => update({ frequency: e.target.value as Frequency })}>
              {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <p className="small muted" style={{ marginTop: 6 }}>{FREQUENCIES.find(f => f.key === s.frequency)?.help}</p>
          </div>
          <div className="field">
            <label htmlFor="url">Your UnlockDrill link</label>
            <input id="url" type="text" readOnly value={url} onFocus={e => e.currentTarget.select()} />
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button type="button" className="btn secondary" onClick={copy}>{copied ? 'Copied ✓' : 'Copy link'}</button>
              <Link className="btn quiet" to={`/q?app=${s.app ?? 'instagram'}&demo=1`}>Preview a question</Link>
            </div>
          </div>
        </div>

        <div className="card stack">
          <h2>2. Create the automation in Shortcuts</h2>
          <ol className="steps">
            <li>Open the <strong>Shortcuts</strong> app and tap <strong>Automation</strong> at the bottom.</li>
            <li>Tap <kbd>+</kbd> (or <strong>New Automation</strong>), then choose <strong>App</strong>.</li>
            <li>Tap <strong>Choose</strong> and select <strong>{APP_LIST.find(a => a.key === s.app)?.label ?? 'your app'}</strong>. Keep <strong>Is Opened</strong> checked.</li>
            <li>Select <strong>Run Immediately</strong> and turn off <strong>Notify When Run</strong>. Tap <strong>Next</strong>.</li>
            <li>Tap <strong>New Blank Automation</strong>, search for the action <strong>Open URLs</strong>, and add it.</li>
            <li>Paste your UnlockDrill link into the URL field. Tap <strong>Done</strong>.</li>
            <li>Open {APP_LIST.find(a => a.key === s.app)?.label ?? 'the app'}. A question appears first. Answer or skip, and you are back in the app.</li>
          </ol>
          <p className="small muted" style={{ margin: 0 }}>To stop: open Shortcuts → Automation, swipe left on the automation, delete. Or pause from <Link to="/settings">your settings</Link> without touching Shortcuts.</p>
        </div>
      </div></section>

      <section className="section"><div className="container">
        <div className="card" style={{ maxWidth: 760 }}>
          <h3>What this is and is not</h3>
          <p>This is a real integration using Apple's own automation feature. It is not an app blocker: nothing is locked, and skipping always works. Android support is not built yet. Tell us if you want it.</p>
          <p style={{ margin: 0 }} className="small muted">Your app choice, frequency, and pause state are stored only on this phone.</p>
        </div>
      </div></section>
    </Shell>
  );
}
