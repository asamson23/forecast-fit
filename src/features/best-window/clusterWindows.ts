export interface BestWindowClusterCandidate {
  startTime: string;
  score?: number;
  valid?: boolean;
}

export interface BestWindowCluster<T extends BestWindowClusterCandidate = BestWindowClusterCandidate> {
  id?: string;
  items: T[];
  bestCandidate: T;
  representative?: T;
  start: string;
  end: string;
  score?: number;
}

function firstFinite(...values: unknown[]): number {
  for (const value of values) {
    const numberValue = Number(value);
    if (Number.isFinite(numberValue)) return numberValue;
  }
  return NaN;
}

function defaultParseTime(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return Date.parse(String(value || ''));
}

export function getBestWindowCondenseMinutes(stepMinutes: number, durationMinutes: number): number {
  const step = Math.max(5, firstFinite(stepMinutes, 15));
  const duration = Math.max(step, firstFinite(durationMinutes, step));
  return Math.max(step * 1.5, Math.min(180, Math.max(30, duration * 0.35)));
}

export function rankBestWindowCluster<T extends BestWindowClusterCandidate>(
  cluster: BestWindowCluster<T>,
  index: number,
): BestWindowCluster<T> {
  return {
    id: `window-${index}`,
    ...cluster,
    representative: cluster.bestCandidate,
    score: firstFinite(cluster.bestCandidate?.score, -Infinity),
  };
}

export function makeBestWindowClusterFromCandidate<T extends BestWindowClusterCandidate>(
  candidate: T,
  index: number,
): BestWindowCluster<T> {
  return rankBestWindowCluster(
    {
      items: [candidate],
      bestCandidate: candidate,
      start: candidate.startTime,
      end: candidate.startTime,
    },
    index,
  );
}

export function addMinimumBestWindowFallbacks<T extends BestWindowClusterCandidate>(
  selected: BestWindowCluster<T>[],
  validCandidates: T[],
  minWindows: number,
  maxWindows: number,
  stepMinutes: number,
  condenseMinutes: number,
  durationMinutes: number,
  parseTime = defaultParseTime,
): BestWindowCluster<T>[] {
  if (selected.length >= minWindows || selected.length >= maxWindows || validCandidates.length <= selected.length) return selected;
  const pickedStarts = new Set(selected.map((cluster) => cluster.representative?.startTime).filter(Boolean));
  const fallbackMinSeparation = Math.max(
    stepMinutes,
    Math.min(60, Math.max(stepMinutes, condenseMinutes * 0.35, firstFinite(durationMinutes, stepMinutes) * 0.12)),
  );
  const byScore = [...validCandidates].sort((a, b) => firstFinite(b.score, -Infinity) - firstFinite(a.score, -Infinity));

  function tryAddWithMinSeparation(minSeparation: number) {
    for (const candidate of byScore) {
      if (selected.length >= minWindows || selected.length >= maxWindows) return;
      if (pickedStarts.has(candidate.startTime)) continue;
      const candidateMs = parseTime(candidate.startTime);
      const farEnough = selected.every((existing) => {
        const existingMs = parseTime(existing.representative?.startTime);
        return !Number.isFinite(candidateMs) || !Number.isFinite(existingMs) || Math.abs(candidateMs - existingMs) / 60000 >= minSeparation;
      });
      if (!farEnough) continue;
      pickedStarts.add(candidate.startTime);
      selected.push(makeBestWindowClusterFromCandidate(candidate, selected.length));
    }
  }

  tryAddWithMinSeparation(fallbackMinSeparation);
  tryAddWithMinSeparation(stepMinutes);
  tryAddWithMinSeparation(0);
  return selected;
}

export function clusterBestWindowCandidates<T extends BestWindowClusterCandidate>(
  candidates: T[],
  stepMinutes: number,
  maxWindows = 6,
  minWindows = 3,
  durationMinutes: number,
  parseTime = defaultParseTime,
): BestWindowCluster<T>[] {
  const valid = candidates
    .filter((candidate) => candidate.valid)
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  if (!valid.length) return [];

  const bestScore = Math.max(...valid.map((candidate) => firstFinite(candidate.score, -Infinity)));
  const scoreFloor = Math.max(42, bestScore - 18);
  const condenseMinutes = getBestWindowCondenseMinutes(stepMinutes, durationMinutes);

  function buildClusters(source: T[]) {
    const clusters: BestWindowCluster<T>[] = [];
    for (const candidate of source) {
      const candidateMs = parseTime(candidate.startTime);
      const previous = clusters[clusters.length - 1];
      if (!previous) {
        clusters.push({ items: [candidate], bestCandidate: candidate, start: candidate.startTime, end: candidate.startTime });
        continue;
      }
      const lastItem = previous.items[previous.items.length - 1];
      const gapMin = Math.abs((candidateMs - parseTime(lastItem.startTime)) / 60000);
      const repGapMin = Math.abs((candidateMs - parseTime(previous.bestCandidate.startTime)) / 60000);
      const scoreDelta = Math.abs(firstFinite(candidate.score, 0) - firstFinite(previous.bestCandidate.score, 0));
      if ((gapMin <= condenseMinutes || repGapMin <= condenseMinutes) && scoreDelta <= 14) {
        previous.items.push(candidate);
        previous.end = candidate.startTime;
        if (firstFinite(candidate.score, -Infinity) > firstFinite(previous.bestCandidate.score, -Infinity)) {
          previous.bestCandidate = candidate;
        }
      } else {
        clusters.push({ items: [candidate], bestCandidate: candidate, start: candidate.startTime, end: candidate.startTime });
      }
    }
    return clusters;
  }

  const strong = valid.filter((candidate) => firstFinite(candidate.score, -Infinity) >= scoreFloor);
  let ranked = buildClusters(strong)
    .sort((a, b) => firstFinite(b.bestCandidate?.score, -Infinity) - firstFinite(a.bestCandidate?.score, -Infinity))
    .slice(0, maxWindows)
    .map(rankBestWindowCluster);

  ranked = addMinimumBestWindowFallbacks(ranked, valid, minWindows, maxWindows, stepMinutes, condenseMinutes, durationMinutes, parseTime);
  return ranked.sort((a, b) => firstFinite(b.score, -Infinity) - firstFinite(a.score, -Infinity)).slice(0, maxWindows);
}
