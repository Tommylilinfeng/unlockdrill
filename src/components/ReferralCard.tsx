import { useState } from 'react';
import { SITE_URL } from '../config/exam';
import { referralCode } from '../lib/progress';
import { track } from '../lib/analytics';

/** Invite link. Preview only: the link carries ?ref=, but nothing counts referrals yet. */
export function ReferralCard() {
  const [code] = useState(referralCode);
  const [copied, setCopied] = useState(false);
  const link = `${SITE_URL || window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, '')}/?ref=${code}`;

  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); track('referral_copied', {}); }
    catch { setCopied(false); }
  }

  return (
    <section className="gsection" aria-labelledby="invite-title">
      <h2 id="invite-title" className="gtitle">Invite a friend</h2>
      <div className="group">
        <div className="grow stack">
          <p>When they sign up with your link, both of you get early access.</p>
          <div className="copy-row">
            <input readOnly value={link} aria-label="Your invite link" onFocus={e => e.currentTarget.select()} />
            <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
          </div>
        </div>
      </div>
      <p className="gfoot" aria-live="polite">{copied ? 'Link copied. ' : ''}Preview: the link works, but referrals aren’t counted yet.</p>
    </section>
  );
}
