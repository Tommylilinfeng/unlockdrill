import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Lockup } from './Logo';
import { ACCOUNTS } from '../lib/progress';
import { currentAccount, initials } from '../lib/account';

/** Page frame. `tone="night"` when the page opens on a night band, so the header sits on it. */
/** Round initials link to the profile ("You" when signed out). Used in the header and on the question screen. */
export function ProfileLink({ className = '' }: { className?: string }) {
  if (!ACCOUNTS) return null;
  const account = currentAccount();
  return (
    <Link to="/profile" className={`profile-link ${className}`.trim()} aria-label={account ? `Your profile (${account.name || account.email})` : 'Your profile'}>
      <span aria-hidden="true">{initials(account)}</span>
    </Link>
  );
}

export function Shell({ children, tone = 'paper' }: { children: ReactNode; tone?: 'paper' | 'night' }) {
  const account = ACCOUNTS ? currentAccount() : null;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`masthead ${tone}`}>
        <div className="wrap">
          <Lockup tone={tone === 'night' ? 'white' : 'color'} />
          <nav aria-label="Main">
            <NavLink to="/setup">Set it up</NavLink>
            {ACCOUNTS && <NavLink to="/diagnostic" className="nav-wide">Diagnostic</NavLink>}
            {ACCOUNTS && !account && <NavLink to="/signin" className="nav-wide">Sign in</NavLink>}
            {ACCOUNTS && (
              <NavLink to="/profile" className="nav-profile" aria-label={account ? `Your profile (${account.name || account.email})` : 'Your profile'}>
                <span aria-hidden="true">{initials(account)}</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="colophon night">
        <div className="wrap">
          <Lockup tone="white" />
          <p>Made by 5 PPL in Columbia’s Startup Studio. Not affiliated with the College Board or ETS. For adults 18 and over.</p>
          <p className="colophon-links"><Link to="/privacy">Privacy</Link><Link to="/settings">Your settings</Link><Link to="/setup">Set it up</Link></p>
        </div>
      </footer>
    </>
  );
}
