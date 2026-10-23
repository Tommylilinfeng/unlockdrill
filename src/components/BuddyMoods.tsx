/**
 * Drill Buddy, drawn inline so it can react. Same geometry as public/logo/mark-green.svg:
 * U-shaped forest outline, white face, graphite arc eyes and smile, three answer bubbles, gold rays.
 *
 * Rule: Buddy never looks sad or disappointed. A wrong answer gets "trick" (a knowing wink), not a frown.
 */
export type BuddyMood = 'neutral' | 'curious' | 'nice' | 'trick' | 'sleepy' | 'wave';

interface Props {
  mood?: BuddyMood;
  size?: number;
  /** Accessible name. Leave out when Buddy is decoration next to text that says the same thing. */
  label?: string;
  className?: string;
}

// Outer U and face, combined with even-odd so the face punches through without a mask id.
const BODY = 'M20 40 C20 23 43 23 44 40 H82 C83 23 106 23 106 40 V86 Q106 118 74 118 H52 Q20 118 20 86 Z';
const FACE = 'M30 47 H96 V85 Q96 108 73 108 H53 Q30 108 30 85 Z';
const RAYS = 'M103 20 L107 10 M114 27 L123 21 M116 38 L126 39';
const RAYS_LEFT = 'M23 20 L19 10 M12 27 L3 21 M10 38 L0 39';

const INK = 'var(--buddy-ink, #262B2E)';
const FOREST = 'var(--buddy-body, #21664C)';
const MINT = 'var(--buddy-bubble, #86B59B)';
const GOLD = 'var(--buddy-ray, #F5C451)';

function Face({ mood }: { mood: BuddyMood }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (mood) {
    case 'curious': // pupils down and to the right, one brow up: reading the question
      return (
        <g className="buddy-face">
          <circle cx="47" cy="65" r="4.5" fill={INK} />
          <circle cx="83" cy="65" r="4.5" fill={INK} />
          <path d="M77 54 Q82 50 88 53" {...line} strokeWidth={3} />
          <path d="M59 77 Q65 80 71 75" {...line} />
        </g>
      );
    case 'nice': // happy arcs, open smile
      return (
        <g className="buddy-face">
          <path d="M39 65 Q45 53 51 65 M75 65 Q81 53 87 65" {...line} />
          <path d="M55 72 Q63 86 71 72 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        </g>
      );
    case 'trick': // one wink, lopsided grin: "here's the trick"
      return (
        <g className="buddy-face">
          <path d="M40 65 Q45 55 50 65" {...line} />
          <path d="M76 63 Q81 67 86 63" {...line} />
          <path d="M56 75 Q64 80 71 70" {...line} />
        </g>
      );
    case 'sleepy': // eyes closed, small mouth
      return (
        <g className="buddy-face">
          <path d="M40 62 Q45 68 50 62 M76 62 Q81 68 86 62" {...line} />
          <path d="M60 77 Q63 79 66 77" {...line} />
        </g>
      );
    case 'wave':
      return (
        <g className="buddy-face">
          <path d="M40 65 Q45 55 50 65 M76 65 Q81 55 86 65" {...line} />
          <path d="M56 72 Q63 83 70 72 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        </g>
      );
    default:
      return (
        <g className="buddy-face">
          <path d="M40 65 Q45 55 50 65 M76 65 Q81 55 86 65 M57 73 Q63 80 69 73" {...line} />
        </g>
      );
  }
}

function Bubbles({ mood }: { mood: BuddyMood }) {
  const outline = { fill: 'var(--buddy-face, #FFFFFF)', stroke: MINT, strokeWidth: 3 };
  if (mood === 'nice') {
    return (
      <g className="buddy-bubbles is-filling">
        <circle cx="43" cy="93" r="8" fill={FOREST} />
        <circle cx="63" cy="93" r="8" fill={FOREST} />
        <circle cx="83" cy="93" r="8" fill={FOREST} />
      </g>
    );
  }
  if (mood === 'sleepy') {
    return (
      <g className="buddy-bubbles">
        <circle cx="43" cy="93" r="7" {...outline} />
        <circle cx="63" cy="93" r="7" {...outline} />
        <circle cx="83" cy="93" r="7" {...outline} />
      </g>
    );
  }
  if (mood === 'trick') {
    // The middle bubble lights up gold: "this is the one"
    return (
      <g className="buddy-bubbles">
        <circle cx="43" cy="93" r="7" {...outline} />
        <circle cx="63" cy="93" r="8" fill={GOLD} stroke="var(--buddy-gold-edge, #C8962A)" strokeWidth={2} />
        <circle cx="83" cy="93" r="7" {...outline} />
      </g>
    );
  }
  return (
    <g className="buddy-bubbles">
      <circle cx="43" cy="93" r="7" {...outline} />
      <circle cx="63" cy="93" r="7" {...outline} />
      <circle cx="83" cy="93" r="8" fill={FOREST} />
    </g>
  );
}

export function Buddy({ mood = 'neutral', size = 64, label, className }: Props) {
  const rays = { fill: 'none', stroke: GOLD, strokeWidth: 6, strokeLinecap: 'round' as const };
  return (
    <svg
      className={`buddy buddy-${mood}${className ? ` ${className}` : ''}`}
      width={size} height={size * (128 / 142)} viewBox="-14 0 142 128"
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {mood === 'wave' && (
        <g className="buddy-arm">
          <path d="M22 84 Q8 74 4 56" fill="none" stroke={FOREST} strokeWidth={10} strokeLinecap="round" />
          <circle cx="3" cy="50" r="8" fill={FOREST} />
        </g>
      )}
      <path d={`${BODY} ${FACE}`} fill={FOREST} fillRule="evenodd" />
      <path d={FACE} fill="var(--buddy-face, #FFFFFF)" />
      <g key={mood}>
        <Face mood={mood} />
        <Bubbles mood={mood} />
      </g>
      {mood === 'sleepy' ? (
        <g className="buddy-zz" fill="none" stroke={GOLD} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M104 14 H115 L104 25 H115" />
          <path d="M119 34 H126 L119 41 H126" />
        </g>
      ) : (
        <path d={RAYS} {...rays} />
      )}
      {mood === 'nice' && <path d={RAYS_LEFT} {...rays} className="buddy-rays-left" />}
    </svg>
  );
}
