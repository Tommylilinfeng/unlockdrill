import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { track } from '../lib/analytics';
import { useTitle } from '../lib/useTitle';
import { PREVIEW } from '../lib/progress';
import { ReferralCard } from '../components/ReferralCard';

/** Fires the `signup` event that is marked as a key event in GA4. */
export default function Thanks() {
  useTitle('You’re on the waitlist: UnlockDrill');
  const [params] = useSearchParams();
  const from = params.get('from') ?? 'unknown';
  useEffect(() => { track('signup', { variant: from }); }, [from]);
  return (
    <Shell>
      <div className="wrap" style={{ paddingTop: 64, maxWidth: 760 }}>
        <h1>You’re on the waitlist.</h1>
        <p className="lead" style={{ marginTop: 16 }}>We’ll email you once, when the full question set is ready. You don’t have to wait to try it, though.</p>
        <div className="actions" style={{ marginTop: 26 }}>
          <Link className="btn" to="/setup">Set it up on iPhone</Link>
          <Link to="/q?app=instagram&demo=1">Try a question</Link>
        </div>
        {PREVIEW && <div style={{ marginTop: 40 }}><ReferralCard /></div>}
        <p className="small quiet" style={{ marginTop: 40 }}>If you reply to our email with the app you’d use it on and the test you’re taking, it helps us pick the next questions.</p>
      </div>
    </Shell>
  );
}
