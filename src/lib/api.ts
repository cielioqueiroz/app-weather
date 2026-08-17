import type {
  AirQuality,
  CitySuggestion,
  CurrentWeather,
  DailySummary,
  ForecastEntry,
  ForecastResponse,
  LocationInfo,
  Reading,
  WeatherBundle,
} from '../types/weather';
import { aqiLabel, localDateKey, localHour, msToKmh, weekdayFromDateKey } from './format';

const OW_PROXY = '/api/ow';
// Chamado direto do navegador, não pelo proxy — ver ADR-0004.
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const COMMON = 'units=metric&lang=pt_br';

const ABSENT = { state: 'absent' } as const;
const UNAVAILABLE = { state: 'unavailable' } as const;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Cidade não encontrada' : 'Erro ao consultar o serviço de clima');
  }
  return response.json() as Promise<T>;
}

export async function fetchCurrentByCity(city: string, country = ''): Promise<CurrentWeather> {
  const query = country ? `${city},${country}` : city;
  try {
    return await fetchJson<CurrentWeather>(
      `${OW_PROXY}?endpoint=weather&q=${encodeURIComponent(query)}&${COMMON}`,
    );
  } catch (error) {
    // Consulta com país pode falhar por divergência de grafia; tenta só a cidade.
    if (country) return fetchCurrentByCity(city);
    throw error;
  }
}

export function fetchCurrentByCoords(lat: number, lon: number): Promise<CurrentWeather> {
  return fetchJson<CurrentWeather>(`${OW_PROXY}?endpoint=weather&lat=${lat}&lon=${lon}&${COMMON}`);
}

async function fetchForecast(lat: number, lon: number): Promise<Reading<ForecastEntry[]>> {
  try {
    const data = await fetchJson<ForecastResponse>(
      `${OW_PROXY}?endpoint=forecast&lat=${lat}&lon=${lon}&${COMMON}&cnt=40`,
    );
    const list = data.list ?? [];
    return list.length > 0 ? { state: 'ok', value: list } : ABSENT;
  } catch {
    return UNAVAILABLE;
  }
}

async function fetchUvIndex(lat: number, lon: number): Promise<Reading<number>> {
  try {
    const data = await fetchJson<{ value?: number }>(`${OW_PROXY}?endpoint=uvi&lat=${lat}&lon=${lon}`);
    return typeof data.value === 'number' ? { state: 'ok', value: data.value } : ABSENT;
  } catch {
    return UNAVAILABLE;
  }
}

async function fetchAirQuality(lat: number, lon: number): Promise<Reading<AirQuality>> {
  try {
    const data = await fetchJson<{ list?: { main?: { aqi?: number } }[] }>(
      `${OW_PROXY}?endpoint=air_pollution&lat=${lat}&lon=${lon}`,
    );
    const aqi = data.list?.[0]?.main?.aqi;
    return aqi ? { state: 'ok', value: { value: aqi, label: aqiLabel(aqi) } } : ABSENT;
  } catch {
    return UNAVAILABLE;
  }
}

async function fetchLocationInfo(lat: number, lon: number): Promise<LocationInfo | null> {
  try {
    const data = await fetchJson<{ address?: Record<string, string> }>(
      `${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt-BR`,
    );
    const address = data.address ?? {};
    return {
      city: address.city || address.town || address.village || '',
      state: address.state || address.county || '',
      country: address.country || '',
    };
  } catch {
    return null;
  }
}

interface NominatimPlace {
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
}

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  try {
    const data = await fetchJson<NominatimPlace[]>(
      `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8&accept-language=pt-BR`,
    );
    return data
      .map((place) => {
        const address = place.address ?? {};
        return {
          name: address.city || address.town || address.village || place.name || '',
          state: address.state || '',
          country: address.country || '',
          displayName: place.display_name ?? '',
        };
      })
      .filter((place) => place.name && place.country);
  } catch {
    return [];
  }
}

/** Agrupa a previsão de 3 em 3 horas em resumos diários no fuso local da cidade. */
export function buildDailySummaries(entries: ForecastEntry[], tzOffset: number): DailySummary[] {
  const byDay = new Map<string, ForecastEntry[]>();
  for (const entry of entries) {
    const key = localDateKey(entry.dt, tzOffset);
    const bucket = byDay.get(key);
    if (bucket) bucket.push(entry);
    else byDay.set(key, [entry]);
  }

  const days: DailySummary[] = [];
  for (const [dateKey, dayEntries] of byDay) {
    const temps = dayEntries.map((e) => e.main.temp);
    const midday = dayEntries.reduce((closest, entry) =>
      Math.abs(localHour(entry.dt, tzOffset) - 12) < Math.abs(localHour(closest.dt, tzOffset) - 12)
        ? entry
        : closest,
    );
    days.push({
      dateKey,
      dayName: weekdayFromDateKey(dateKey),
      weatherMain: midday.weather[0].main,
      weatherIcon: midday.weather[0].icon,
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      rainProb: Math.round(Math.max(...dayEntries.map((e) => e.pop ?? 0)) * 100),
      windSpeedKmh: msToKmh(midday.wind.speed),
      windDeg: midday.wind.deg,
    });
  }
  return days;
}

/** Busca todos os dados complementares a partir do clima atual. */
export async function fetchWeatherBundle(current: CurrentWeather): Promise<WeatherBundle> {
  const { lat, lon } = current.coord;
  const [hourly, uvIndex, airQuality, location] = await Promise.all([
    fetchForecast(lat, lon),
    fetchUvIndex(lat, lon),
    fetchAirQuality(lat, lon),
    fetchLocationInfo(lat, lon),
  ]);

  return {
    current,
    location,
    hourly,
    daily: buildDailySummaries(hourly.state === 'ok' ? hourly.value : [], current.timezone),
    uvIndex,
    airQuality,
  };
}
