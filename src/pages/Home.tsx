import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { SignupForm } from '../components/SignupForm';
import { QuestionCard } from '../components/QuestionCard';
import { LANDINGS } from '../content/landings';
import { EXAM, SITE_URL } from '../config/exam';
import { loadBank } from '../lib/questions';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';
import { useReveal } from '../lib/reveal';

export default function Home() {
  useTitle(`UnlockDrill: one ${EXAM.itemNoun} before you scroll`);
  const sample = loadBank(EXAM.key)[0];
  const [answered, setAnswered] = useState(false);
  const page = useReveal<HTMLDivElement>();
  const shortUrl = `${(SITE_URL || window.location.origin + import.meta.env.BASE_URL).replace(/^https?:\/\//, '').replace(/\/$/, '')}/q?app=instagram`;

  return (
    <Shell>
      <div ref={page}>
      <div className="wrap hero load-in">
        <section aria-labelledby="sample">
          <p className="hero-context"><span className="dot" aria-hidden="true" />You just opened Instagram. One question first.</p>
          {sample && (
            <QuestionCard question={sample} hero headingLevel="h2"
              onAnswered={c => { setAnswered(true); track('home_sample_answered', { correct: c }); }}
              after={<p className="small quiet" style={{ marginTop: 14 }}>Then you’d be back in Instagram.</p>} />
          )}
          <h2 id="sample" className="sr-only">Sample question</h2>
          {!answered && <p className="small quiet" style={{ marginTop: 18 }}>Go on, pick one. On your phone there’s a Skip button up top.</p>}
        </section>

        <section className="pitch" aria-labelledby="pitch-title">
          <h1 id="pitch-title">UnlockDrill puts one {EXAM.itemNoun} in front of the app you scroll.</h1>
          <p>Answer it or skip it, then you’re back in the app. It’s for adults studying for the {EXAM.label} who keep losing study time to their phone.</p>
          <div className="actions">
            <a className="btn" href="#waitlist">Join the waitlist</a>
            <Link to="/setup">Set it up on iPhone</Link>
          </div>
        </section>
      </div>

      <section className="band" id="how" aria-labelledby="how-title">
        <div className="wrap two">
          <div className="reveal">
            <h2 id="how-title">How it gets in front of Instagram</h2>
            <ol className="steps">
              <li><div><h3>Pick the app you scroll</h3><p>Instagram, TikTok, YouTube, X, or Reddit, and how often you want a question.</p></div></li>
              <li><div><h3>Add one automation in Shortcuts</h3><p>The Shortcuts app is already on your iPhone. You tell it: when this app opens, open UnlockDrill. It takes about five minutes, and there’s nothing to download.</p></div></li>
              <li><div><h3>Open the app like always</h3><p>A question appears. Answer it or skip it, and you’re sent straight back.</p></div></li>
            </ol>
            <p style={{ marginTop: 28 }}><Link to="/setup">See the setup steps</Link></p>
          </div>
          <figure className="reveal" style={{ margin: 0 }}>
            <div className="ios" role="img" aria-label="The Shortcuts automation: when Instagram is opened, open the UnlockDrill link">
              <div className="ios-row"><span className="ios-icon app" aria-hidden="true">IG</span><div><div className="ios-title">When Instagram is opened</div><div className="ios-sub">Run immediately</div></div></div>
              <div className="ios-row"><span className="ios-icon url" aria-hidden="true">⌘</span><div><div className="ios-title">Open URLs</div><div className="ios-sub">{shortUrl}</div></div></div>
            </div>
            <figcaption className="small quiet" style={{ marginTop: 14, maxWidth: 420 }}>The heart of the automation. The full recipe adds a small check so coming back to Instagram doesn’t ask again. It uses Apple’s own automation, so UnlockDrill never needs access to your other apps.</figcaption>
          </figure>
        </div>
      </section>

      <section className="block" aria-labelledby="lock-title">
        <div className="wrap two">
          <div className="reveal">
            <h2 id="lock-title">Why it isn’t a blocker</h2>
            <p className="pullquote">“Screen Time doesn’t do anything for me. I just tap ignore and keep scrolling.”</p>
            <p className="attrib small">One of twelve test takers we interviewed</p>
            <p style={{ marginTop: 22 }}>We started out wanting to lock the phone until you answered. Interviews talked us out of it. People ignore locks, so UnlockDrill asks instead, and the choice stays yours.</p>
          </div>
          <div className="two reveal" style={{ gap: 32 }}>
            <div>
              <h3>What it does</h3>
              <ul className="plain">
                <li>One question when you open an app you chose</li>
                <li>A short explanation of the answer</li>
                <li>Skip, pause, and how-often settings</li>
              </ul>
            </div>
            <div>
              <h3>What it won’t do</h3>
              <ul className="plain no">
                <li>Lock your phone</li>
                <li>Count streaks or send guilt notifications</li>
                <li>Promise a score</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="you-title">
        <div className="wrap reveal">
          <h2 id="you-title">Which one sounds like you?</h2>
          <ul className="choose">
            {LANDINGS.map(l => (
              <li key={l.slug}>
                <Link to={`/for/${l.slug}`}><span className="say">{l.selfDescription}</span><span className="go">Read more</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" id="waitlist" aria-labelledby="wait-title">
        <div className="wrap two reveal">
          <div>
            <h2 id="wait-title">Join the waitlist</h2>
            <p style={{ marginTop: 12 }}>The iPhone version works today and we’re adding questions every week. Leave your email and we’ll write once, when the full question set is ready.</p>
          </div>
          <SignupForm variant="home" />
        </div>
      </section>
      </div>
    </Shell>
  );
}
