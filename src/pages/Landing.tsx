import { Link, useParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { SignupForm } from '../components/SignupForm';
import { findLanding } from '../content/landings';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function Landing() {
  const { slug } = useParams();
  const l = findLanding(slug);
  useTitle(l ? `${l.headline} · UnlockDrill` : 'Not found · UnlockDrill');
  if (!l) return <NotFound />;
  return (
    <Shell>
      <section className="hero">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">For {l.audience}</p>
            <h1>{l.headline}</h1>
            <p className="lead">{l.subhead}</p>
            <blockquote className="card tint" style={{ margin: '24px 0' }}>
              <p style={{ margin: 0, fontSize: 18 }}>{l.quote.text}</p>
              <footer className="small muted" style={{ marginTop: 8 }}>{l.quote.source}</footer>
            </blockquote>
          </div>
          <div id="signup"><SignupForm variant={l.slug} cta={l.cta} /></div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          {l.points.map(p => (
            <div key={p.title} className="card"><h3>{p.title}</h3><p style={{ margin: 0 }}>{p.body}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: 720 }}>
            <h3>“{l.objection.q}”</h3>
            <p style={{ margin: 0 }}>{l.objection.a}</p>
          </div>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <a className="btn" href="#signup">{l.cta}</a>
            <Link className="btn secondary" to="/q?demo=1">Try a sample question</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
