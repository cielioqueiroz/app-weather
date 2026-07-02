import { useState } from 'react';
import { formatLocalTime, shortDateFromDateKey } from '../lib/format';
import type { DailySummary, ForecastEntry } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { RainIcon, WindIcon } from './icons';

interface ForecastProps {
  hourly: ForecastEntry[];
  daily: DailySummary[];
  tzOffset: number;
}

export function Forecast({ hourly, daily, tzOffset }: ForecastProps) {
  const [tab, setTab] = useState<'today' | 'week'>('today');
  const nextHours = hourly.slice(0, 8);
  const nextDays = daily.slice(1, 6);

  return (
    <section className="forecast" aria-label="Previsão">
      <div className="forecast-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'today'}
          className="forecast-tab"
          onClick={() => setTab('today')}
        >
          Próximas horas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'week'}
          className="forecast-tab"
          onClick={() => setTab('week')}
        >
          Próximos dias
        </button>
      </div>

      {tab === 'today' ? (
        <ol className="hourly" aria-label="Previsão horária">
          {nextHours.map((hour) => (
            <li key={hour.dt} className="hourly-item">
              <span className="hourly-time">{formatLocalTime(hour.dt, tzOffset)}</span>
              <WeatherIcon icon={hour.weather[0].icon} size={30} className="hourly-icon" />
              <span className="hourly-temp">{Math.round(hour.main.temp)}°</span>
              <span className="hourly-pop">
                <RainIcon size={12} /> {Math.round((hour.pop ?? 0) * 100)}%
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <DailyList days={nextDays} />
      )}
    </section>
  );
}

function DailyList({ days }: { days: DailySummary[] }) {
  if (days.length === 0) {
    return <p className="forecast-empty">Sem previsão disponível para os próximos dias.</p>;
  }

  // Faixa térmica da semana para posicionar as barras de temperatura.
  const weekMin = Math.min(...days.map((d) => d.tempMin));
  const weekMax = Math.max(...days.map((d) => d.tempMax));
  const span = Math.max(weekMax - weekMin, 1);

  return (
    <ol className="daily" aria-label="Previsão diária">
      {days.map((day) => {
        const start = ((day.tempMin - weekMin) / span) * 100;
        const width = ((day.tempMax - day.tempMin) / span) * 100;
        return (
          <li key={day.dateKey} className="daily-item">
            <span className="daily-date">
              <span className="daily-weekday">{day.dayName}</span>
              <span className="daily-day">{shortDateFromDateKey(day.dateKey)}</span>
            </span>
            <WeatherIcon icon={day.weatherIcon} size={26} className="daily-icon" />
            <span className="daily-range">
              <span className="daily-min">{day.tempMin}°</span>
              <span className="daily-bar" aria-hidden="true">
                <span
                  className="daily-bar-fill"
                  style={{ left: `${start}%`, width: `${Math.max(width, 6)}%` }}
                />
              </span>
              <span className="daily-max">{day.tempMax}°</span>
            </span>
            <span className="daily-extra">
              <RainIcon size={13} /> {day.rainProb}%
            </span>
            <span className="daily-extra daily-extra-wind">
              <WindIcon size={13} /> {day.windSpeedKmh} km/h
            </span>
          </li>
        );
      })}
    </ol>
  );
}
