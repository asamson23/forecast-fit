export interface BestWindowCandidate {
  startTime: string;
  endTime: string;
  score: number;
  reasons: string[];
  disqualified?: boolean;
}

export interface BestWindowCluster {
  candidates: BestWindowCandidate[];
  best: BestWindowCandidate;
  startTime: string;
  endTime: string;
}

export interface BestWindowResult {
  candidates: BestWindowCandidate[];
  clusters: BestWindowCluster[];
  selectedStart?: string | null;
}
