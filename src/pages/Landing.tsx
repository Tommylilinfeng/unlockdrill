import { Link, useParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { SignupForm } from '../components/SignupForm';
import { findLanding } from '../content/landings';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function Landing() {
  const { slug } = useParams();
  const l = findLanding(slug);
  useTitle(l ? `${l.headline} | UnlockDrill` : "Not found | UnlockDrill");
  if (!l) return <NotFound />;
  return (
    <Shell>
      <div className="wrap lhero">
        <section>
          <p className="for">{l.forWho}</p>
          <h1>{l.headline}</h1>
          <p className="lead">{l.lead}</p>
          <div className="actions" style={{ marginTop: 24 }}>
            <a className="btn" href="#waitlist">Join the waitlist</a>
            <Link to="/q?app=instagram&demo=1">Try a question</Link>
          </div>
        </section>
        <section style={{ alignSelf: 'end' }} aria-label="What a student told us">
          <p className="pullquote" style={{ marginTop: 0 }}>“{l.quote.text}”</p>
          <p className="attrib small">{l.quote.source}</p>
        </section>
      </div>

      <section className="band" aria-label="How it works for you">
        <div className="wrap points">
          {l.points.map(p => (
            <div key={p.title}><h3>{p.title}</h3><p>{p.body}</p></div>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="wrap two">
          <div>
            <h2>“{l.objection.q}”</h2>
            <p style={{ marginTop: 14 }}>{l.objection.a}</p>
          </div>
          <div id="waitlist">
            <SignupForm variant={l.slug} />
          </div>
        </div>
      </section>
    </Shell>
  );
}
