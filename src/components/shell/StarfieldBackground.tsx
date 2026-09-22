export function StarfieldBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="starfield-gradient absolute inset-0" />
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dot-field"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.85" fill="white" fillOpacity="0.28" />
          </pattern>
          <pattern
            id="star-field"
            width="340"
            height="280"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="24" cy="36" r="1.15" fill="white" fillOpacity="0.75" />
            <circle cx="120" cy="18" r="0.7" fill="white" fillOpacity="0.4" />
            <circle cx="188" cy="92" r="1.05" fill="white" fillOpacity="0.55" />
            <circle cx="70" cy="150" r="0.6" fill="white" fillOpacity="0.35" />
            <circle cx="250" cy="40" r="0.9" fill="white" fillOpacity="0.5" />
            <circle cx="300" cy="170" r="1.2" fill="white" fillOpacity="0.45" />
            <circle cx="40" cy="230" r="0.8" fill="white" fillOpacity="0.4" />
            <circle cx="210" cy="220" r="0.55" fill="white" fillOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-field)" />
        <rect width="100%" height="100%" fill="url(#star-field)" />
      </svg>
      <div className="starfield-vignette absolute inset-0" />
    </div>
  );
}
