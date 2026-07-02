import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCurrentByCity, fetchCurrentByCoords, fetchWeatherBundle } from '../lib/api';
import type { WeatherBundle } from '../types/weather';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface WeatherState {
  status: Status;
  bundle: WeatherBundle | null;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ status: 'loading', bundle: null, error: null });
  const requestId = useRef(0);

  const run = useCallback(async (loader: () => Promise<WeatherBundle>) => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const bundle = await loader();
      if (id !== requestId.current) return;
      setState({ status: 'ready', bundle, error: null });
    } catch (error) {
      if (id !== requestId.current) return;
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      setState((prev) => ({ ...prev, status: prev.bundle ? 'ready' : 'error', error: message }));
    }
  }, []);

  const searchCity = useCallback(
    (city: string, country = '') =>
      run(async () => fetchWeatherBundle(await fetchCurrentByCity(city, country))),
    [run],
  );

  const searchCoords = useCallback(
    (lat: number, lon: number) =>
      run(async () => fetchWeatherBundle(await fetchCurrentByCoords(lat, lon))),
    [run],
  );

  const dismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, status: prev.bundle ? 'ready' : 'idle' }));
  }, []);

  // Na abertura, tenta a localização do usuário; sem permissão, mostra busca vazia.
  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: 'idle', bundle: null, error: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => searchCoords(position.coords.latitude, position.coords.longitude),
      () => setState({ status: 'idle', bundle: null, error: null }),
      { timeout: 10000 },
    );
  }, [searchCoords]);

  return { ...state, searchCity, searchCoords, dismissError };
}
