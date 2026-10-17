import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lockup } from './Logo';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Lockup />
          <nav aria-label="Primary">
            <Link to="/setup">Set up</Link>
            <Link to="/q?demo=1">Try a question</Link>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="container stack">
          <p>UnlockDrill is a student project from Columbia's Startup Studio. It is not affiliated with or endorsed by the College Board, ETS, or any test maker. Practice counts are not a promise of score improvement.</p>
          <p><Link to="/privacy">Privacy</Link> · <Link to="/settings">Your settings</Link> · For adults 18 and over.</p>
        </div>
      </footer>
    </>
  );
}
