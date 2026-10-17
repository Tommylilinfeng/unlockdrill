import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { APP_LIST, type AppKey } from '../lib/apps';
import { FREQUENCIES, loadSettings, saveSettings, type Frequency } from '../lib/settings';
import { SITE_URL } from '../config/exam';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

/**
 * iOS Shortcuts automation guide. "When <app> is opened → Open URL" runs without a confirmation tap on iOS 17+,
 * which is what lets a web page sit in front of another app with no special entitlement.
 */
export default function Setup() {
  useTitle('Set up UnlockDrill on iPhone');
  const [s, setS] = useState(loadSettings);
  const base = (SITE_URL || window.location.origin + import.meta.env.BASE_URL).replace(/\/$/, '');
  const url = `${base}/q?app=${s.app ?? 'instagram'}`;
  const appName = APP_LIST.find(a => a.key === s.app)?.label ?? 'Instagram';
  const [copied, setCopied] = useState(false);

  function update(patch: Partial<typeof s>) { const next = { ...s, ...patch }; setS(next); saveSettings(next); }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); track('setup_copy_url', { app: s.app ?? 'none' }); setTimeout(() => setCopied(false), 2000); } catch { /* the field is selectable anyway */ }
  }

  return (
    <Shell>
      <div className="wrap" style={{ paddingTop: 48 }}>
        <h1 style={{ maxWidth: '18ch' }}>Put one question in front of {appName}.</h1>
        <p className="lead" style={{ marginTop: 16 }}>You’ll use the Shortcuts app that’s already on your iPhone. It takes about two minutes and needs iOS 17 or later.</p>
      </div>

      <section className="block" style={{ paddingTop: 48 }}>
        <div className="wrap two">
          <div>
            <h2>First, your settings</h2>
            <div className="field" style={{ marginTop: 22 }}>
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
              <p className="small quiet">{FREQUENCIES.find(f => f.key === s.frequency)?.help}</p>
            </div>
            <div className="field">
              <label htmlFor="url">Your link</label>
              <input id="url" type="text" readOnly value={url} onFocus={e => e.currentTarget.select()} />
              <div className="actions">
                <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
                <Link to={`/q?app=${s.app ?? 'instagram'}&demo=1`}>Preview the question screen</Link>
              </div>
            </div>
          </div>

          <div>
            <h2>Then, in Shortcuts</h2>
            <ol className="steps">
              <li><p>Open <strong>Shortcuts</strong> and tap <strong>Automation</strong> at the bottom.</p></li>
              <li><p>Tap <kbd>+</kbd>, then choose <strong>App</strong>.</p></li>
              <li><p>Tap <strong>Choose</strong>, pick <strong>{appName}</strong>, and leave <strong>Is Opened</strong> checked.</p></li>
              <li><p>Choose <strong>Run Immediately</strong> and turn off <strong>Notify When Run</strong>. Tap <strong>Next</strong>.</p></li>
              <li><p>Tap <strong>New Blank Automation</strong>, search for <strong>Open URLs</strong>, and add it.</p></li>
              <li><p>Paste your link into the URL field and tap <strong>Done</strong>.</p></li>
              <li><p>Open {appName}. You should see a question. Answer it or skip it to get back in.</p></li>
            </ol>
            <p className="small quiet" style={{ marginTop: 24 }}>To turn it off, delete the automation in Shortcuts, or pause it from <Link to="/settings">your settings</Link>.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap two">
          <div>
            <h3>Is this an app blocker?</h3>
            <p style={{ marginTop: 8 }}>No. Nothing gets locked, and Skip always works. It’s Apple’s own automation feature, so UnlockDrill can’t see or control your other apps.</p>
          </div>
          <div>
            <h3>What about Android?</h3>
            <p style={{ marginTop: 8 }}>Not yet. <a href={`${import.meta.env.BASE_URL}#waitlist`}>Join the waitlist</a> and tell us which phone you use.</p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
