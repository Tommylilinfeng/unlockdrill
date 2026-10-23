import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Buddy } from '../components/Logo';
export default function NotFound() {
  return (
    <Shell>
      <div className="wrap narrow page-head">
        <Buddy size={72} mood="rest" />
        <h1>There’s no page here.</h1>
        <p className="lead">The link may be old, or mistyped.</p>
        <div className="actions">
          <Link className="btn" to="/">Go to the homepage</Link>
          <Link className="btn btn-quiet" to="/q?app=instagram&demo=1">Try a question</Link>
        </div>
      </div>
    </Shell>
  );
}
