import type { ExamKey } from '../config/exam';

export interface Choice { key: string; text: string }
export interface Question {
  id: string;
  exam: ExamKey;
  section: string;
  topic: string;
  prompt: string;
  choices: Choice[];
  answer: string;
  explanation: string;
}

const banks = import.meta.glob<{ default: Question[] }>('../content/questions.*.json', { eager: true });

export function loadBank(exam: ExamKey): Question[] {
  const entry = Object.entries(banks).find(([path]) => path.endsWith(`questions.${exam}.json`));
  return entry ? entry[1].default : [];
}

/** Next unseen question; when everything has been seen, start over with the least recent. */
export function nextQuestion(bank: Question[], seen: string[], preferId?: string | null): Question | null {
  if (!bank.length) return null;
  if (preferId) { const q = bank.find(x => x.id === preferId); if (q) return q; }
  const unseen = bank.filter(q => !seen.includes(q.id));
  const pool = unseen.length ? unseen : bank;
  if (!unseen.length) {
    // all seen: pick the one seen longest ago
    const oldest = seen.find(id => bank.some(q => q.id === id));
    const q = bank.find(x => x.id === oldest);
    if (q) return q;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function rememberSeen(seen: string[], id: string, cap = 200): string[] {
  const next = [...seen.filter(x => x !== id), id];
  return next.length > cap ? next.slice(next.length - cap) : next;
}
