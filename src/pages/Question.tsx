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
 * - If paused or the frequency rule says "not now", we show a short screen with a button back to the app.
 *   We never redirect on our own: going back to the app fires the app-open automation again, and an
 *   automatic redirect is what turns that into a loop. The Shortcuts recipe on /setup guards the other side.
 * - Otherwise: one question, explanation, then back. Skip and pause are always visible.
 * - ?demo=1 ignores frequency/pause so the flow can be shown on any device.
 */
export default function Question() {
  useTitle(`One ${EXAM.itemNoun}: UnlockDrill`);
  const [params] = useSearchParams();
  const demo = params.get('demo') === '1';
  const [settings, setSettings] = useState(loadSettings);
  const app = appFromParam(params.get('app')) ?? settings.app;
  const appLabel = app ? APPS[app].label : 'your app';
  const bank = useMemo(() => loadBank(EXAM.key), []);
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
      saveSettings(opened); setSettings(opened);
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
          </p>
          <div className="q-after">
            <button type="button" className="btn" onClick={back}>Back to {appLabel}</button>
            <Link className="link-btn" style={{ display: 'grid', placeItems: 'center' }} to="/settings">Change how often</Link>
          </div>
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
          onAnswered={(correct, ms) => { setDone(true); logPractice('answered', { app, questionId: question.id, correct, msToAnswer: ms }); }}
          after={
            <div className="q-after">
              <button type="button" className="btn" onClick={back}>Back to {appLabel}</button>
              <Link className="link-btn" style={{ textAlign: 'center', display: 'grid', placeItems: 'center' }} to={`/q?app=${app ?? ''}&demo=1`} reloadDocument>Do another one</Link>
            </div>
          }
        />
        {!done && (
          <div className="q-pause" aria-label="Pause">
            <button type="button" className="link-btn" onClick={() => pause(60)}>Pause for an hour</button>
            <button type="button" className="link-btn" onClick={() => pause(24 * 60)}>Pause until tomorrow</button>
          </div>
        )}
      </div>
    </div>
  );
}
