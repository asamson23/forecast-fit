export type AqiCategory = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

export interface AqiInfo {
  value: number;
  category: AqiCategory;
  className: string;
}

export function getAqiInfo(value: number | null | undefined): AqiInfo | null {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return null;
  const aqi = Math.round(Number(value));
  if (aqi <= 50)  return { value: aqi, category: 'Good',                            className: 'good' };
  if (aqi <= 100) return { value: aqi, category: 'Moderate',                        className: 'moderate' };
  if (aqi <= 150) return { value: aqi, category: 'Unhealthy for Sensitive Groups',  className: 'sensitive' };
  if (aqi <= 200) return { value: aqi, category: 'Unhealthy',                       className: 'unhealthy' };
  if (aqi <= 300) return { value: aqi, category: 'Very Unhealthy',                  className: 'very-unhealthy' };
  return           { value: aqi, category: 'Hazardous',                             className: 'hazardous' };
}
