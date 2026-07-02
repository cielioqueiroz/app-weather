export type SkyCondition =
  | 'clear-day'
  | 'clear-night'
  | 'clouds-day'
  | 'clouds-night'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'mist';

/**
 * Mapeia a condição do OpenWeatherMap (main + ícone d/n) para o
 * tema visual do painel-céu.
 */
export function skyFromWeather(main: string, icon: string): SkyCondition {
  const isNight = icon.endsWith('n');
  switch (main.toLowerCase()) {
    case 'clear':
      return isNight ? 'clear-night' : 'clear-day';
    case 'clouds':
      return isNight ? 'clouds-night' : 'clouds-day';
    case 'rain':
    case 'drizzle':
      return 'rain';
    case 'thunderstorm':
      return 'thunder';
    case 'snow':
      return 'snow';
    default:
      return 'mist';
  }
}
