/** Apps a user can attach UnlockDrill to. `scheme` is the iOS URL scheme we return to after a question. */
export type AppKey = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'reddit' | 'other';

export interface AppInfo { key: AppKey; label: string; scheme: string | null; web: string | null }

export const APPS: Record<AppKey, AppInfo> = {
  instagram: { key: 'instagram', label: 'Instagram', scheme: 'instagram://', web: 'https://www.instagram.com/' },
  tiktok:    { key: 'tiktok',    label: 'TikTok',    scheme: 'snssdk1233://', web: 'https://www.tiktok.com/' },
  youtube:   { key: 'youtube',   label: 'YouTube',   scheme: 'youtube://',   web: 'https://www.youtube.com/' },
  x:         { key: 'x',         label: 'X',         scheme: 'twitter://',   web: 'https://x.com/' },
  reddit:    { key: 'reddit',    label: 'Reddit',    scheme: 'reddit://',    web: 'https://www.reddit.com/' },
  other:     { key: 'other',     label: 'Another app', scheme: null, web: null },
};

export const APP_LIST: AppInfo[] = Object.values(APPS);

export function appFromParam(v: string | null): AppKey | null {
  if (!v) return null;
  return (v in APPS ? v : null) as AppKey | null;
}

/**
 * Hand control back to the chosen app. On iOS the URL scheme opens the app directly.
 * If the scheme is unknown we simply close the flow; the user swipes back.
 */
export function returnToApp(app: AppKey | null): void {
  const info = app ? APPS[app] : null;
  if (info?.scheme) {
    window.location.href = info.scheme;
    // Fallback for browsers that ignore the scheme (desktop testing).
    window.setTimeout(() => { if (info.web && document.visibilityState === 'visible') window.location.href = info.web; }, 900);
  } else {
    window.history.length > 1 ? window.history.back() : (window.location.href = import.meta.env.BASE_URL);
  }
}
