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
          <li className="grow"><div><p className="grow-title">Your account, if you make one</p><p className="grow-sub">Your name, email and password, through Supabase Auth. Passwords are stored hashed by Supabase; we never see them. An account is optional: single questions work without one. The diagnostic needs one so its results are saved.</p></div></li>
          <li className="grow"><div><p className="grow-title">Your practice history, when signed in</p><p className="grow-sub">Which questions you answered, the topic, whether you got them right, any mistake tags you chose, your diagnostic result, and your invite code. It’s saved to your account so your profile works on any device. Only you can read it.</p></div></li>
          <li className="grow"><div><p className="grow-title">Earlier waitlist signups</p><p className="grow-sub">If you joined the old waitlist, we kept your email, the page you signed up on, and where you came from (link tags and referrer), to email you once.</p></div></li>
          <li className="grow"><div><p className="grow-title">Question activity</p><p className="grow-sub">Whether a question was shown, answered, skipped, or paused, which one, and how long it took. It’s linked to a random ID on your phone, not your name or email.</p></div></li>
          <li className="grow"><div><p className="grow-title">Page visits</p><p className="grow-sub">Through Google Analytics, when it’s turned on.</p></div></li>
        </ul>
        <h2>What stays on your phone</h2>
        <p>The app you chose, how often, whether you paused, and which questions you’ve seen. If you’re not signed in, your practice history stays here too.</p>
        <h2>Deleting your data</h2>
        <p>Ask us and we’ll delete your account, your practice history, and any waitlist email tied to you. Deleting an account removes its saved progress with it.</p>
      </div>
    </Shell>
  );
}
