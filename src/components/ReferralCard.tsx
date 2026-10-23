import { useState } from 'react';
import { SITE_URL } from '../config/exam';
import { referralCode } from '../lib/progress';
import { track } from '../lib/analytics';

/** Invite link for the waitlist. Preview only: the link carries ?ref=, but nothing counts referrals yet. */
export function ReferralCard() {
  const [code] = useState(referralCode);
  const [copied, setCopied] = useState(false);
  const link = `${SITE_URL || window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, '')}/?ref=${code}`;

  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); track('referral_copied', {}); }
    catch { setCopied(false); }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Invite a friend</h2>
      <p style={{ marginTop: 6 }}>When they join the waitlist with your link, both of you get early access.</p>
      <div className="referral-row">
        <input readOnly value={link} aria-label="Your invite link" onFocus={e => e.currentTarget.select()} />
        <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
      <p className="small quiet" style={{ marginTop: 10 }} aria-live="polite">
        {copied ? 'Link copied. ' : ''}Preview: the link works, but referrals aren’t counted yet.
      </p>
    </div>
  );
}
