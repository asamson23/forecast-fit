export type LeafletMapHandle = unknown;

export function hasLeafletRuntime(): boolean {
  return Boolean((window as unknown as { L?: unknown }).L);
}
