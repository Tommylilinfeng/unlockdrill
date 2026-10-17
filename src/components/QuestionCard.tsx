import { useEffect, useRef, useState } from 'react';
import type { Question } from '../lib/questions';

interface Props {
  question: Question;
  /** Called once when the user commits an answer. */
  onAnswered?: (correct: boolean, msToAnswer: number) => void;
  /** Rendered under the explanation after answering (e.g. "Back to Instagram"). */
  after?: React.ReactNode;
  compact?: boolean;
}

export function QuestionCard({ question, onAnswered, after, compact = false }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const start = useRef<number>(Date.now());
  const answered = picked !== null;
  const correct = picked === question.answer;

  useEffect(() => { setPicked(null); start.current = Date.now(); }, [question.id]);

  function choose(key: string) {
    if (answered) return;
    setPicked(key);
    onAnswered?.(key === question.answer, Date.now() - start.current);
  }

  return (
    <div>
      <p className="eyebrow">{question.section} · {question.topic}</p>
      <p className={compact ? 'q-prompt' : 'q-prompt'} style={compact ? { fontSize: 19 } : undefined}>{question.prompt}</p>
      <ul className="choices" role="group" aria-label="Answer choices">
        {question.choices.map(c => {
          const cls = ['choice'];
          if (answered && c.key === question.answer) cls.push('correct');
          if (answered && c.key === picked && !correct) cls.push('wrong');
          return (
            <li key={c.key}>
              <button type="button" className={cls.join(' ')} onClick={() => choose(c.key)} disabled={answered}
                aria-pressed={picked === c.key}>
                <span className="key" aria-hidden="true">{c.key}</span>
                <span>{c.text}{answered && c.key === question.answer ? ' ✓' : ''}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div aria-live="polite">
          <p className={`verdict ${correct ? 'correct' : 'wrong'}`}>{correct ? 'Correct.' : `Not quite. The answer is ${question.answer}.`}</p>
          <div className="explain"><p style={{ margin: 0 }}>{question.explanation}</p></div>
          {after}
        </div>
      )}
    </div>
  );
}
