import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { ShortcutCard } from '../components/ShortcutCard';
import { APP_LIST, type AppKey } from '../lib/apps';
import { FREQUENCIES, loadSettings, saveSettings, type Frequency } from '../lib/settings';
import { SITE_URL } from '../config/exam';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

/**
 * iOS Shortcuts automation guide. "When <app> is opened → Open URL" runs without a confirmation tap on iOS 17+,
 * which is what lets a web page sit in front of another app with no special entitlement.
 */
/** Marker file in the Shortcuts iCloud folder. Present = the user is coming back from UnlockDrill. */
const MARKER = 'unlockdrill-back.txt';

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
      <div className="wrap page-head">
        <h1>Put one question in front of {appName}.</h1>
        <p className="lead">You’ll use the Shortcuts app that’s already on your iPhone. It takes about five minutes and needs iOS 17 or later.</p>
      </div>

      <div className="wrap setup">
        <section className="gsection setup-settings" aria-labelledby="first-title">
          <h2 id="first-title">First, your settings</h2>
          <div className="group fields">
            <div className="frow">
              <label htmlFor="app">Which app should ask first?</label>
              <select id="app" value={s.app ?? ''} onChange={e => update({ app: (e.target.value || null) as AppKey | null })}>
                <option value="">Choose an app</option>
                {APP_LIST.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
              </select>
            </div>
            <div className="frow">
              <label htmlFor="freq">How often?</label>
              <select id="freq" value={s.frequency} aria-describedby="freq-help" onChange={e => update({ frequency: e.target.value as Frequency })}>
                {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
              <p id="freq-help" className="frow-help">{FREQUENCIES.find(f => f.key === s.frequency)?.help}</p>
            </div>
            <div className="frow">
              <label htmlFor="url">Your link</label>
              <input id="url" type="text" readOnly value={url} onFocus={e => e.currentTarget.select()} />
            </div>
          </div>
          <div className="actions">
            <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
            <Link className="btn btn-quiet" to={`/q?app=${s.app ?? 'instagram'}&demo=1`}>Preview the question screen</Link>
          </div>
        </section>

        <section className="setup-steps" aria-labelledby="then-title">
          <h2 id="then-title">Then, in Shortcuts</h2>
          <ol className="steps">
            <li><p>Open <strong>Shortcuts</strong>, tap <strong>Automation</strong> at the bottom, tap <kbd>+</kbd>, and choose <strong>App</strong>.</p></li>
            <li><p>Tap <strong>Choose</strong>, pick <strong>{appName}</strong>, and leave <strong>Is Opened</strong> checked. Choose <strong>Run Immediately</strong>, leave <strong>Notify When Run</strong> off, and tap <strong>Next</strong>.</p></li>
            <li><p>Tap <strong>New Blank Automation</strong> (on newer iPhones, <strong>Create New Shortcut</strong>). Add the actions shown in the box below, in that order. Search for each one by its name. New actions land at the bottom; press and hold one to drag it into place.</p></li>
            <li><p>Add <strong>Get File from Folder</strong>. It reads “Get file from Shortcuts at path”. Type <kbd>{MARKER}</kbd> as the path, tap the arrow on the action, and turn off <strong>Error If Not Found</strong>.</p></li>
            <li><p>Add <strong>If</strong>. If it says “File Size is … MB”, tap <strong>File Size</strong> and choose <strong>Anything</strong>, so it reads “If File has any value”. Inside the If, add <strong>Delete Files</strong> (tap its arrow and turn <strong>Delete Immediately</strong> on) and then <strong>Stop This Shortcut</strong>. Leave <strong>Otherwise</strong> empty.</p></li>
            <li><p>After <strong>End If</strong>, add <strong>Text</strong> and type <kbd>1</kbd>. Then add <strong>Save File</strong>: turn off <strong>Ask Where to Save</strong>, type <kbd>{MARKER}</kbd> as the path, and turn on <strong>Overwrite If File Exists</strong>.</p></li>
            <li><p>Last, add <strong>Open URLs</strong>. If it fills in “Saved File”, tap it and choose <strong>Clear Variable</strong>. Paste your link and tap the checkmark to save.</p></li>
            <li><p>Test it: open {appName}. A question appears. Tap <strong>Back to {appName}</strong> and you should stay in {appName}.</p></li>
          </ol>

          <figure className="shortcut-figure">
            <ShortcutCard trigger={appName} label="The finished automation, action by action" actions={[
              { icon: 'file', title: 'Get File from Folder', sub: `Shortcuts / ${MARKER}, Error If Not Found off` },
              { icon: 'if', title: 'If File has any value', sub: 'You just came back from UnlockDrill' },
              { icon: 'trash', title: 'Delete Files', sub: 'File, Delete Immediately on', indent: true },
              { icon: 'stop', title: 'Stop This Shortcut', sub: `Leaves you in ${appName}`, indent: true },
              { icon: 'if', title: 'End If' },
              { icon: 'text', title: 'Text', token: '1' },
              { icon: 'file', title: 'Save File', sub: `Shortcuts / ${MARKER}, Overwrite on` },
              { icon: 'url', title: 'Open URLs', token: url },
            ]} />
            <figcaption>The finished automation, top to bottom.</figcaption>
          </figure>

          <h3>Why the extra steps</h3>
          <p>When you go back to {appName}, your iPhone counts that as opening {appName} again, so the automation runs a second time. The small file is how it tells the two apart: no file means you opened {appName} yourself, so it shows a question; a file means you just came back, so it deletes the file and lets you through.</p>
          <p className="quiet">If you leave a question by going to the home screen instead of tapping Back, the next time you open {appName} goes straight through once. To turn UnlockDrill off, delete the automation in Shortcuts, or pause it from <Link to="/settings">your settings</Link>.</p>
        </section>
      </div>

      <section className="night section faq">
        <div className="wrap split">
          <div>
            <h2>Is this an app blocker?</h2>
            <p>No. Nothing gets locked, and Skip always works. It’s Apple’s own automation feature, so UnlockDrill can’t see or control your other apps.</p>
          </div>
          <div>
            <h2>What about Android?</h2>
            <p>Not yet. It’s iPhone only for now.</p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
