import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Question } from '../lib/questions';

interface Props {
  question: Question;
  onAnswered?: (correct: boolean, msToAnswer: number) => void;
  /** Shown under the explanation once answered. */
  after?: ReactNode;
  /** Large prompt, for the homepage hero. */
  hero?: boolean;
  headingLevel?: 'h1' | 'h2' | 'p';
}

/** Keep short math expressions on one line: "3x + 4 = 19" should never break at an operator. */
function keepMathTogether(text: string): string {
  return text.replace(/ ([+\-−×÷=<>≤≥]) /g, '\u00a0$1\u00a0');
}

/** One question rendered as a row of answer-sheet bubbles. Picking a bubble fills it in. */
export function QuestionCard({ question, onAnswered, after, hero = false, headingLevel = 'p' }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const start = useRef(Date.now());
  const answered = picked !== null;
  const correct = picked === question.answer;
  const Prompt = headingLevel;

  useEffect(() => { setPicked(null); start.current = Date.now(); }, [question.id]);

  function choose(key: string) {
    if (answered) return;
    setPicked(key);
    onAnswered?.(key === question.answer, Date.now() - start.current);
  }

  return (
    <div>
      <p className="sheet-topic">{question.section}: {question.topic.toLowerCase()}</p>
      <Prompt className={`sheet-prompt${hero ? ' hero' : ''}`}>{keepMathTogether(question.prompt)}</Prompt>
      <ul className="bubbles" aria-label="Answer choices">
        {question.choices.map(c => {
          let state = '';
          if (answered) {
            if (c.key === question.answer) state = 'right';
            else if (c.key === picked) state = 'wrong';
            else state = 'dim';
          }
          return (
            <li key={c.key}>
              <button type="button" className={`bubble-row ${state}`} onClick={() => choose(c.key)}
                disabled={answered} aria-pressed={picked === c.key}>
                <span className="bubble" aria-hidden="true">{c.key}</span>
                <span className="text">
                  {c.text}
                  {answered && c.key === question.answer && <span className="sr-only"> (correct answer)</span>}
                  {answered && c.key === picked && !correct && <span className="sr-only"> (your answer)</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div className="verdict-wrap" aria-live="polite">
          <p className={`verdict ${correct ? 'right' : 'wrong'}`}>{correct ? 'Right.' : `It's ${question.answer}.`}</p>
          <p className="why">{question.explanation}</p>
          {after}
        </div>
      )}
    </div>
  );
}
