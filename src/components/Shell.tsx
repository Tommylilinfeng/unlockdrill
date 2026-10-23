import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Lockup } from './Logo';
import { PREVIEW } from '../lib/progress';
import { currentAccount, initials } from '../lib/account';

/** Page frame. `tone="night"` when the page opens on a night band, so the header sits on it. */
export function Shell({ children, tone = 'paper' }: { children: ReactNode; tone?: 'paper' | 'night' }) {
  const account = PREVIEW ? currentAccount() : null;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`masthead ${tone}`}>
        <div className="wrap">
          <Lockup tone={tone === 'night' ? 'white' : 'color'} />
          <nav aria-label="Main">
            <NavLink to="/setup">Set it up</NavLink>
            {PREVIEW && <NavLink to="/diagnostic" className="nav-wide">Diagnostic</NavLink>}
            {PREVIEW && !account && <NavLink to="/signin" className="nav-wide">Sign in</NavLink>}
            {PREVIEW && (
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
