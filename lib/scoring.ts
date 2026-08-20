const BASE_POINTS = 1000;
const MIN_POINTS = 200;

/**
 * Punten voor een correct antwoord: hoe sneller geantwoord, hoe meer punten.
 * Fout antwoord levert altijd 0 punten op.
 */
export function computePoints(
  isCorrect: boolean,
  secondsElapsed: number,
  timeLimitSeconds: number
): number {
  if (!isCorrect) return 0;
  const fraction = Math.min(Math.max(secondsElapsed / timeLimitSeconds, 0), 1);
  const points = BASE_POINTS - fraction * (BASE_POINTS - MIN_POINTS);
  return Math.round(points);
}
