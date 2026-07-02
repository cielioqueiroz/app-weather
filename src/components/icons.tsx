interface IconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 18, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </Svg>
);

export const LocationIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.1A8.2 8.2 0 0 1 9.9 4 8.2 8.2 0 1 0 20 14.1Z" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.4" />
    <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
  </Svg>
);

export const ThermometerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z" />
  </Svg>
);

export const DropIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z" />
  </Svg>
);

export const WindIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </Svg>
);

export const RainIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 14.5a4.5 4.5 0 0 1 .5-8.97A6 6 0 0 1 19.1 7.1 3.9 3.9 0 0 1 18.6 14.5Z" />
    <path d="M8.5 17.2 7.5 20M12.7 17.2l-1 2.8M16.9 17.2l-1 2.8" />
  </Svg>
);

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 20c0-9 5-15 14-15 0 9-5 14-11.5 14A7.7 7.7 0 0 1 5 20Z" />
    <path d="M5 20c2-5 5-8.5 9-11" />
  </Svg>
);

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </Svg>
);

export const GaugeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 19a9 9 0 1 1 15 0" />
    <path d="m12 13 3.5-4.5" />
  </Svg>
);

export const SunriseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 9V3m0 0L9.5 5.5M12 3l2.5 2.5M4 15a8 8 0 0 1 16 0M2 19h20" />
  </Svg>
);

export const SunsetIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v6m0 0L9.5 6.5M12 9l2.5-2.5M4 15a8 8 0 0 1 16 0M2 19h20" />
  </Svg>
);
