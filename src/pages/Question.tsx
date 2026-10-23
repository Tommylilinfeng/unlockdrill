import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { Buddy, Lockup } from '../components/Logo';
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
    <p className="q-rule">
      How often: {label}. Open <span className="num">{opens}</span> on this phone. <Link to="/settings">Change</Link>
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
      <div className="q-shell night">
        <div className="q-top">
          <span className="app-chip">{appLabel} is opening</span>
        </div>
        <main className="q-main q-rest">
          <Buddy size={88} tone="white" mood={paused ? 'rest' : 'smile'} />
          <h1>{paused ? 'UnlockDrill is paused.' : 'No question this time.'}</h1>
          <p className="q-rest-text">
            {paused ? `Questions start again ${until ? `after ${until}` : 'when the pause ends'}.` : 'Your how-often setting skipped this one.'}
            {!demo && ` Taking you back to ${appLabel}…`}
          </p>
          <div className="q-rest-actions">
            <button type="button" className="btn btn-light btn-block" onClick={back}>Back to {appLabel}</button>
            <Link className="btn btn-ghost btn-block" to="/settings">Change how often</Link>
          </div>
          <SettingsLine frequency={settings.frequency} opens={settings.opens} />
        </main>
      </div>
    );
  }

  return (
    <div className="q-shell night">
      <div className="q-top">
        <span className="app-chip">{appLabel} is one tap away</span>
        <button type="button" className="skip-btn" onClick={skip}>Skip</button>
      </div>
      <main className="q-main">
        {demo && <p className="q-demo">Preview. On your phone this opens when you open {appLabel}.</p>}
        <div className="q-card">
          <QuestionCard
            question={question}
            headingLevel="h1"
            onAnswered={(correct, ms) => { setDone(true); setMissed(!correct); recordAnswer(question, correct); logPractice('answered', { app, questionId: question.id, correct, msToAnswer: ms }); }}
            after={
              <>
                {PREVIEW && missed && <MistakeTagger questionId={question.id} />}
                <div className="q-after">
                  <button type="button" className="btn btn-block btn-big" onClick={back}>Back to {appLabel}</button>
                  <Link className="btn btn-quiet btn-block" to={`/q?app=${app ?? ''}&demo=1`} reloadDocument>Do another one</Link>
                </div>
              </>
            }
          />
        </div>
        <div className="q-foot">
          {!done && (
            <div className="q-pause" role="group" aria-label="Pause questions">
              <button type="button" className="pause-btn" onClick={() => pause(60)}>Pause for an hour</button>
              <button type="button" className="pause-btn" onClick={() => pause(24 * 60)}>Pause until tomorrow</button>
            </div>
          )}
          {!demo && <SettingsLine frequency={settings.frequency} opens={settings.opens} />}
          <Lockup tone="white" />
        </div>
      </main>
    </div>
  );
}
