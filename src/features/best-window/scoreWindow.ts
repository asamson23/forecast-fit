import type { BestWindowCandidate } from './bestWindowTypes';

export function scoreWindowCandidate(candidate: BestWindowCandidate): number {
  return candidate.disqualified ? -Infinity : candidate.score;
}
