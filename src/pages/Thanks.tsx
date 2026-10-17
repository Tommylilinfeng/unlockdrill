import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';

/** Thank-you page: fires the `signup` event that is marked as a key event in GA4. */
export default function Thanks() {
  useTitle('You are on the list · UnlockDrill');
  const [params] = useSearchParams();
  const from = params.get('from') ?? 'unknown';
  useEffect(() => { track('signup', { variant: from }); }, [from]);
  return (
    <Shell>
      <section className="hero"><div className="container" style={{ maxWidth: 720 }}>
        <p className="eyebrow">Thank you</p>
        <h1>You are on the list.</h1>
        <p className="lead">We will send one email when the first version is ready to set up. Until then, you can try the flow right now.</p>
        <div className="btn-row">
          <Link className="btn" to="/setup">Set it up on your iPhone</Link>
          <Link className="btn secondary" to="/q?demo=1">Try a sample question</Link>
        </div>
        <p className="small muted" style={{ marginTop: 24 }}>Want to help shape it? Reply to the confirmation email with the app you would attach it to and the exam you are taking.</p>
      </div></section>
    </Shell>
  );
}
