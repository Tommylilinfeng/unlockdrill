import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Question } from '../lib/questions';
import { Buddy } from './BuddyMoods';

interface Props {
  question: Question;
  onAnswered?: (correct: boolean, msToAnswer: number) => void;
  /** Shown under the explanation once answered. */
  after?: ReactNode;
  /** Tighter sizes, for the phone on the homepage. */
  compact?: boolean;
  headingLevel?: 'h1' | 'h2' | 'p';
}

/**
 * Typographic glue for prompts: math expressions never break at an operator ("3x + 4 = 19"),
 * and one- or two-letter words ("If", "a", "of") stay with the next word instead of sitting alone on a line.
 */
function keepMathTogether(text: string): string {
  return text
    .replace(/ ([+\-−×÷=<>≤≥]) /g, ' $1 ')
    .replace(/(^|[\s(])([A-Za-z]{1,2}) (?=\S)/g, '$1$2 ');
}

export function Mark({ kind }: { kind: 'right' | 'wrong' }) {
  return (
    <svg className={`mark ${kind}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {kind === 'right'
        ? <><circle cx="12" cy="12" r="11" /><path d="M7 12.5l3.2 3.2L17 9" /></>
        : <><circle cx="12" cy="12" r="10" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" /></>}
    </svg>
  );
}

/** One question: a prompt and four large answer rows. Picking a row answers it; there is no separate submit. */
export function QuestionCard({ question, onAnswered, after, compact = false, headingLevel = 'p' }: Props) {
  // The pick is keyed to the question, so a new question starts unanswered without resetting state in an effect.
  const [pick, setPick] = useState<{ id: string; key: string } | null>(null);
  const picked = pick?.id === question.id ? pick.key : null;
  const start = useRef(0);
  const answered = picked !== null;
  const correct = picked === question.answer;
  const Prompt = headingLevel;

  useEffect(() => { start.current = performance.now(); }, [question.id]);

  function choose(key: string, at: number) {
    if (answered) return;
    setPick({ id: question.id, key });
    onAnswered?.(key === question.answer, Math.round(at - start.current));
  }

  return (
    <div className={`qc${compact ? ' compact' : ''}${answered ? ' is-answered' : ''}`}>
      <p className="qc-topic">{question.section}: {question.topic.toLowerCase()}</p>
      <Prompt className={`qc-prompt${question.prompt.length > 90 ? ' long' : ''}`}>{keepMathTogether(question.prompt)}</Prompt>
      <ul className="qc-choices" aria-label="Answer choices">
        {question.choices.map(c => {
          let state = '';
          if (answered) {
            if (c.key === question.answer) state = 'right';
            else if (c.key === picked) state = 'wrong';
            else state = 'dim';
          }
          return (
            <li key={c.key}>
              <button type="button" className={`choice ${state}`} onClick={e => choose(c.key, e.timeStamp)}
                disabled={answered} aria-pressed={picked === c.key}>
                <span className="choice-key" aria-hidden="true">{c.key}</span>
                <span className="choice-text">
                  {c.text}
                  {answered && c.key === question.answer && <span className="sr-only"> (correct answer)</span>}
                  {answered && c.key === picked && !correct && <span className="sr-only"> (your answer)</span>}
                </span>
                {state === 'right' && <Mark kind="right" />}
                {state === 'wrong' && <Mark kind="wrong" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite">
        {answered && (
          <div className="qc-after">
            <div className="qc-verdict">
              <Buddy mood={correct ? 'nice' : 'trick'} size={compact ? 44 : 56} />
              <p className={`verdict ${correct ? 'right' : 'wrong'}`}>
                <Mark kind={correct ? 'right' : 'wrong'} />
                {correct ? 'Right.' : `It’s ${question.answer}.`}
              </p>
            </div>
            <p className="qc-why">{question.explanation}</p>
            {after}
          </div>
        )}
      </div>
    </div>
  );
}
