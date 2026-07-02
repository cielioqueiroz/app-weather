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
  location: LocationInfo | null;
  hourly: ForecastEntry[];
  daily: DailySummary[];
  uvIndex: number | null;
  airQuality: AirQuality | null;
}
