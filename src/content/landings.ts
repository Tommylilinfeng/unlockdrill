import { EXAM } from '../config/exam';

/**
 * One landing page per value prop and audience. Copy leans on exact interview and Reddit language
 * recorded in docs/brand_position.md (IDs refer to that document). Keep claims to proposed behavior.
 */
export interface Landing {
  slug: string;
  persona: string;
  audience: string;
  valueProp: string;
  headline: string;
  subhead: string;
  cta: string;
  quote: { text: string; source: string };
  points: { title: string; body: string }[];
  objection: { q: string; a: string };
}

export const LANDINGS: Landing[] = [
  {
    slug: 'scrollers',
    persona: 'Maya, the tired starter',
    audience: `${EXAM.label} takers who meant to study and opened Instagram instead`,
    valueProp: 'A smaller first step',
    headline: `One ${EXAM.itemNoun} before you scroll.`,
    subhead: 'The hardest part is sitting down to start. UnlockDrill puts a single short question where your thumb already goes: the moment you open the app you reach for.',
    cta: 'Get early access',
    quote: { text: '“The hardest part is just sitting down to start. Once I pick up my phone, hours are gone.”', source: 'Interview I03' },
    points: [
      { title: 'It meets you at the open', body: 'You pick the app. Open it, and one question appears first. Answer it or skip it, then carry on.' },
      { title: 'One question, not a session', body: 'A real item, a one-line explanation, and a visible end. No streaks, no feed.' },
      { title: 'A start you can actually make', body: '“Doing a couple questions at a time feels easier.” That is the whole product.' },
    ],
    objection: { q: 'Will it just make my attention span worse?', a: 'That is a fair worry, and it shaped the design: one question has a clear end. There is nothing to keep scrolling.' },
  },
  {
    slug: 'blocker-skeptics',
    persona: 'Jordan, the blocker skeptic',
    audience: 'People who have tried Screen Time or an app blocker and turned it off',
    valueProp: 'Control, not a lock',
    headline: 'Skip is always on the screen.',
    subhead: 'Blockers fail the moment you hit Ignore Limit. UnlockDrill does not lock your phone. It offers one question, and you decide what happens next.',
    cta: 'Get early access',
    quote: { text: '“Screen Time doesn\'t do anything for me. I just tap ignore and keep scrolling.”', source: 'Interview I04' },
    points: [
      { title: 'You choose the app and the frequency', body: 'Every open, every third open, once an hour, or once a day. Change it any time.' },
      { title: 'Skip and pause are never hidden', body: 'Need to check something quickly? Skip. Having a bad day? Pause for an hour or the rest of the day.' },
      { title: 'A wrong answer does not cost you your phone', body: 'You see the explanation and go on. Learning, not punishment.' },
    ],
    objection: { q: 'So what stops me from skipping every time?', a: 'Nothing. We are testing whether a small, respectful offer gets taken more often than a lock gets obeyed. You will tell us.' },
  },
  {
    slug: 'reviewers',
    persona: 'Casey, the purposeful reviewer',
    audience: `${EXAM.label} takers who already practice but keep repeating the same mistakes`,
    valueProp: 'Know why you got it wrong',
    headline: 'Every question comes with the why.',
    subhead: 'Seeing the right answer is not the same as learning it. Each UnlockDrill question ends with a short explanation you can read in ten seconds.',
    cta: 'Get early access',
    quote: { text: '“I make myself stop and do the problem and read the comments.”', source: 'Reddit, r/Sat' },
    points: [
      { title: 'One explanation per question', body: 'Short, specific, and right there when you miss it. No hunting through a textbook.' },
      { title: 'Topics you can see', body: 'Each question names its section and topic, so patterns in your misses become visible.' },
      { title: 'Review on purpose, later', body: 'An error journal that groups your misses by reason is on the roadmap. Tell us if you want it.' },
    ],
    objection: { q: 'I sometimes remember the answer without understanding it.', a: 'So do we. That is why explanations show the method, not just the letter, and why repeats come back as similar questions, not the same one.' },
  },
];

export function findLanding(slug: string | undefined): Landing | undefined {
  return LANDINGS.find(l => l.slug === slug);
}
