import { skyFromWeather } from '../lib/sky';
import { capitalize, formatLocalTime } from '../lib/format';
import type { CurrentWeather, DailySummary, LocationInfo } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { SunriseIcon, SunsetIcon } from './icons';

interface SkyPanelProps {
  current: CurrentWeather;
  location: LocationInfo | null;
  today: DailySummary | null;
}

/**
 * Painel-céu: o hero do app. O gradiente e a camada ambiente
 * (estrelas, chuva, nuvens…) refletem a condição real do momento.
 */
export function SkyPanel({ current, location, today }: SkyPanelProps) {
  const condition = current.weather[0];
  const sky = skyFromWeather(condition.main, condition.icon);

  const placeName = location?.city
    ? [location.city, location.state, location.country].filter(Boolean).join(', ')
    : [current.name, current.sys.country].filter(Boolean).join(', ');

  const temp = Math.round(current.main.temp);
  const tempMin = today ? Math.min(today.tempMin, temp) : Math.round(current.main.temp_min);
  const tempMax = today ? Math.max(today.tempMax, temp) : Math.round(current.main.temp_max);

  return (
    <section className="sky" data-sky={sky} aria-label="Condições atuais">
      <div className="sky-ambient" aria-hidden="true" />
      <div className="sky-content">
        <header className="sky-header">
          <h2 className="sky-place">{placeName}</h2>
          <p className="sky-description">{capitalize(condition.description)}</p>
        </header>

        <div className="sky-main">
          <p className="sky-temp">
            {temp}
            <span className="sky-temp-unit">°C</span>
          </p>
          <WeatherIcon icon={condition.icon} size={96} className="sky-icon" />
        </div>

        <footer className="sky-footer">
          <span className="sky-minmax">
            <span className="sky-minmax-label">mín</span> {tempMin}°
            <span className="sky-minmax-sep" aria-hidden="true" />
            <span className="sky-minmax-label">máx</span> {tempMax}°
          </span>
          <span className="sky-sun">
            <SunriseIcon size={16} /> {formatLocalTime(current.sys.sunrise, current.timezone)}
            <SunsetIcon size={16} /> {formatLocalTime(current.sys.sunset, current.timezone)}
          </span>
        </footer>
      </div>
    </section>
  );
}
