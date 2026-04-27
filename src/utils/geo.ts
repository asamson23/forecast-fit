export function isCanadianCountryCode(countryCode: string | null | undefined): boolean {
  return String(countryCode || '').toUpperCase() === 'CA';
}
