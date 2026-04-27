export function parseLocalDateTime(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function parseLocalString(str: unknown): Date | null {
  if (!str || typeof str !== 'string') return null;
  const [datePart, timePart = '00:00'] = str.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

export function parseAnyTime(value: unknown): number {
  if (value == null) return NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (!text) return NaN;
  const nativeParsed = Date.parse(text);
  if (Number.isFinite(nativeParsed)) return nativeParsed;
  const local = parseLocalString(text);
  return local ? local.getTime() : NaN;
}

export function formatDateTimeLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function formatDateOnlyLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function formatTimeOnlyLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function addMinutesToLocalString(str: string, minutes: number): string {
  const d = parseLocalString(str);
  if (!d) return str;
  d.setMinutes(d.getMinutes() + minutes);
  return formatDateTimeLocal(d).slice(0, 16);
}

export function combineLocalDateAndTime(dateStr: string, timeStr: string): string {
  const safeTime = String(timeStr || '00:00').slice(0, 5);
  return `${dateStr}T${safeTime}`;
}

export function ceilDateToStep(date: Date, stepMinutes: number): Date {
  const d = new Date(date.getTime());
  d.setSeconds(0, 0);
  const mins = d.getHours() * 60 + d.getMinutes();
  const rounded = Math.ceil(mins / stepMinutes) * stepMinutes;
  d.setHours(0, 0, 0, 0);
  d.setMinutes(rounded);
  return d;
}

export function roundUpDateToStep(date: Date, stepMinutes: number): Date {
  const d = new Date(date.getTime());
  d.setSeconds(0, 0);
  const mins = d.getHours() * 60 + d.getMinutes();
  const rounded = Math.ceil(mins / stepMinutes) * stepMinutes;
  d.setHours(0, 0, 0, 0);
  d.setMinutes(rounded);
  return d;
}

export function formatShortDateTime(str: unknown): string {
  const d = parseLocalString(str as string);
  if (!d) return String(str ?? '');
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatShortTime(str: unknown): string {
  const d = parseLocalString(str as string);
  if (!d) return String(str ?? '');
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatWeatherDateTime(str: unknown): string {
  const d = parseLocalString(str as string);
  if (!d) return String(str ?? '');
  return d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatWeekdayTime(str: unknown): string {
  const d = parseLocalString(str as string);
  if (!d) return String(str ?? '');
  const weekday = d.toLocaleDateString([], { weekday: 'short' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${weekday} ${time}`;
}
