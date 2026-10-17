import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { SignupForm } from '../components/SignupForm';
import { QuestionCard } from '../components/QuestionCard';
import { LANDINGS } from '../content/landings';
import { EXAM } from '../config/exam';
import { loadBank } from '../lib/questions';
import { useTitle } from '../lib/useTitle';

export default function Home() {
  useTitle(`UnlockDrill: One ${EXAM.itemNoun} before you scroll`);
  const sample = loadBank(EXAM.key)[0];
  return (
    <Shell>
      <section className="hero">
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <p className="eyebrow">For {EXAM.audience}</p>
            <h1>One {EXAM.itemNoun} before you scroll.</h1>
            <p className="lead">Choose an app. The next time you open it, a short practice question appears first. Answer it or skip it, and keep control with pause and frequency settings.</p>
            <div className="btn-row">
              <a className="btn" href="#signup">Get early access</a>
              <Link className="btn secondary" to="/q?demo=1">Try a sample question</Link>
            </div>
            <p className="small muted" style={{ marginTop: 16 }}>A small start for the days a full study session feels too big.</p>
          </div>
          <div className="card">
            {sample ? <QuestionCard question={sample} compact /> : <p>Sample question coming soon.</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How it works</h2>
          <div className="grid grid-3">
            <div className="card tint"><h3>1. Pick an app</h3><p style={{ margin: 0 }}>Instagram, TikTok, YouTube, X, or Reddit. One phone setting, done once. <Link to="/setup">See the setup</Link>.</p></div>
            <div className="card tint"><h3>2. Open it as usual</h3><p style={{ margin: 0 }}>One {EXAM.itemNoun} appears first, with the frequency you chose. Skip is always visible.</p></div>
            <div className="card tint"><h3>3. Answer, read the why, go on</h3><p style={{ margin: 0 }}>A one-line explanation, then straight back to the app you opened.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Who it is for</h2>
          <div className="grid grid-3">
            {LANDINGS.map(l => (
              <article key={l.slug} className="card stack">
                <p className="eyebrow" style={{ marginBottom: 0 }}>{l.valueProp}</p>
                <h3 style={{ margin: 0 }}>{l.headline}</h3>
                <p className="muted" style={{ margin: 0 }}>{l.audience}.</p>
                <Link to={`/for/${l.slug}`}>Read more</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="signup">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2>Be first to try it</h2>
            <p>We are building the first version now. Leave your email and we will send one message when it is ready to install.</p>
            <p className="small muted">UnlockDrill is for adults 18 and over. We do not collect information from minors.</p>
          </div>
          <SignupForm variant="home" />
        </div>
      </section>
    </Shell>
  );
}
