import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { EXAM } from '../config/exam';
import { APPS, appFromParam, returnToApp } from '../lib/apps';
import { loadBank, nextQuestion, rememberSeen } from '../lib/questions';
import { isPaused, loadSettings, pauseFor, saveSettings, shouldPrompt } from '../lib/settings';
import { logPractice } from '../lib/events';
import { useTitle } from '../lib/useTitle';

/**
 * The interstitial. Opened by the iOS automation as /q?app=instagram.
 * - If paused or the frequency rule says "not now", we hand control straight back to the app.
 * - Otherwise: one question, explanation, then back. Skip and pause are always visible.
 * - ?demo=1 ignores frequency/pause so the flow can be shown on any device.
 */
export default function Question() {
  useTitle(`One ${EXAM.itemNoun} · UnlockDrill`);
  const [params] = useSearchParams();
  const demo = params.get('demo') === '1';
  const [settings, setSettings] = useState(loadSettings);
  const app = appFromParam(params.get('app')) ?? settings.app;
  const appLabel = app ? APPS[app].label : 'your app';
  const bank = useMemo(() => loadBank(EXAM.key), []);
  const [redirecting, setRedirecting] = useState(false);
  const [done, setDone] = useState(false);

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
      saveSettings(opened);
      if (!demo) { setRedirecting(true); logPractice('returned', { app }); returnToApp(app); }
      return;
    }
    const shown = { ...opened, lastPromptAt: demo ? s.lastPromptAt : Date.now(), seen: rememberSeen(s.seen, question.id) };
    saveSettings(shown); setSettings(shown);
    logPractice('shown', { app, questionId: question.id });
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

  if (redirecting) {
    return <div className="q-shell"><div className="q-body"><p className="muted">Not this time. Sending you to {appLabel}…</p><button className="btn secondary" onClick={back}>Open {appLabel}</button></div></div>;
  }

  if (!question) {
    return (
      <div className="q-shell"><div className="q-body stack">
        <h1>{isPaused(settings) ? 'UnlockDrill is paused.' : 'No question this time.'}</h1>
        <p className="muted">{isPaused(settings) ? 'Prompts resume when the pause ends.' : 'Your frequency setting skipped this open.'}</p>
        <div className="btn-row"><button className="btn" onClick={back}>Open {appLabel}</button><Link className="btn quiet" to="/settings">Settings</Link></div>
      </div></div>
    );
  }

  return (
    <div className="q-shell">
      <div className="q-top">
        <Link to="/" className="lockup" style={{ fontSize: 16 }}><img src={`${import.meta.env.BASE_URL}logo/mark-green.svg`} alt="" width={22} height={22} />UnlockDrill</Link>
        <button type="button" className="btn quiet" onClick={skip}>Skip →</button>
      </div>
      <div className="q-body">
        {demo && <p className="small muted">Demo mode: frequency and pause are ignored.</p>}
        <QuestionCard
          question={question}
          onAnswered={(correct, ms) => { setDone(true); logPractice('answered', { app, questionId: question.id, correct, msToAnswer: ms }); }}
          after={
            <div className="q-actions">
              <button type="button" className="btn" onClick={back}>Back to {appLabel}</button>
              <Link className="btn secondary" to={`/q?app=${app ?? ''}&demo=1`} reloadDocument>One more</Link>
            </div>
          }
        />
        {!done && (
          <div className="q-actions" aria-label="Pause options">
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn quiet" onClick={() => pause(60)}>Pause for an hour</button>
              <button type="button" className="btn quiet" onClick={() => pause(24 * 60)}>Pause for today</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
