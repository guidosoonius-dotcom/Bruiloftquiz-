export function TimerRing({
  secondsLeft,
  totalSeconds,
  size = 64,
}: {
  secondsLeft: number;
  totalSeconds: number;
  /** Diameter in pixels — groter voor het beamerscherm */
  size?: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const offset = circumference * (1 - fraction);
  const urgent = secondsLeft <= 5;

  return (
    <div className="relative shrink-0" style={{ height: size, width: size }}>
      <svg viewBox="0 0 60 60" className="-rotate-90" style={{ height: size, width: size }}>
        <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--lavender)" strokeWidth="6" />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={urgent ? "var(--blush-deep)" : "var(--lavender-deep)"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-semibold text-ink"
        style={{ fontSize: size * 0.28 }}
      >
        {Math.max(0, Math.ceil(secondsLeft))}
      </span>
    </div>
  );
}
