export { getUvCategory } from '../../data/uvScale';

export function formatUvValue(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'UV -';
  return `UV ${Math.round(Number(value))}`;
}
