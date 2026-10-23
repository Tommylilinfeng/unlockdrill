import { useEffect, useRef, useState } from 'react';
import type { Question } from '../lib/questions';
import { QuestionCard } from './QuestionCard';

type Stage = 'feed' | 'ask' | 'back';

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Flat scenes for the pretend feed. Decorative; the whole feed is hidden from assistive tech. */
function Scene({ n }: { n: number }) {
  if (n === 0) return (
    <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice"><rect width="300" height="220" fill="#F7E6B5" /><circle cx="196" cy="96" r="38" fill="#F5C451" /><path d="M0 150 Q70 104 150 140 T300 128 V220 H0Z" fill="#86B59B" /><path d="M0 182 Q90 140 180 176 T300 168 V220 H0Z" fill="#21664C" /></svg>
  );
  if (n === 1) return (
    <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice"><rect width="300" height="220" fill="#1C2D26" /><g fill="#2A3F36"><rect x="24" y="70" width="52" height="150" /><rect x="88" y="40" width="64" height="180" /><rect x="164" y="96" width="44" height="124" /><rect x="220" y="58" width="56" height="162" /></g><g fill="#F5C451"><rect x="36" y="88" width="8" height="10" /><rect x="102" y="62" width="8" height="10" /><rect x="126" y="92" width="8" height="10" /><rect x="232" y="80" width="8" height="10" /><rect x="254" y="122" width="8" height="10" /><rect x="176" y="118" width="8" height="10" /></g><circle cx="250" cy="28" r="10" fill="#F2F5F3" /></svg>
  );
  return (
    <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice"><rect width="300" height="220" fill="#EDF4EF" /><path d="M0 120 Q40 104 80 120 T160 120 T240 120 T320 120 V220 H0Z" fill="#86B59B" /><path d="M0 150 Q40 134 80 150 T160 150 T240 150 T320 150 V220 H0Z" fill="#21664C" /><circle cx="70" cy="60" r="20" fill="#FCFCFA" /></svg>
  );
}

function Post({ n }: { n: number }) {
  const tint = ['#F5C451', '#86B59B', '#21664C'][n % 3];
  return (
    <div className="post">
      <div className="post-head"><span className="post-av" style={{ background: tint }} /><span className="post-name" /><span className="post-meta" /></div>
      <div className="post-img"><Scene n={n % 3} /></div>
      <div className="post-acts">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
        <svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3.2-6.4L20 4v5h-5" /></svg>
        <svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2-6-8-2z" /></svg>
      </div>
      <span className="post-line" /><span className="post-line short" />
    </div>
  );
}

/**
 * The homepage phone. Plays the real moment once: a feed starts, the UnlockDrill screen rises over it,
 * the visitor answers inside the phone, and "Back to Instagram" drops them into the feed again.
 */
export function PhoneDemo({ question, appLabel, onAnswered }: {
  question: Question; appLabel: string; onAnswered?: (correct: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>(() => (calm() ? 'ask' : 'feed'));
  const [run, setRun] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (stage !== 'feed' || !ref.current) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      t = window.setTimeout(() => setStage('ask'), 1500);
      io.disconnect();
    }, { threshold: 0.45 });
    io.observe(ref.current);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, [stage, run]);

  function back() { setStage('back'); }
  function replay() { setAnswered(false); setRun(r => r + 1); setStage(calm() ? 'ask' : 'feed'); }

  const asking = stage === 'ask';
  return (
    <figure className="phone-wrap">
      <div className="phone" ref={ref} role="group" aria-label={`Demo: what happens when you open ${appLabel}`}>
        <div className="phone-screen">
          <div className={`feed is-${stage}`} key={`f${run}`} aria-hidden="true">
            <div className="feed-bar"><span>9:41</span><span className="feed-app">{appLabel}</span></div>
            <div className="feed-scroll">{[0, 1, 2, 3].map(n => <Post key={n} n={n} />)}</div>
          </div>
          <div className={`ix${asking ? ' on' : ''}`} inert={!asking} aria-hidden={!asking}>
            <div className="ix-top">
              <span className="app-chip">{appLabel} is one tap away</span>
              <button type="button" className="skip-btn" onClick={back}>Skip</button>
            </div>
            <div className="ix-card">
              <QuestionCard key={run} compact question={question}
                onAnswered={c => { setAnswered(true); onAnswered?.(c); }}
                after={<button type="button" className="btn btn-block" onClick={back}>Back to {appLabel}</button>} />
            </div>
            {!answered && (
              <div className="ix-pause">
                <button type="button" className="pause-btn" onClick={back}>Pause for an hour</button>
                <button type="button" className="pause-btn" onClick={back}>Until tomorrow</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <figcaption className="phone-caption" aria-live="polite">
        {stage === 'feed' && <span>Opening {appLabel}…</span>}
        {stage === 'ask' && <span>{answered ? 'That’s the whole thing.' : 'Go on, answer it in the phone.'}</span>}
        {stage === 'back' && <><span>Back in {appLabel}.</span> <button type="button" className="link-btn" onClick={replay}>Play it again</button></>}
      </figcaption>
    </figure>
  );
}
