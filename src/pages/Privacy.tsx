import { Shell } from '../components/Shell';
import { useTitle } from '../lib/useTitle';

export default function Privacy() {
  useTitle('Privacy: UnlockDrill');
  return (
    <Shell>
      <div className="wrap narrow page-head">
        <h1>Privacy</h1>
        <p className="lead">UnlockDrill is a student project from Columbia’s Startup Studio. Here’s exactly what it collects.</p>
      </div>
      <div className="wrap narrow prose">
        <h2>Adults only</h2>
        <p>UnlockDrill is for people 18 and over. We don’t knowingly collect anything from anyone younger. If you’re under 18, please don’t sign up.</p>
        <h2>What we collect</h2>
        <ul className="group">
          <li className="grow"><div><p className="grow-title">Waitlist</p><p className="grow-sub">Your email, which page you signed up on, and where you came from (link tags and referrer). We use it to email you once.</p></div></li>
          <li className="grow"><div><p className="grow-title">Question activity</p><p className="grow-sub">Whether a question was shown, answered, skipped, or paused, which one, and how long it took. It’s linked to a random ID on your phone, not your name or email.</p></div></li>
          <li className="grow"><div><p className="grow-title">Page visits</p><p className="grow-sub">Through Google Analytics, when it’s turned on.</p></div></li>
        </ul>
        <h2>What stays on your phone</h2>
        <p>The app you chose, how often, whether you paused, and which questions you’ve seen.</p>
        <h2>Deleting your data</h2>
        <p>Reply to any email from us and we’ll delete your address and anything tied to it.</p>
      </div>
    </Shell>
  );
}
