import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { QuestionCard } from '../components/QuestionCard';
import { MistakeTagger } from '../components/MistakeTagger';
import { EXAM } from '../config/exam';
import { loadBank, type Question } from '../lib/questions';
import { loadProgress, recordAnswer, saveProgress } from '../lib/progress';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

const LENGTH = 10;

/** One question per topic, alternating sections, so ten questions cover as much ground as the bank allows. */
function pickSet(bank: Question[]): Question[] {
  const bySection = EXAM.sections.map(sec => {
    const seen = new Set<string>();
    return bank.filter(q => q.section === sec && !seen.has(q.topic) && seen.add(q.topic));
  });
  const out: Question[] = [];
  for (let i = 0; out.length < LENGTH && bySection.some(s => s[i]); i++) {
    for (const s of bySection) if (s[i] && out.length < LENGTH) out.push(s[i]);
  }
  return out;
}

type Answer = { q: Question; correct: boolean | null };

export default function Diagnostic() {
  useTitle('Diagnostic: UnlockDrill');
  const set = useMemo(() => pickSet(loadBank(EXAM.key)), []);
  const [step, setStep] = useState(-1); // -1 intro, set.length results
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<boolean | null>(null);

  function start() { setStep(0); setAnswers([]); setCurrent(null); track('diagnostic_started', {}); }

  function next(skipped = false) {
    const q = set[step];
    const all = [...answers, { q, correct: skipped ? null : current }];
    setAnswers(all);
    setCurrent(null);
    if (step + 1 < set.length) { setStep(step + 1); window.scrollTo(0, 0); return; }
    const correct = all.filter(a => a.correct).length;
    const missedTopics = all.filter(a => a.correct !== true).map(a => a.q.topic);
    saveProgress({ ...loadProgress(), diagnostic: { at: Date.now(), total: all.length, correct, missedTopics } });
    track('diagnostic_finished', { correct, total: all.length });
    setStep(set.length);
  }

  if (step < 0) {
    return (
      <Shell>
        <div className="wrap narrow page-head">
          <h1>Ten questions to find where to start.</h1>
          <p className="lead">One question per topic across {EXAM.sections.join(' and ')}. It takes about ten minutes. At the end you’ll see which topics to practice first.</p>
        </div>
        <div className="wrap narrow">
          <ul className="group checks">
            <li className="grow">Skip any question, or stop whenever you like</li>
            <li className="grow">It doesn’t predict a score</li>
            <li className="grow">Results stay on this device</li>
          </ul>
          <div className="actions">
            <button type="button" className="btn btn-big" onClick={start}>Start the diagnostic</button>
            <Link className="btn btn-quiet" to="/profile">Back to your profile</Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (step >= set.length) {
    const right = answers.filter(a => a.correct).length;
    const missed = answers.filter(a => a.correct !== true);
    const bySection = EXAM.sections.map(sec => {
      const in_ = answers.filter(a => a.q.section === sec);
      return { sec, right: in_.filter(a => a.correct).length, total: in_.length };
    });
    return (
      <Shell>
        <div className="wrap narrow page-head">
          <p className="lead">Diagnostic results</p>
          <h1><span className="num">{right}</span> of <span className="num">{answers.length}</span> right.</h1>
        </div>
        <div className="wrap narrow groups">
          <section className="gsection" aria-labelledby="sec-title">
            <h2 id="sec-title" className="gtitle">By section</h2>
            <ul className="group">
              {bySection.map(s => <li key={s.sec} className="grow"><p className="grow-title">{s.sec}</p><span className="grow-value"><span className="num">{s.right}</span> of <span className="num">{s.total}</span></span></li>)}
            </ul>
          </section>
          <section className="gsection" aria-labelledby="first-title">
            <h2 id="first-title" className="gtitle">{missed.length ? 'Practice these first' : 'Nothing missed'}</h2>
            {missed.length > 0 ? (
              <ul className="group">
                {missed.map(a => <li key={a.q.id} className="grow"><div><p className="grow-title">{a.q.topic}</p><p className="grow-sub">{a.q.section}{a.correct === null ? ', skipped' : ''}</p></div></li>)}
              </ul>
            ) : <p>Every topic in this set went right. Your everyday questions will mix all of them.</p>}
            <p className="gfoot">Ten questions is a rough guide, not a score prediction.</p>
          </section>
          <div className="actions">
            <Link className="btn btn-big" to="/profile">See your profile</Link>
            <button type="button" className="btn btn-quiet" onClick={start}>Take it again</button>
          </div>
        </div>
      </Shell>
    );
  }

  const q = set[step];
  const answered = current !== null;
  return (
    <Shell>
      <div className="wrap narrow diag">
        <div className="diag-bar">
          <p>Question <span className="num">{step + 1}</span> of <span className="num">{set.length}</span></p>
          <Link to="/profile">Stop</Link>
        </div>
        <div className="diag-track" aria-hidden="true"><span style={{ transform: `scaleX(${step / set.length})` }} /></div>
        <div className="diag-card" key={q.id}>
          <QuestionCard question={q} headingLevel="h1"
            onAnswered={c => { setCurrent(c); recordAnswer(q, c, 'diagnostic'); }}
            after={
              <>
                {current === false && <MistakeTagger questionId={q.id} />}
                <button type="button" className="btn btn-block btn-big" onClick={() => next()}>{step + 1 < set.length ? 'Next question' : 'See results'}</button>
              </>
            } />
        </div>
        {!answered && (
          <div className="actions">
            <button type="button" className="btn btn-quiet" onClick={() => next(true)}>Skip this one</button>
          </div>
        )}
      </div>
    </Shell>
  );
}
