/** Which exam this build speaks to. Set VITE_EXAM in .env (sat | gre). Copy and the question bank follow it. */
export type ExamKey = 'sat' | 'gre';

export interface ExamCopy {
  key: ExamKey;
  label: string;
  /** Who the product is for, in one line. Adults only: the course bars collecting data from minors. */
  audience: string;
  /** Short noun for a practice item, e.g. "SAT question". */
  itemNoun: string;
  sections: string[];
}

const COPY: Record<ExamKey, ExamCopy> = {
  sat: {
    key: 'sat',
    label: 'SAT',
    audience: 'SAT takers 18 and over who keep postponing practice',
    itemNoun: 'SAT question',
    sections: ['Math', 'Reading and Writing'],
  },
  gre: {
    key: 'gre',
    label: 'GRE',
    audience: 'GRE takers who study in the gaps of a working week',
    itemNoun: 'GRE question',
    sections: ['Quantitative', 'Verbal'],
  },
};

const raw = (import.meta.env.VITE_EXAM ?? 'sat').toLowerCase();
export const EXAM: ExamCopy = COPY[(raw in COPY ? raw : 'sat') as ExamKey];
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');
