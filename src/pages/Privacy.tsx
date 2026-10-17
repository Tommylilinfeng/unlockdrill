import { Shell } from '../components/Shell';
import { useTitle } from '../lib/useTitle';

export default function Privacy() {
  useTitle('Privacy: UnlockDrill');
  return (
    <Shell>
      <div className="wrap" style={{ paddingTop: 48, maxWidth: 760 }}>
        <h1>Privacy</h1>
        <p className="lead" style={{ marginTop: 16 }}>UnlockDrill is a student project from Columbia’s Startup Studio. Here’s exactly what it collects.</p>
        <h2 style={{ marginTop: 40, fontSize: 22 }}>Adults only</h2>
        <p style={{ marginTop: 8 }}>UnlockDrill is for people 18 and over. We don’t knowingly collect anything from anyone younger. If you’re under 18, please don’t sign up.</p>
        <h2 style={{ marginTop: 32, fontSize: 22 }}>What we collect</h2>
        <ul className="plain">
          <li><strong>Waitlist:</strong> your email, which page you signed up on, and where you came from (link tags and referrer). We use it to email you once.</li>
          <li><strong>Question activity:</strong> whether a question was shown, answered, skipped, or paused, which one, and how long it took. It’s linked to a random ID on your phone, not your name or email.</li>
          <li><strong>Page visits:</strong> through Google Analytics, when it’s turned on.</li>
        </ul>
        <h2 style={{ marginTop: 32, fontSize: 22 }}>What stays on your phone</h2>
        <p style={{ marginTop: 8 }}>The app you chose, how often, whether you paused, and which questions you’ve seen.</p>
        <h2 style={{ marginTop: 32, fontSize: 22 }}>Deleting your data</h2>
        <p style={{ marginTop: 8 }}>Reply to any email from us and we’ll delete your address and anything tied to it.</p>
      </div>
    </Shell>
  );
}
