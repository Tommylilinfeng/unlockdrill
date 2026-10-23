import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { EXAM } from '../config/exam';
import { APPS, appFromParam, returnToApp } from '../lib/apps';
import { loadBank, nextQuestion, rememberSeen } from '../lib/questions';
import { FREQUENCIES, isPaused, loadSettings, pauseFor, saveSettings, shouldPrompt } from '../lib/settings';
import { logPractice } from '../lib/events';
import { useTitle } from '../lib/useTitle';
import { PREVIEW, recordAnswer } from '../lib/progress';
import { MistakeTagger } from '../components/MistakeTagger';

/**
 * The interstitial. Opened by the iOS automation as /q?app=instagram.
 * - If paused or the frequency rule says "not now", we show "Not this time" and send the user back to the app
 *   after a moment. Going back fires the app-open automation again; the marker-file check in the Shortcuts
 *   recipe on /setup (verified on a real iPhone, issue #3) makes that second run stop, so this cannot loop.
 * - Otherwise: one question, explanation, then back. Skip and pause are always visible.
 * - ?demo=1 ignores frequency/pause so the flow can be shown on any device.
 */
/** How long "Not this time" stays on screen before we hand control back to the app. */
const AUTO_RETURN_MS = 1200;

/** Small status line: lets the user see which how-often rule this browser has, and how many opens it has counted. */
function SettingsLine({ frequency, opens }: { frequency: string; opens: number }) {
  const label = FREQUENCIES.find(f => f.key === frequency)?.label ?? frequency;
  return (
    <p className="small quiet" style={{ marginTop: 28 }}>
      How often: {label}. Open {opens} on this phone. <Link to="/settings">Change</Link>
    </p>
  );
}

export default function Question() {
  useTitle(`One ${EXAM.itemNoun}: UnlockDrill`);
  const [params] = useSearchParams();
  const demo = params.get('demo') === '1';
  const [settings, setSettings] = useState(loadSettings);
  const app = appFromParam(params.get('app')) ?? settings.app;
  const appLabel = app ? APPS[app].label : 'your app';
  const bank = useMemo(() => loadBank(EXAM.key), []);
  const [done, setDone] = useState(false);
  const [missed, setMissed] = useState(false);

  // Decide once on mount whether this open gets a question.
  const [question] = useState(() => {
    const s = loadSettings();
    if (!demo && !shouldPrompt(s)) return null;
    return nextQuestion(bank, s.seen, params.get('q'));
  });

  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return; // StrictMode double-invokes effects in dev; count the open once
    ran.current = true;
    const s = loadSettings();
    const opened = { ...s, opens: s.opens + 1, app: app ?? s.app };
    if (!question) {
      saveSettings(opened); setSettings(opened);
      if (!demo) logPractice('returned', { app });
      return;
    }
    const shown = { ...opened, lastPromptAt: demo ? s.lastPromptAt : Date.now(), seen: rememberSeen(s.seen, question.id) };
    saveSettings(shown); setSettings(shown);
    logPractice('shown', { app, questionId: question.id });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Not this time: hand control back to the app after a moment (kept separate from the once-only effect above).
  useEffect(() => {
    if (question || demo) return;
    const t = window.setTimeout(() => returnToApp(app), AUTO_RETURN_MS);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function back() { logPractice('returned', { app, questionId: question?.id }); returnToApp(app); }
  function skip() { logPractice('skipped', { app, questionId: question?.id }); returnToApp(app); }
  function pause(minutes: number) {
    const next = pauseFor(loadSettings(), minutes);
    saveSettings(next); setSettings(next);
    logPractice('paused', { app, questionId: question?.id });
    returnToApp(app);
  }

  if (!question) {
    const paused = isPaused(settings);
    const until = paused && settings.pausedUntil
      ? new Date(settings.pausedUntil).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
      : null;
    return (
      <div className="q-shell">
        <div className="q-bar">
          <Link to="/" className="lockup" style={{ fontSize: 16 }}><img src={`${import.meta.env.BASE_URL}logo/mark-small.svg`} alt="" width={22} height={22} />UnlockDrill</Link>
        </div>
        <div className="q-main">
          <h1>{paused ? 'UnlockDrill is paused.' : 'No question this time.'}</h1>
          <p className="quiet" style={{ marginTop: 10 }}>
            {paused ? `Questions start again ${until ? `after ${until}` : 'when the pause ends'}.` : 'Your how-often setting skipped this one.'}
            {!demo && ` Taking you back to ${appLabel}…`}
          </p>
          <div className="q-after">
            <button type="button" className="btn" onClick={back}>Back to {appLabel}</button>
            <Link className="link-btn" style={{ display: 'grid', placeItems: 'center' }} to="/settings">Change how often</Link>
          </div>
          <SettingsLine frequency={settings.frequency} opens={settings.opens} />
        </div>
      </div>
    );
  }

  return (
    <div className="q-shell">
      <div className="q-bar">
        <Link to="/" className="lockup" style={{ fontSize: 16 }}><img src={`${import.meta.env.BASE_URL}logo/mark-small.svg`} alt="" width={22} height={22} />UnlockDrill</Link>
        <button type="button" className="link-btn" onClick={skip}>Skip</button>
      </div>
      <div className="q-main">
        {demo && <p className="small quiet" style={{ marginBottom: 18 }}>Preview. On your phone this opens when you open {appLabel}.</p>}
        <QuestionCard
          question={question}
          onAnswered={(correct, ms) => { setDone(true); setMissed(!correct); recordAnswer(question, correct); logPractice('answered', { app, questionId: question.id, correct, msToAnswer: ms }); }}
          after={
            <>
            {PREVIEW && missed && <MistakeTagger questionId={question.id} />}
            <div className="q-after">
              <button type="button" className="btn" onClick={back}>Back to {appLabel}</button>
              <Link className="link-btn" style={{ textAlign: 'center', display: 'grid', placeItems: 'center' }} to={`/q?app=${app ?? ''}&demo=1`} reloadDocument>Do another one</Link>
            </div>
            </>
          }
        />
        {!done && (
          <div className="q-pause" aria-label="Pause">
            <button type="button" className="link-btn" onClick={() => pause(60)}>Pause for an hour</button>
            <button type="button" className="link-btn" onClick={() => pause(24 * 60)}>Pause until tomorrow</button>
          </div>
        )}
        {!demo && <SettingsLine frequency={settings.frequency} opens={settings.opens} />}
      </div>
    </div>
  );
}
