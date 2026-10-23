import { useEffect, useRef } from 'react';

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds .in to every .reveal inside the returned ref once it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('.reveal') ?? []);
    if (calm() || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -6% 0px' });
    items.forEach(i => io.observe(i));
    return () => io.disconnect();
  }, []);
  return ref;
}
