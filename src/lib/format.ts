const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const WIND_DIRECTIONS = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];

/** Formata um timestamp UTC (segundos) como HH:mm no fuso da cidade. */
export function formatLocalTime(dtSeconds: number, tzOffsetSeconds: number): string {
  const d = new Date((dtSeconds + tzOffsetSeconds) * 1000);
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Chave yyyy-MM-dd da data local da cidade. */
export function localDateKey(dtSeconds: number, tzOffsetSeconds: number): string {
  return new Date((dtSeconds + tzOffsetSeconds) * 1000).toISOString().slice(0, 10);
}

export function localHour(dtSeconds: number, tzOffsetSeconds: number): number {
  return new Date((dtSeconds + tzOffsetSeconds) * 1000).getUTCHours();
}

export function weekdayFromDateKey(dateKey: string): string {
  return WEEKDAYS_PT[new Date(`${dateKey}T00:00:00Z`).getUTCDay()];
}

export function shortDateFromDateKey(dateKey: string): string {
  const [, month, day] = dateKey.split('-');
  return `${day}/${month}`;
}

export function windDirectionLabel(degrees: number): string {
  return WIND_DIRECTIONS[Math.round(degrees / 45) % 8];
}

export function msToKmh(speedMs: number): number {
  return Math.round(speedMs * 3.6 * 10) / 10;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function uvSeverity(uv: number): { label: string; tone: 'low' | 'mid' | 'high' } {
  if (uv < 3) return { label: 'Baixo', tone: 'low' };
  if (uv < 6) return { label: 'Moderado', tone: 'mid' };
  if (uv < 8) return { label: 'Alto', tone: 'high' };
  return { label: 'Muito alto', tone: 'high' };
}

export function aqiLabel(aqi: number): string {
  const labels = ['', 'Boa', 'Razoável', 'Moderada', 'Ruim', 'Péssima'];
  return labels[aqi] ?? '--';
}

export function aqiTone(aqi: number): 'low' | 'mid' | 'high' {
  if (aqi <= 2) return 'low';
  if (aqi === 3) return 'mid';
  return 'high';
}
