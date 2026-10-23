import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { ReferralCard } from '../components/ReferralCard';
import { EXAM } from '../config/exam';
import { loadBank } from '../lib/questions';
import {
  MISTAKE_TAGS, clearProgress, loadProgress, loadSampleData, syncProgress, tagMistake, weekSummary, type AnswerRecord, type MistakeTag,
} from '../lib/progress';
import { useTitle } from '../lib/useTitle';
import { currentAccount, initials, signOut } from '../lib/account';

const MAX_DOTS = 5;

/** The last seven days, oldest first, each with that day's answers: one bubble per answer, like a row on an answer sheet. */
function lastSevenDays(answers: AnswerRecord[], now = Date.now()) {
  return Array.from({ length: 7 }, (_, k) => {
    const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - k));
    const start = d.getTime(); const end = start + 24 * 60 * 60 * 1000;
    return { label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), name: d.toLocaleDateString('en-US', { weekday: 'long' }), today: k === 6, answers: answers.filter(a => a.at >= start && a.at < end) };
  });
}

const day = (t: number) => new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

function Chevron() {
  return <svg className="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>;
}

/** Profile: what this device (or your account, when signed in) has practiced. */
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
  const totalMiss = week.missesByTopic.reduce((n, [, c]) => n + c, 0) || 1;
  // When the top topics are tied there is no "most missed" topic, so the copy says so instead of picking one.
  const tied = week.missesByTopic.length > 1 && week.missesByTopic[1][1] === week.missesByTopic[0][1];

  function retag(questionId: string, current: MistakeTag | undefined, t: MistakeTag) {
    tagMistake(questionId, current === t ? null : t);
    refresh();
  }

  return (
    <Shell>
      <div className="wrap profile">
        <aside className="id-card night" aria-labelledby="profile-title">
          <div className="id-top">
            <span className="avatar" aria-hidden="true">{initials(account)}</span>
            <div className="id-name">
              <h1 id="profile-title">{account?.name ? account.name : 'Your profile'}</h1>
              <p>{account ? account.email : 'Saved on this device only'}</p>
            </div>
          </div>
          {week.answered === 0 ? (
            <div className="id-empty">
              <p className="id-big">Nothing yet this week.</p>
              <p>Your first question shows up here.</p>
              <Link className="btn btn-light" to="/q?app=instagram&demo=1">Try a question</Link>
            </div>
          ) : (
            <div className="id-week">
              <p className="id-num"><span className="num">{week.answered}</span></p>
              <p className="id-label">{week.answered === 1 ? 'question' : 'questions'} this week, <span className="num">{week.correct}</span> right</p>
              <ul className="week-strip" aria-label="Answers per day, last seven days">
                {lastSevenDays(p.answers).map(d => {
                  const right = d.answers.filter(a => a.correct).length;
                  return (
                    <li key={d.name} className={d.today ? 'today' : undefined}
                      aria-label={`${d.name}${d.today ? ' (today)' : ''}: ${d.answers.length} answered, ${right} right`}>
                      <span className="dots" aria-hidden="true">
                        {d.answers.slice(0, MAX_DOTS).map(a => <span key={a.at} className={`dot ${a.correct ? 'right' : 'miss'}`} />)}
                        {d.answers.length > MAX_DOTS && <span className="more">+{d.answers.length - MAX_DOTS}</span>}
                      </span>
                      <span className="day" aria-hidden="true">{d.label}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="id-note">{!week.topMissTopic ? <>No misses this week.</> : tied ? <>Misses spread across {week.missesByTopic.length} topics.</> : <>Most misses: {week.topMissTopic.toLowerCase()}.</>} No streaks, no feed.</p>
            </div>
          )}
          <div className="id-foot">
            {account ? (
              <button type="button" className="link-btn" onClick={async () => { await signOut(); nav('/signin'); }}>Sign out</button>
            ) : (
              <p>Sign in to keep this with your account. <Link to="/signin">Sign in</Link></p>
            )}
          </div>
        </aside>

        <div className="groups">
          {week.missesByTopic.length > 0 && (
            <section className="gsection" aria-labelledby="miss-title">
              <h2 id="miss-title" className="gtitle">Misses this week, by topic</h2>
              <ul className="group" aria-label="Misses by topic">
                {week.missesByTopic.slice(0, 5).map(([topic, n]) => (
                  <li key={topic} className="grow miss">
                    <span className="miss-topic">{topic}</span>
                    <span className="miss-bar" aria-hidden="true"><span style={{ transform: `scaleX(${n / totalMiss})` }} /></span>
                    <span className="num miss-n">{n}</span>
                  </li>
                ))}
                {week.missesByTopic.length > 5 && (
                  <li className="grow more-row">And {week.missesByTopic.length - 5} more {week.missesByTopic.length - 5 === 1 ? 'topic' : 'topics'}, not shown.</li>
                )}
              </ul>
              <p className="gfoot">Bars show each topic’s share of this week’s <span className="num">{totalMiss}</span> misses.</p>
            </section>
          )}

          <section className="gsection" aria-labelledby="diag-title">
            <h2 id="diag-title" className="gtitle">Diagnostic</h2>
            <div className="group">
              {p.diagnostic ? (
                <>
                  <div className="grow">
                    <div><p className="grow-title"><span className="num">{p.diagnostic.correct}</span> of <span className="num">{p.diagnostic.total}</span> right</p><p className="grow-sub">{day(p.diagnostic.at)}</p></div>
                  </div>
                  {p.diagnostic.missedTopics.length > 0 && (
                    <div className="grow"><div><p className="grow-title">Start with</p><p className="grow-sub">{p.diagnostic.missedTopics.slice(0, 3).join(', ').toLowerCase()}</p></div></div>
                  )}
                  <Link className="grow grow-link" to="/diagnostic"><span className="grow-title">Take it again</span><Chevron /></Link>
                </>
              ) : (
                <div className="grow stack">
                  <p>Ten questions across {EXAM.sections.join(' and ')}, about ten minutes. It shows which topics to practice first. It doesn’t predict a score.</p>
                  <Link className="btn" to="/diagnostic">Take the diagnostic</Link>
                </div>
              )}
            </div>
          </section>

          <section className="gsection" aria-labelledby="log-title">
            <h2 id="log-title" className="gtitle">Mistake log</h2>
            <div className="group">
              <ul className="tally" aria-label="Mistakes by reason">
                {tagCounts.map(t => <li key={t.key}><span className="num">{t.n}</span>{t.label}</li>)}
                <li><span className="num">{untagged}</span>Not tagged</li>
              </ul>
              {misses.length === 0 ? (
                <p className="grow">No misses logged yet. After a wrong answer you can tag why with one tap.</p>
              ) : (
                <ul className="log">
                  {misses.map(m => (
                    <li key={`${m.questionId}-${m.at}`} className="grow log-row">
                      <div>
                        <p className="grow-title">{m.topic}</p>
                        <p className="grow-sub">{m.section}, {day(m.at)}{m.source === 'diagnostic' ? ', diagnostic' : ''}</p>
                      </div>
                      <div className="chips" role="group" aria-label={`Why you missed this ${m.topic.toLowerCase()} question`}>
                        {MISTAKE_TAGS.map(t => (
                          <button key={t.key} type="button" className="chip" aria-pressed={m.tag === t.key}
                            onClick={() => retag(m.questionId, m.tag, t.key)}>{t.label}</button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="gfoot">Tagging is optional. It helps you see whether the same mistakes keep coming back.</p>
          </section>

          <ReferralCard />

          <p className="preview-tools">
            For the team preview:{' '}
            <button type="button" className="link-btn" onClick={() => { loadSampleData(bank); refresh(); }}>Fill with sample data</button>{' '}
            <button type="button" className="link-btn" onClick={() => { clearProgress(); refresh(); }}>Clear history</button>
          </p>
        </div>
      </div>
    </Shell>
  );
}
