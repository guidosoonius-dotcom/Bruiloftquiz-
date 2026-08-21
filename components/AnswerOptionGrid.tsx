"use client";

const OPTION_STYLES = [
  { bg: "bg-mint", bgSelected: "bg-mint-deep", shape: "▲" },
  { bg: "bg-blush", bgSelected: "bg-blush-deep", shape: "◆" },
  { bg: "bg-lavender", bgSelected: "bg-lavender-deep", shape: "●" },
  { bg: "bg-amber-100", bgSelected: "bg-amber-300", shape: "■" },
];

export function AnswerOptionGrid({
  options,
  selectedIndex,
  correctIndex,
  disabled,
  onSelect,
  size = "default",
  voteCounts,
}: {
  options: readonly string[];
  selectedIndex: number | null;
  /** Alleen meegeven tijdens de reveal-fase */
  correctIndex?: number;
  disabled: boolean;
  onSelect: (index: number) => void;
  /** "large" voor het beamerscherm */
  size?: "default" | "large";
  /** Optioneel: aantal stemmen per optie, getoond op het beamerscherm tijdens de onthulling */
  voteCounts?: number[];
}) {
  const revealing = correctIndex !== undefined;
  const large = size === "large";

  return (
    <div className={large ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "grid grid-cols-1 gap-3 sm:grid-cols-2"}>
      {options.map((option, index) => {
        const style = OPTION_STYLES[index];
        const isSelected = selectedIndex === index;
        const isCorrect = revealing && index === correctIndex;
        const isWrongSelected = revealing && isSelected && index !== correctIndex;

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
            onClick={() => onSelect(index)}
            style={{ animationDelay: `${index * 60}ms` }}
            className={[
              "flex items-center gap-3 rounded-2xl text-left font-semibold text-ink shadow-sm transition-all",
              large ? "px-6 py-6 text-2xl" : "px-4 py-4",
              entranceAnimation,
              isSelected ? style.bgSelected : style.bg,
              disabled ? "opacity-90" : "active:scale-[0.98]",
              isCorrect ? "ring-4 ring-mint-deep" : "",
              isWrongSelected ? "ring-4 ring-blush-deep" : "",
            ].join(" ")}
          >
            <span className={large ? "text-2xl opacity-70" : "text-lg opacity-70"}>{style.shape}</span>
            <span className="flex-1">{option}</span>
            {voteCounts && (
              <span className={large ? "text-lg text-ink-soft" : "text-xs text-ink-soft"}>
                {voteCounts[index] ?? 0}×
              </span>
            )}
            {isCorrect && <span aria-hidden>✓</span>}
            {isWrongSelected && <span aria-hidden>✕</span>}
          </button>
        );
      })}
    </div>
  );
}
