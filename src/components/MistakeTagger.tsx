import { useState } from 'react';
import { MISTAKE_TAGS, tagMistake, type MistakeTag } from '../lib/progress';
import { track } from '../lib/analytics';

/** One optional tap after a wrong answer. Not everyone finds self-tagging useful (I06), so it never blocks moving on. */
export function MistakeTagger({ questionId }: { questionId: string }) {
  const [tag, setTag] = useState<MistakeTag | null>(null);
  function pick(t: MistakeTag) {
    const next = tag === t ? null : t;
    setTag(next);
    tagMistake(questionId, next);
    if (next) track('mistake_tagged', { tag: next, question_id: questionId });
  }
  return (
    <div className="tagger" role="group" aria-labelledby={`tag-${questionId}`}>
      <p id={`tag-${questionId}`} className="tagger-label">Why did it slip? <span>Optional, saved on this device.</span></p>
      <div className="chips">
        {MISTAKE_TAGS.map(t => (
          <button key={t.key} type="button" className="chip" aria-pressed={tag === t.key} onClick={() => pick(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
