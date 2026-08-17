/**
 * Leitura de um indicador. Distingue "a fonte não trouxe esse dado" de
 * "não conseguimos perguntar" — os dois viravam `null` antes. Ver ADR-0003.
 */
export type Reading<T> =
  | { state: 'ok'; value: T }
  | { state: 'absent' }
  | { state: 'unavailable' };

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: { lat: number; lon: number };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  sys: { country?: string; sunrise: number; sunset: number };
  timezone: number;
  name: string;
}

export interface ForecastEntry {
  dt: number;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: { speed: number; deg: number };
  visibility: number;
  pop?: number;
}

export interface ForecastResponse {
  list: ForecastEntry[];
}

export interface DailySummary {
  dateKey: string;
  dayName: string;
  weatherMain: string;
  weatherIcon: string;
  tempMin: number;
  tempMax: number;
  rainProb: number;
  windSpeedKmh: number;
  windDeg: number;
}

export interface AirQuality {
  value: number;
  label: string;
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
}

export interface CitySuggestion {
  name: string;
  state: string;
  country: string;
  displayName: string;
}

export interface WeatherBundle {
  current: CurrentWeather;
  // `location` só embeleza o nome do lugar: sem ela, o nome vindo do clima
  // atual serve. Falha e ausência levam ao mesmo resultado, então não é Reading.
  location: LocationInfo | null;
  hourly: Reading<ForecastEntry[]>;
  daily: DailySummary[];
  uvIndex: Reading<number>;
  airQuality: Reading<AirQuality>;
}
