import type { Category, VocabItem } from "./types";

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function esc(value: string | number): string {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char] ?? char;
  });
}

export function generateId(): string {
  return `${Date.now().toString()}${Math.random().toString(36).slice(2, 11)}`;
}

export function totalWords(list: Category[]): number {
  return list.reduce((sum, cat) => sum + cat.items.length, 0);
}

export function normalizeAnswer(value: string): string {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function shuffle<T>(list: readonly T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j] as T;
    result[j] = temp as T;
  }
  return result;
}

export function mistakeKey(item: VocabItem): string {
  return `${item.es}||${item.gr}`;
}

export function normalizeSpeech(value: string): string {
  return normalizeAnswer(value)
    .replace(/[¿?¡!.,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function compareSpeech(spoken: string, expected: string): number {
  const actualWords = normalizeSpeech(spoken).split(" ").filter(Boolean);
  const targetWords = normalizeSpeech(expected).split(" ").filter(Boolean);
  if (!targetWords.length) return 0;
  const matched = targetWords.filter(
    (word, index) => actualWords[index] === word || actualWords.includes(word),
  ).length;
  return Math.max(0, Math.min(100, Math.round((matched / targetWords.length) * 100)));
}

export function speechRateFromSetting(speechRate: "slow" | "normal" | "fast"): number {
  if (speechRate === "slow") return 0.62;
  if (speechRate === "fast") return 1.05;
  return 0.82;
}
