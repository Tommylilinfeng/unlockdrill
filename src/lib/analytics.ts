/**
 * Google Analytics 4 via gtag, loaded only when VITE_GA_ID is set.
 * Also captures UTM parameters once per session so signups can report where a visitor came from.
 */
declare global { interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void } }

const GA_ID: string = import.meta.env.VITE_GA_ID ?? '';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

let initialized = false;

export function initAnalytics(): void {
  captureUtm();
  if (!GA_ID || initialized) return;
  initialized = true;
  if (window.gtag) return; // tag already in the HTML (vite.config.ts)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  // send_page_view false: we send page views on route change so SPA navigation is counted.
  window.gtag('config', GA_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
}

export function pageview(path: string): void {
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
}

export function track(name: string, params: Record<string, string | number | boolean | undefined> = {}): void {
  window.gtag?.('event', name, params);
  if (import.meta.env.DEV) console.debug('[track]', name, params);
}

function captureUtm(): void {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Utm = {};
    for (const k of UTM_KEYS) { const v = q.get(k); if (v) found[k] = v.toLowerCase(); }
    if (Object.keys(found).length) sessionStorage.setItem('unlockdrill.utm', JSON.stringify(found));
  } catch { /* ignore */ }
}

export function getUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem('unlockdrill.utm') ?? '{}') as Utm; } catch { return {}; }
}

export function hasAnalytics(): boolean { return Boolean(GA_ID); }
