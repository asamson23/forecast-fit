import type { BestWindowCandidate, BestWindowCluster } from './bestWindowTypes';

export function clusterWindows(candidates: BestWindowCandidate[], maxWindows = 6): BestWindowCluster[] {
  return [...candidates]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxWindows)
    .map((candidate) => ({
      candidates: [candidate],
      best: candidate,
      startTime: candidate.startTime,
      endTime: candidate.endTime,
    }));
}
