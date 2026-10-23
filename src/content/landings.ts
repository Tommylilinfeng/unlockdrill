import { EXAM } from '../config/exam';

/**
 * One landing page per value prop. Quotes are verbatim from the HW3 interviews (by ID, no names)
 * and the HW4 Reddit scan; see docs/brand_position.md. Claims stay within what the MVP does.
 */
export interface Landing {
  slug: string;
  persona: string;
  /** Plain sentence: who this page is for. Shown above the headline. */
  forWho: string;
  /** What the visitor would say about themselves; used on the homepage chooser. */
  selfDescription: string;
  valueProp: string;
  headline: string;
  lead: string;
  quote: { text: string; source: string };
  points: { title: string; body: string }[];
  objection: { q: string; a: string };
}

export const LANDINGS: Landing[] = [
  {
    slug: 'scrollers',
    persona: 'Maya, the tired starter',
    forWho: `For people studying for the ${EXAM.label} who keep meaning to start.`,
    selfDescription: 'I sit down to study and end up on Instagram.',
    valueProp: 'A smaller first step',
    headline: 'Start with one question. That’s the whole ask.',
    lead: `When you open Instagram, TikTok, or YouTube, one ${EXAM.itemNoun} shows up first. Answer it in under a minute and you’re back in the app. You don’t have to find the energy for a study session. Just one question.`,
    quote: { text: 'The hardest part is just sitting down to start. Once I pick up my phone, hours are gone.', source: 'A student we interviewed' },
    points: [
      { title: 'It shows up where you already are', body: 'You choose the app. The question appears the moment you open it, so there’s no separate app to remember.' },
      { title: 'It ends', body: 'One question and a short explanation. No streaks, no next lesson, no feed.' },
      { title: 'Small is the point', body: 'One student told us a couple of questions at a time felt doable when a full session didn’t. We built around that.' },
    ],
    objection: { q: 'Won’t this just make my attention span worse?', a: 'It’s one question with a clear end, then you’re back where you were. There’s nothing in UnlockDrill to keep scrolling through.' },
  },
  {
    slug: 'blocker-skeptics',
    persona: 'Jordan, the blocker skeptic',
    forWho: 'For people who turned off Screen Time, or never turned it on.',
    selfDescription: 'I’ve tried app limits. I just hit Ignore.',
    valueProp: 'Control, not a lock',
    headline: 'It doesn’t lock anything. You can always skip.',
    lead: 'App blockers lose the moment you tap Ignore Limit. UnlockDrill asks one question instead, and the skip button is always on screen. We’d rather you answer because you chose to.',
    quote: { text: 'Screen Time doesn’t do anything for me. I just tap ignore and keep scrolling.', source: 'A student we interviewed' },
    points: [
      { title: 'You set how often', body: 'Every time, every third open, once an hour, or once a day. Change it whenever you want.' },
      { title: 'Skip and pause are always there', body: 'Need to check one message? Skip. Bad day? Pause for an hour or until tomorrow.' },
      { title: 'Wrong answers cost nothing', body: 'You see why, then you go back to the app. Your phone never depends on getting it right.' },
    ],
    objection: { q: 'What stops me from skipping every time?', a: 'Nothing. That’s the experiment: we think a small question you’re free to skip gets answered more often than a lock gets obeyed. We’re measuring it.' },
  },
  {
    slug: 'reviewers',
    persona: 'Casey, the purposeful reviewer',
    forWho: `For people already practicing for the ${EXAM.label} who keep making the same mistakes.`,
    selfDescription: 'I practice, but I keep missing the same kind of question.',
    valueProp: 'Know why you got it wrong',
    headline: 'Every question tells you why.',
    lead: 'An answer key tells you it was B. It doesn’t tell you why you picked C. Every UnlockDrill question ends with a short explanation of the method, short enough to read before you’re back in the app.',
    quote: { text: 'I make myself stop and do the problem and read the comments.', source: 'From r/Sat' },
    points: [
      { title: 'The method, not just the letter', body: 'Explanations show the step you’d use on test day, in a sentence or two.' },
      { title: 'You can see the topic', body: 'Each question is labeled with its section and topic, so you can tell what keeps tripping you up.' },
      { title: 'Next: a mistake log', body: 'We’re adding a one-tap note on why you missed it: careless, concept, or time. It’s optional.' },
    ],
    objection: { q: 'Sometimes I remember the answer without understanding it.', a: 'Same here. That’s why the explanation shows the method, and why we plan to bring back similar questions rather than the same one.' },
  },
];

export function findLanding(slug: string | undefined): Landing | undefined {
  return LANDINGS.find(l => l.slug === slug);
}
