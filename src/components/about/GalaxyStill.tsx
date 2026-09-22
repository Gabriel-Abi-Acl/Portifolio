const STARS: Array<[number, number, number, number]> = [
  [48, 36, 1.1, 0.7],
  [92, 78, 0.7, 0.45],
  [140, 28, 1.3, 0.8],
  [188, 96, 0.6, 0.4],
  [246, 44, 0.9, 0.55],
  [310, 22, 1.2, 0.75],
  [372, 70, 0.6, 0.4],
  [430, 34, 1.4, 0.85],
  [492, 88, 0.7, 0.5],
  [548, 40, 1, 0.6],
  [590, 110, 0.6, 0.35],
  [36, 160, 0.8, 0.4],
  [86, 210, 1.2, 0.65],
  [150, 168, 0.5, 0.35],
  [520, 176, 0.8, 0.45],
  [574, 230, 1.1, 0.6],
  [40, 300, 0.7, 0.4],
  [110, 340, 1, 0.55],
  [200, 360, 0.6, 0.35],
  [470, 330, 1.2, 0.6],
  [560, 300, 0.7, 0.4],
  [600, 352, 1.1, 0.7],
  [250, 150, 0.8, 0.7],
  [390, 148, 0.9, 0.65],
  [280, 250, 1.1, 0.8],
  [360, 236, 1.6, 0.95],
  [330, 200, 0.7, 0.9],
  [410, 214, 1, 0.75],
  [300, 188, 0.5, 0.6],
  [220, 220, 0.8, 0.5],
  [450, 250, 0.7, 0.55],
  [180, 250, 0.6, 0.4],
  [490, 200, 0.5, 0.45],
];

type GalaxyStillProps = {
  status?: string;
};

export function GalaxyStill({ status }: GalaxyStillProps) {
  return (
    <div className="relative h-full w-full bg-[#070612]">
      {status ? <p className="sr-only">{status}</p> : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(98_64_186/0.55),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(62_224_197/0.2),transparent_42%)]"
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="galaxy-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f7f4ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#3ee0c5" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3ee0c5" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="galaxy-disk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6cff" stopOpacity="0" />
            <stop offset="35%" stopColor="#3ee0c5" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#f5f3fb" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#b9a4ff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#7c6cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform="translate(320 208) rotate(-18)">
          <ellipse cx="0" cy="0" rx="250" ry="72" fill="url(#galaxy-disk)" />
          <ellipse
            cx="0"
            cy="0"
            rx="180"
            ry="36"
            fill="#3ee0c5"
            fillOpacity="0.12"
          />
        </g>
        <circle cx="320" cy="204" r="54" fill="url(#galaxy-core)" />
        {STARS.map(([cx, cy, radius, opacity]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={radius}
            fill="#f5f3fb"
            fillOpacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
