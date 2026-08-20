export function TimerRing({
  secondsLeft,
  totalSeconds,
}: {
  secondsLeft: number;
  totalSeconds: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const offset = circumference * (1 - fraction);
  const urgent = secondsLeft <= 5;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 60 60" className="h-16 w-16 -rotate-90">
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
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-ink">
        {Math.max(0, Math.ceil(secondsLeft))}
      </span>
    </div>
  );
}
