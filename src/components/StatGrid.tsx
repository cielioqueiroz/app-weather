import { aqiTone, msToKmh, uvSeverity, windDirectionLabel } from '../lib/format';
import type { AirQuality, CurrentWeather, ForecastEntry, Reading } from '../types/weather';
import {
  DropIcon,
  EyeIcon,
  GaugeIcon,
  LeafIcon,
  RainIcon,
  SunIcon,
  ThermometerIcon,
  WindIcon,
} from './icons';

interface StatGridProps {
  current: CurrentWeather;
  hourly: Reading<ForecastEntry[]>;
  uvIndex: Reading<number>;
  airQuality: Reading<AirQuality>;
}

interface Stat {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone?: 'low' | 'mid' | 'high';
  state?: 'absent' | 'unavailable';
}

/** Por que este indicador está sem valor — o usuário não deveria ter que adivinhar. */
const MISSING_DETAIL = {
  absent: 'não informado',
  unavailable: 'indisponível',
} as const;

export function StatGrid({ current, hourly, uvIndex, airQuality }: StatGridProps) {
  const rainProb: Reading<number> =
    hourly.state !== 'ok'
      ? hourly
      : hourly.value.length > 0
        ? { state: 'ok', value: Math.round((hourly.value[0].pop ?? 0) * 100) }
        : { state: 'absent' };
  const uv = uvIndex.state === 'ok' ? uvSeverity(uvIndex.value) : null;

  const stats: Stat[] = [
    {
      id: 'feels',
      icon: <ThermometerIcon />,
      label: 'Sensação',
      value: `${Math.round(current.main.feels_like)}°C`,
    },
    {
      id: 'humidity',
      icon: <DropIcon />,
      label: 'Umidade',
      value: `${current.main.humidity}%`,
    },
    {
      id: 'wind',
      icon: <WindIcon />,
      label: 'Vento',
      value: `${msToKmh(current.wind.speed)} km/h`,
      detail: windDirectionLabel(current.wind.deg),
    },
    {
      id: 'rain',
      icon: <RainIcon />,
      label: 'Chuva',
      value: rainProb.state === 'ok' ? `${rainProb.value}%` : '--',
      detail: rainProb.state === 'ok' ? undefined : MISSING_DETAIL[rainProb.state],
      state: rainProb.state === 'ok' ? undefined : rainProb.state,
    },
    {
      id: 'uv',
      icon: <SunIcon />,
      label: 'Índice UV',
      value: uvIndex.state === 'ok' ? uvIndex.value.toFixed(1) : '--',
      detail: uvIndex.state === 'ok' ? uv?.label : MISSING_DETAIL[uvIndex.state],
      tone: uv?.tone,
      state: uvIndex.state === 'ok' ? undefined : uvIndex.state,
    },
    {
      id: 'air',
      icon: <LeafIcon />,
      label: 'Qualidade do ar',
      value: airQuality.state === 'ok' ? airQuality.value.label : '--',
      detail: airQuality.state === 'ok' ? undefined : MISSING_DETAIL[airQuality.state],
      tone: airQuality.state === 'ok' ? aqiTone(airQuality.value.value) : undefined,
      state: airQuality.state === 'ok' ? undefined : airQuality.state,
    },
    {
      id: 'visibility',
      icon: <EyeIcon />,
      label: 'Visibilidade',
      value: `${(current.visibility / 1000).toFixed(1)} km`,
    },
    {
      id: 'pressure',
      icon: <GaugeIcon />,
      label: 'Pressão',
      value: `${current.main.pressure} hPa`,
    },
  ];

  return (
    <section className="stats" aria-label="Detalhes do clima">
      {stats.map((stat) => (
        <article key={stat.id} className="stat" data-tone={stat.tone} data-state={stat.state}>
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">
            {stat.value}
            {stat.detail && <span className="stat-detail">{stat.detail}</span>}
          </span>
        </article>
      ))}
    </section>
  );
}
