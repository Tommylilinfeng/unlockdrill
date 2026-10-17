import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lockup } from './Logo';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="masthead">
        <div className="wrap">
          <Lockup />
          <nav aria-label="Main">
            <Link to="/setup">Set it up</Link>
            <a href={`${import.meta.env.BASE_URL}#waitlist`}>Waitlist</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="colophon">
        <div className="wrap">
          <p>Made by 5 PPL in Columbia's Startup Studio. Not affiliated with the College Board or ETS. For adults 18 and over.</p>
          <p><Link to="/privacy">Privacy</Link>&emsp;<Link to="/settings">Your settings</Link></p>
        </div>
      </footer>
    </>
  );
}
