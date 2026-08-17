import { useEffect } from 'react';
import { Forecast } from './components/Forecast';
import { SearchBar } from './components/SearchBar';
import { SkyPanel } from './components/SkyPanel';
import { StatGrid } from './components/StatGrid';
import { MoonIcon, SunIcon } from './components/icons';
import { useTheme } from './hooks/useTheme';
import { useWeather } from './hooks/useWeather';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { status, bundle, error, searchCity, searchCoords, dismissError } = useWeather();

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(dismissError, 5000);
    return () => clearTimeout(timer);
  }, [error, dismissError]);

  function useMyLocation() {
    navigator.geolocation?.getCurrentPosition(
      (position) => searchCoords(position.coords.latitude, position.coords.longitude),
      () => undefined,
      { timeout: 10000 },
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="brand">
          Clima<span className="brand-dot">·</span>Tempo
        </h1>
        <SearchBar onSearchCity={searchCity} onUseLocation={useMyLocation} />
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
          aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {error && (
        <div className="toast" role="alert">
          {error}
          <button type="button" className="toast-close" onClick={dismissError} aria-label="Fechar aviso">
            ×
          </button>
        </div>
      )}

      <main className="content">
        {status === 'loading' && !bundle && <Loader />}

        {status === 'idle' && !bundle && (
          <div className="empty">
            <p className="empty-title">Qual é o céu de hoje?</p>
            <p className="empty-hint">Busque uma cidade ou use sua localização para começar.</p>
          </div>
        )}

        {bundle && (
          <div className={`weather ${status === 'loading' ? 'weather-refreshing' : ''}`}>
            <SkyPanel
              current={bundle.current}
              location={bundle.location}
              today={bundle.daily[0] ?? null}
            />
            <StatGrid
              current={bundle.current}
              hourly={bundle.hourly}
              uvIndex={bundle.uvIndex}
              airQuality={bundle.airQuality}
            />
            <Forecast hourly={bundle.hourly} daily={bundle.daily} tzOffset={bundle.current.timezone} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Clima Tempo · Dados de{' '}
          <a href="https://openweathermap.org" target="_blank" rel="noreferrer">
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-sun" aria-hidden="true" />
      <span className="loader-cloud" aria-hidden="true" />
      <p className="loader-text">Consultando o céu…</p>
    </div>
  );
}
