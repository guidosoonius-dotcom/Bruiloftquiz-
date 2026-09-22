import { Question } from "@/lib/types";
import { MediaBlock } from "./MediaBlock";

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  size = "default",
  revealed = false,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  /** "large" voor het beamerscherm: grotere tekst en meer ruimte voor media */
  size?: "default" | "large";
  /** True zodra het antwoord onthuld is (reveal/tussenstand/eindstand) */
  revealed?: boolean;
}) {
  const large = size === "large";

  return (
    <div className={large ? "space-y-6" : "space-y-4"}>
      <p
        className={
          large
            ? "text-lg font-semibold uppercase tracking-wide text-ink-soft"
            : "text-sm font-semibold uppercase tracking-wide text-ink-soft"
        }
      >
        Vraag {questionNumber} van {totalQuestions}
      </p>
      <h2
        className={
          large
            ? "font-display text-4xl italic leading-snug text-ink sm:text-5xl"
            : "font-display text-2xl italic leading-snug text-ink sm:text-3xl"
        }
      >
        {question.question}
      </h2>
      {question.anecdote && (
        <p
          className={
            large
              ? "rounded-2xl bg-white/70 p-5 text-xl italic text-ink-soft shadow-sm"
              : "rounded-2xl bg-white/70 p-4 text-sm italic text-ink-soft shadow-sm"
          }
        >
          {question.anecdote}
        </p>
      )}
      {question.type === "multiple_choice" && (
        <MediaBlock
          imageUrl={question.imageUrl}
          videoUrl={
            question.videoIntro || (question.videoRevealOnly && !revealed)
              ? undefined
              : question.videoUrl
          }
          size={size}
        />
      )}
    </div>
  );
}
