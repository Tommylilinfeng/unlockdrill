import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PhoneDemo } from '../components/PhoneDemo';
import { ShortcutCard } from '../components/ShortcutCard';
import { LANDINGS } from '../content/landings';
import { EXAM, SITE_URL } from '../config/exam';
import { FREQUENCIES, DEFAULTS } from '../lib/settings';
import { loadBank } from '../lib/questions';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

export default function Home() {
  useTitle(`UnlockDrill: one ${EXAM.itemNoun} before you scroll`);
  const sample = loadBank(EXAM.key)[0];
  const shortUrl = `${(SITE_URL || window.location.origin + import.meta.env.BASE_URL).replace(/^https?:\/\//, '').replace(/\/$/, '')}/q?app=instagram`;

  return (
    <Shell tone="night">
      <section className="night hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="mega">One {EXAM.itemNoun} before you scroll.</h1>
            <p className="lead">Open Instagram and UnlockDrill asks one question first. Answer it or skip it, then you’re straight back in the app.</p>
            <div className="actions">
              <Link className="btn btn-light" to="/setup">Set it up on iPhone</Link>
              <Link className="btn btn-ghost" to="/q?app=instagram&demo=1">Try a question</Link>
            </div>
            <p className="fine">Runs through the Shortcuts app on iPhone, iOS 17 or later. Nothing to download.</p>
          </div>
          {sample && (
            <PhoneDemo question={sample} appLabel="Instagram" onAnswered={c => track('home_sample_answered', { correct: c })} />
          )}
        </div>
      </section>

      <section className="paper section" aria-labelledby="control-title">
        <div className="wrap split">
          <div>
            <h2 id="control-title">Skip is always on the screen.</h2>
            <p className="lead">You pick the app, how often it asks, and when it takes a break. A wrong answer costs nothing: you see why, then you go back.</p>
            <ul className="facts">
              <li><strong>Skip</strong> sits top right on every question.</li>
              <li><strong>Pause</strong> for an hour or until tomorrow, from the question itself.</li>
              <li><strong>How often</strong> is yours to change any time.</li>
            </ul>
          </div>
          <figure className="freq-figure">
            <div className="group" role="img" aria-label={`The how-often choices. ${FREQUENCIES.map(f => f.label).join(', ')}. The default is ${FREQUENCIES.find(f => f.key === DEFAULTS.frequency)?.label}.`}>
              <p className="group-head">How often</p>
              {FREQUENCIES.map(f => (
                <div key={f.key} className={`grow freq${f.key === DEFAULTS.frequency ? ' on' : ''}`}>
                  <div><p className="grow-title">{f.label}</p><p className="grow-sub">{f.help}</p></div>
                  {f.key === DEFAULTS.frequency && (
                    <svg className="tick" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  )}
                </div>
              ))}
            </div>
            <figcaption>The choices on your settings page. Once an hour is where it starts.</figcaption>
          </figure>
        </div>
      </section>

      <section className="night section quote-band" aria-labelledby="lock-title">
        <div className="wrap">
          <h2 id="lock-title" className="kicker">Why it isn’t a blocker</h2>
          <blockquote className="bigquote">
            <p>“Screen Time doesn’t do anything for me. I just tap ignore and keep scrolling.”</p>
            <footer>One of twelve test takers we interviewed</footer>
          </blockquote>
          <div className="split quote-after">
            <p className="lead">We started out wanting to lock the phone until you answered. Interviews talked us out of it. People ignore locks, so UnlockDrill asks instead, and the choice stays yours.</p>
            <div>
              <h3>What it won’t do</h3>
              <ul className="nots">
                <li>Lock your phone</li>
                <li>Count streaks or send guilt notifications</li>
                <li>Promise a score</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="paper section" id="how" aria-labelledby="how-title">
        <div className="wrap split">
          <div>
            <h2 id="how-title">How it gets in front of Instagram</h2>
            <ol className="steps">
              <li><h3>Pick the app you scroll</h3><p>Instagram, TikTok, YouTube, X, or Reddit, and how often you want a question.</p></li>
              <li><h3>Add one automation in Shortcuts</h3><p>The Shortcuts app is already on your iPhone. You tell it: when this app opens, open UnlockDrill. It takes about five minutes.</p></li>
              <li><h3>Open the app like always</h3><p>A question appears. Answer it or skip it, and you’re sent straight back.</p></li>
            </ol>
            <p className="actions"><Link className="btn" to="/setup">See the setup steps</Link></p>
          </div>
          <figure className="shortcut-figure">
            <ShortcutCard trigger="Instagram" actions={[{ icon: 'url', title: 'Open URLs', token: shortUrl }]} />
            <figcaption>The heart of the automation. The full recipe adds a small check so coming back to Instagram doesn’t ask again. It’s Apple’s own automation, so UnlockDrill never needs access to your other apps.</figcaption>
          </figure>
        </div>
      </section>

      <section className="paper section chooser-section" aria-labelledby="you-title">
        <div className="wrap">
          <h2 id="you-title">Which one sounds like you?</h2>
          <ul className="chooser">
            {LANDINGS.map(l => (
              <li key={l.slug}>
                <Link to={`/for/${l.slug}`}>
                  <span className="say">{l.selfDescription}</span>
                  <span className="go">Read more</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
