type IconKind =
  | 'sun'
  | 'moon'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud'
  | 'rain'
  | 'thunder'
  | 'snow'
  | 'mist';

/** Converte o código de ícone do OpenWeatherMap (ex.: "10d") no glifo do app. */
function kindFromOwmIcon(icon: string): IconKind {
  const code = icon.slice(0, 2);
  const night = icon.endsWith('n');
  switch (code) {
    case '01':
      return night ? 'moon' : 'sun';
    case '02':
      return night ? 'cloud-moon' : 'cloud-sun';
    case '03':
    case '04':
      return 'cloud';
    case '09':
    case '10':
      return 'rain';
    case '11':
      return 'thunder';
    case '13':
      return 'snow';
    default:
      return 'mist';
  }
}

const PATHS: Record<IconKind, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
    </>
  ),
  moon: <path d="M20 14.1A8.2 8.2 0 0 1 9.9 4 8.2 8.2 0 1 0 20 14.1Z" />,
  'cloud-sun': (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M8.5 2.8V4M3.3 8h1.2M4.8 4.3l.9.9M13.1 4.3l-.9.9" />
      <path d="M9.5 20.2a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 10.3 1.4 3.4 3.4 0 0 1-.8 6.6Z" />
    </>
  ),
  'cloud-moon': (
    <>
      <path d="M13.2 6.6a4.6 4.6 0 0 1-5.5-5.4 4.6 4.6 0 1 0 5.5 5.4Z" />
      <path d="M9.5 20.2a4 4 0 0 1 .4-8 5.3 5.3 0 0 1 10.3 1.4 3.4 3.4 0 0 1-.8 6.6Z" />
    </>
  ),
  cloud: (
    <path d="M7 18.5a4.5 4.5 0 0 1 .5-8.97A6 6 0 0 1 19.1 11.1 3.9 3.9 0 0 1 18.6 18.5Z" />
  ),
  rain: (
    <>
      <path d="M7 15.5a4.5 4.5 0 0 1 .5-8.97A6 6 0 0 1 19.1 8.1 3.9 3.9 0 0 1 18.6 15.5Z" />
      <path d="M8.5 18.2 7.5 21M12.7 18.2l-1 2.8M16.9 18.2l-1 2.8" />
    </>
  ),
  thunder: (
    <>
      <path d="M7 15.5a4.5 4.5 0 0 1 .5-8.97A6 6 0 0 1 19.1 8.1 3.9 3.9 0 0 1 18.6 15.5Z" />
      <path d="m12.8 14.5-2.4 4h2.8l-1.6 3.5" />
    </>
  ),
  snow: (
    <>
      <path d="M7 15.5a4.5 4.5 0 0 1 .5-8.97A6 6 0 0 1 19.1 8.1 3.9 3.9 0 0 1 18.6 15.5Z" />
      <path d="M8.2 18.6h.01M12.1 20.6h.01M16 18.6h.01M10.1 21.4h.01M14 21.4h.01" />
    </>
  ),
  mist: (
    <path d="M4 8.5h13M6.5 12h13M4 15.5h11M8 19h9" />
  ),
};

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ icon, size = 24, className }: WeatherIconProps) {
  const kind = kindFromOwmIcon(icon);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      data-kind={kind}
      aria-hidden="true"
    >
      {PATHS[kind]}
    </svg>
  );
}
