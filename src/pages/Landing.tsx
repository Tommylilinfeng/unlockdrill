import { Link, useParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { findLanding } from '../content/landings';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function Landing() {
  const { slug } = useParams();
  const l = findLanding(slug);
  useTitle(l ? `${l.headline} | UnlockDrill` : "Not found | UnlockDrill");
  if (!l) return <NotFound />;
  return (
    <Shell tone="night">
      <section className="night lhero" aria-labelledby="l-title">
        <div className="wrap split">
          <div>
            <p className="for">{l.forWho}</p>
            <h1 id="l-title">{l.headline}</h1>
            <p className="lead">{l.lead}</p>
            <div className="actions">
              <Link className="btn btn-light" to="/setup">Set it up on iPhone</Link>
              <Link className="btn btn-ghost" to="/q?app=instagram&demo=1">Try a question</Link>
            </div>
          </div>
          <blockquote className="bigquote side" aria-label="What a student told us">
            <p>“{l.quote.text}”</p>
            <footer>{l.quote.source}</footer>
          </blockquote>
        </div>
      </section>

      <section className="paper section" aria-labelledby="l-how">
        <div className="wrap">
          <h2 id="l-how">How it works for you</h2>
          <ul className="points">
            {l.points.map(p => (
              <li key={p.title}><h3>{p.title}</h3><p>{p.body}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="paper section objection" aria-labelledby="l-obj">
        <div className="wrap split">
          <h2 id="l-obj">“{l.objection.q}”</h2>
          <div>
            <p className="lead">{l.objection.a}</p>
            <p className="actions"><Link className="btn" to="/q?app=instagram&demo=1">Try a question</Link></p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
