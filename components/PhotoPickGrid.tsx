"use client";

const TILE_STYLES = [
  "bg-mint",
  "bg-blush",
  "bg-lavender",
  "bg-amber-100",
  "bg-mint",
  "bg-blush",
];

export function PhotoPickGrid({
  tiles,
  selectedIndexes,
  correctIndexes,
  disabled,
  onToggle,
  size = "default",
}: {
  tiles: { imageUrl?: string }[];
  selectedIndexes: number[];
  /** Alleen meegeven tijdens de reveal-fase */
  correctIndexes?: number[];
  disabled: boolean;
  onToggle: (index: number) => void;
  /** "large" voor het beamerscherm */
  size?: "default" | "large";
}) {
  const revealing = correctIndexes !== undefined;
  const large = size === "large";

  return (
    <div className={large ? "grid grid-cols-3 gap-5" : "grid grid-cols-2 gap-3"}>
      {tiles.map((tile, index) => {
        const isSelected = selectedIndexes.includes(index);
        const isCorrect = revealing && correctIndexes!.includes(index);
        const isWrongSelected = revealing && isSelected && !isCorrect;
        const entranceAnimation = isCorrect
          ? "animate-pop-in-correct"
          : isWrongSelected
            ? "animate-shake-soft"
            : "animate-pop-in";

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(index)}
            style={{ animationDelay: `${index * 60}ms` }}
            className={[
              "relative aspect-square overflow-hidden rounded-2xl shadow-sm transition-all",
              entranceAnimation,
              isSelected && !revealing ? "ring-4 ring-lavender-deep" : "",
              isCorrect ? "ring-4 ring-mint-deep" : "",
              isWrongSelected ? "ring-4 ring-blush-deep" : "",
              disabled ? "opacity-90" : "active:scale-[0.98]",
            ].join(" ")}
          >
            {tile.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- variable set of question photos, next/image config not worth it here
              <img src={tile.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div
                className={`flex h-full w-full flex-col items-center justify-center gap-1 ${TILE_STYLES[index % TILE_STYLES.length]}`}
              >
                <span className={large ? "text-4xl" : "text-2xl"}>🖼️</span>
                <span className={large ? "text-lg text-ink-soft" : "text-xs text-ink-soft"}>
                  Foto {index + 1}
                </span>
              </div>
            )}
            {(isSelected || isCorrect) && (
              <span
                className={[
                  "absolute right-2 top-2 flex items-center justify-center rounded-full shadow-sm",
                  large ? "h-9 w-9 text-lg" : "h-6 w-6 text-xs",
                  isCorrect ? "bg-mint-deep text-white" : isWrongSelected ? "bg-blush-deep text-white" : "bg-lavender-deep text-white",
                ].join(" ")}
              >
                {isCorrect ? "✓" : isWrongSelected ? "✕" : "•"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
