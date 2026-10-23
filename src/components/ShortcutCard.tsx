/**
 * A Shortcuts automation drawn the way the Shortcuts app lays it out: the trigger on top, then each action
 * as its own block, with variables shown as tokens. Static picture; the caller supplies the accessible label.
 */
export interface ShortcutAction {
  icon: 'url' | 'file' | 'if' | 'stop' | 'text' | 'trash';
  title: string;
  sub?: string;
  token?: string;
  indent?: boolean;
}

const PATHS: Record<ShortcutAction['icon'], string> = {
  url: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  file: 'M7 3h7l4 4v14H7zM14 3v4h4',
  if: 'M6 4v6a4 4 0 0 0 4 4h8M14 10l4 4-4 4',
  stop: 'M7 7h10v10H7z',
  text: 'M5 6h14M12 6v13M9 19h6',
  trash: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13',
};

export function ShortcutCard({ trigger, actions, label }: { trigger: string; actions: ShortcutAction[]; label?: string }) {
  return (
    <div className="sc" role="img" aria-label={label ?? `Shortcuts automation: when ${trigger} is opened, ${actions.map(a => a.title + (a.token ? ` ${a.token}` : '')).join(', then ')}`}>
      <div className="sc-trigger">
        <span className="sc-appicon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>
        </span>
        <div>
          <p className="sc-title">When <b>{trigger}</b> is opened</p>
          <p className="sc-sub">Run Immediately</p>
        </div>
      </div>
      <ol className="sc-actions">
        {actions.map((a, i) => (
          <li key={i} className={`sc-action${a.indent ? ' indent' : ''}`}>
            <span className={`sc-icon ${a.icon}`} aria-hidden="true"><svg viewBox="0 0 24 24"><path d={PATHS[a.icon]} /></svg></span>
            <div className="sc-body">
              <p className="sc-title">{a.title}{a.token && <> <span className="sc-token">{a.token}</span></>}</p>
              {a.sub && <p className="sc-sub">{a.sub}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
