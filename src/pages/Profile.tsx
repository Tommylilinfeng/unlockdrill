import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { ReferralCard } from '../components/ReferralCard';
import { EXAM } from '../config/exam';
import { loadBank } from '../lib/questions';
import {
  MISTAKE_TAGS, clearProgress, loadProgress, loadSampleData, syncProgress, tagMistake, weekSummary, type MistakeTag,
} from '../lib/progress';
import { useTitle } from '../lib/useTitle';
import { currentAccount, initials, signOut } from '../lib/account';

const day = (t: number) => new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

/** Mock profile: no sign-in yet, so everything shown comes from this device. */
export default function Profile() {
  useTitle('Your profile: UnlockDrill');
  const bank = useMemo(() => loadBank(EXAM.key), []);
  const nav = useNavigate();
  const account = currentAccount();
  const [p, setP] = useState(loadProgress);
  const refresh = () => setP(loadProgress());
  useEffect(() => { syncProgress().then(refresh); }, []);
  const week = weekSummary(p);
  const misses = p.answers.filter(a => !a.correct).slice(-8).reverse();
  const tagCounts = MISTAKE_TAGS.map(t => ({ ...t, n: p.answers.filter(a => a.tag === t.key).length }));
  const untagged = p.answers.filter(a => !a.correct && !a.tag).length;
  const maxMiss = week.missesByTopic[0]?.[1] ?? 1;

  function retag(questionId: string, current: MistakeTag | undefined, t: MistakeTag) {
    tagMistake(questionId, current === t ? null : t);
    refresh();
  }

  return (
    <Shell>
      <div className="wrap profile">
        <header className="profile-head">
          <span className="avatar" aria-hidden="true">{initials(account)}</span>
          <div>
            <h1>{account?.name ? `${account.name}’s profile` : 'Your profile'}</h1>
            {account ? (
              <p className="quiet" style={{ marginTop: 4 }}>
                Signed in as {account.email}.{' '}
                <button type="button" className="link-btn" onClick={async () => { await signOut(); nav('/signin'); }}>Sign out</button>
              </p>
            ) : (
              <p className="quiet" style={{ marginTop: 4 }}>You’re not signed in, so this is saved on this device only. <Link to="/signin">Sign in</Link> to keep it with your account.</p>
            )}
          </div>
        </header>

        <div className="profile-grid">
          <section className="panel" aria-labelledby="week-title">
            <h2 id="week-title" className="panel-title">This week</h2>
            {week.answered === 0 ? (
              <p style={{ marginTop: 6 }}>No questions this week yet. <Link to="/q?app=instagram&demo=1">Try one</Link></p>
            ) : (
              <>
                <p className="week-line">
                  You answered {week.answered} this week
                  {week.topMissTopic ? <>; most misses were {week.topMissTopic.toLowerCase()}.</> : <>, with no misses.</>}
                </p>
                {week.missesByTopic.length > 0 && (
                  <ul className="miss-bars" aria-label="Misses by topic">
                    {week.missesByTopic.slice(0, 5).map(([topic, n]) => (
                      <li key={topic}>
                        <span className="miss-topic">{topic}</span>
                        <span className="miss-bar" aria-hidden="true"><span style={{ width: `${(n / maxMiss) * 100}%` }} /></span>
                        <span className="miss-n">{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="small quiet" style={{ marginTop: 14 }}>{week.correct} of {week.answered} right. No streaks, no feed.</p>
              </>
            )}
          </section>

          <section className="panel" aria-labelledby="diag-title">
            <h2 id="diag-title" className="panel-title">Diagnostic</h2>
            {p.diagnostic ? (
              <>
                <p style={{ marginTop: 6 }}>{p.diagnostic.correct} of {p.diagnostic.total} right on {day(p.diagnostic.at)}.</p>
                {p.diagnostic.missedTopics.length > 0 && (
                  <p style={{ marginTop: 6 }}>Start with {p.diagnostic.missedTopics.slice(0, 3).join(', ').toLowerCase()}.</p>
                )}
                <p style={{ marginTop: 16 }}><Link to="/diagnostic">Take it again</Link></p>
              </>
            ) : (
              <>
                <p style={{ marginTop: 6 }}>Ten questions across {EXAM.sections.join(' and ')}, about ten minutes. It shows which topics to practice first. It doesn’t predict a score.</p>
                <div className="actions" style={{ marginTop: 18 }}><Link className="btn" to="/diagnostic">Take the diagnostic</Link></div>
              </>
            )}
          </section>

          <section className="panel span-2" aria-labelledby="log-title">
            <h2 id="log-title" className="panel-title">Mistake log</h2>
            <p className="small quiet" style={{ marginTop: 4 }}>After a wrong answer you can tag why, with one tap. Tagging is optional.</p>
            <ul className="tag-counts">
              {tagCounts.map(t => <li key={t.key}><strong>{t.n}</strong> {t.label.toLowerCase()}</li>)}
              <li><strong>{untagged}</strong> not tagged</li>
            </ul>
            {misses.length === 0 ? (
              <p style={{ marginTop: 14 }}>No misses logged yet.</p>
            ) : (
              <ul className="log">
                {misses.map(m => (
                  <li key={`${m.questionId}-${m.at}`}>
                    <div>
                      <p className="log-topic">{m.topic}</p>
                      <p className="small quiet">{m.section}, {day(m.at)}{m.source === 'diagnostic' ? ', diagnostic' : ''}</p>
                    </div>
                    <div className="tagger-row" role="group" aria-label={`Why you missed this ${m.topic.toLowerCase()} question`}>
                      {MISTAKE_TAGS.map(t => (
                        <button key={t.key} type="button" className="chip" aria-pressed={m.tag === t.key}
                          onClick={() => retag(m.questionId, m.tag, t.key)}>{t.label}</button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="span-2"><ReferralCard /></div>
        </div>

        <p className="small quiet" style={{ marginTop: 32 }}>
          For the team preview:{' '}
          <button type="button" className="link-btn small" onClick={() => { loadSampleData(bank); refresh(); }}>Fill with sample data</button>{' '}
          <button type="button" className="link-btn small" onClick={() => { clearProgress(); refresh(); }}>Clear history</button>
        </p>
      </div>
    </Shell>
  );
}
