import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Buddy } from '../components/Logo';
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
      <div className="wrap narrow page-head">
        <Buddy size={72} />
        <h1>You’re on the waitlist.</h1>
        <p className="lead">We’ll email you once, when the full question set is ready. You don’t have to wait to try it, though.</p>
        <div className="actions">
          <Link className="btn" to="/setup">Set it up on iPhone</Link>
          <Link className="btn btn-quiet" to="/q?app=instagram&demo=1">Try a question</Link>
        </div>
      </div>
      <div className="wrap narrow groups">
        {PREVIEW && <ReferralCard />}
        <p className="quiet">If you reply to our email with the app you’d use it on and the test you’re taking, it helps us pick the next questions.</p>
      </div>
    </Shell>
  );
}
