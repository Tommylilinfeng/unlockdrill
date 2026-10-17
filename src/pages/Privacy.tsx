import { Shell } from '../components/Shell';
import { useTitle } from '../lib/useTitle';

export default function Privacy() {
  useTitle('Privacy · UnlockDrill');
  return (
    <Shell>
      <section className="hero"><div className="container stack" style={{ maxWidth: 720 }}>
        <h1>Privacy</h1>
        <p>UnlockDrill is a student project built in Columbia University's Startup Studio course. This page says plainly what we collect.</p>
        <h3>Who may use it</h3>
        <p>UnlockDrill is for adults 18 and over. We do not knowingly collect information from anyone under 18. If you are under 18, please do not sign up or use the question flow.</p>
        <h3>What we collect</h3>
        <ul>
          <li><strong>Email signups:</strong> your email, the page you signed up on, and where the visit came from (UTM parameters and referrer). Used only to send you one message when the product is ready.</li>
          <li><strong>Practice events:</strong> whether a question was shown, answered, skipped, or paused, which question, and how long it took. These are tied to a random device id, not to your name or email.</li>
          <li><strong>Analytics:</strong> page views through Google Analytics, when it is enabled.</li>
        </ul>
        <h3>What stays on your phone</h3>
        <p>Your chosen app, frequency, pause state, and which questions you have seen are stored in your browser on your device only.</p>
        <h3>Contact</h3>
        <p style={{ margin: 0 }}>Questions or deletion requests: email the team at the address in the course repository.</p>
      </div></section>
    </Shell>
  );
}
