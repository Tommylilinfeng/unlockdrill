import { useId } from 'react';
import { Link } from 'react-router-dom';

type Tone = 'color' | 'white';

/**
 * Drill Buddy, drawn inline in the geometry of public/logo/mark-*.svg so it can take the white one-color
 * version on night surfaces and a resting expression. Small sizes drop the bubbles and rays, like mark-small.svg.
 */
export function Buddy({ size = 48, tone = 'color', mood = 'smile', small = size < 48 }: {
  size?: number; tone?: Tone; mood?: 'smile' | 'rest'; small?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const outline = tone === 'white' ? '#FFFFFF' : '#21664C';
  const features = tone === 'white' ? '#FFFFFF' : '#262B2E';
  const face = 'M30 47 H96 V85 Q96 108 73 108 H53 Q30 108 30 85 Z';
  const eyes = mood === 'rest'
    ? 'M40 62 Q45 68 50 62 M76 62 Q81 68 86 62 M58 76 H68'
    : 'M40 65 Q45 55 50 65 M76 65 Q81 55 86 65 M57 73 Q63 80 69 73';
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" aria-hidden="true" focusable="false" className="buddy">
      <g transform={small ? 'translate(-11 -26) scale(1.16)' : undefined}>
        <defs>
          <mask id={`b${id}`}><rect width="128" height="128" fill="white" /><path d={face} fill="black" /></mask>
        </defs>
        <path d="M20 40 C20 23 43 23 44 40 H82 C83 23 106 23 106 40 V86 Q106 118 74 118 H52 Q20 118 20 86 Z" fill={outline} mask={`url(#b${id})`} />
        {tone === 'color' && <path d={face} fill="#FFFFFF" />}
        <path d={eyes} fill="none" stroke={features} strokeWidth={small ? 5 : 4} strokeLinecap="round" />
        {!small && (
          <>
            <g fill="none" stroke={tone === 'white' ? '#FFFFFF' : '#86B59B'} strokeWidth="3"><circle cx="43" cy="93" r="7" /><circle cx="63" cy="93" r="7" /></g>
            <circle cx="83" cy="93" r="8" fill={tone === 'white' ? '#FFFFFF' : '#21664C'} />
            {mood === 'smile' && <path d="M103 20 L107 10 M114 27 L123 21 M116 38 L126 39" fill="none" stroke={tone === 'white' ? '#FFFFFF' : '#F5C451'} strokeWidth="6" strokeLinecap="round" />}
          </>
        )}
      </g>
    </svg>
  );
}

export function Lockup({ to = '/', tone = 'color' }: { to?: string; tone?: Tone }) {
  return (
    <Link to={to} className="lockup" aria-label="UnlockDrill home">
      <Buddy size={30} tone={tone} />
      <span>UnlockDrill</span>
    </Link>
  );
}
