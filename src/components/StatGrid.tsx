import { aqiTone, msToKmh, uvSeverity, windDirectionLabel } from '../lib/format';
import type { AirQuality, CurrentWeather, ForecastEntry } from '../types/weather';
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
  nextHours: ForecastEntry[];
  uvIndex: number | null;
  airQuality: AirQuality | null;
}

interface Stat {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone?: 'low' | 'mid' | 'high';
}

export function StatGrid({ current, nextHours, uvIndex, airQuality }: StatGridProps) {
  const rainProb = nextHours.length > 0 ? Math.round((nextHours[0].pop ?? 0) * 100) : null;
  const uv = uvIndex !== null ? uvSeverity(uvIndex) : null;

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
      value: rainProb !== null ? `${rainProb}%` : '--',
    },
    {
      id: 'uv',
      icon: <SunIcon />,
      label: 'Índice UV',
      value: uvIndex !== null ? uvIndex.toFixed(1) : '--',
      detail: uv?.label,
      tone: uv?.tone,
    },
    {
      id: 'air',
      icon: <LeafIcon />,
      label: 'Qualidade do ar',
      value: airQuality ? airQuality.label : '--',
      tone: airQuality ? aqiTone(airQuality.value) : undefined,
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
        <article key={stat.id} className="stat" data-tone={stat.tone}>
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
