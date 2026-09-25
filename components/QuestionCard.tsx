import { Question } from "@/lib/types";
import { MediaBlock } from "./MediaBlock";

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  size = "default",
  revealed = false,
  layout = "stacked",
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  /** "large" voor het beamerscherm: grotere tekst en meer ruimte voor media */
  size?: "default" | "large";
  /** True zodra het antwoord onthuld is (reveal/tussenstand/eindstand) */
  revealed?: boolean;
  /**
   * "split" zet media en tekst naast elkaar i.p.v. onder elkaar — voor het
   * brede beamerscherm van een laptop, zodat een grote foto niet alle
   * verticale ruimte opeet en de antwoorden buiten beeld duwt. Valt terug op
   * "stacked" zodra er geen media is om naast de tekst te zetten.
   */
  layout?: "stacked" | "split";
}) {
  const large = size === "large";
  const visibleVideoUrl =
    question.type === "multiple_choice" &&
    !(question.videoIntro || (question.videoRevealOnly && !revealed))
      ? question.videoUrl
      : undefined;
  const hasMedia =
    question.type === "multiple_choice" && Boolean(question.imageUrl || visibleVideoUrl);
  const useSplit = layout === "split" && hasMedia;

  const label = (
    <p
      className={
        large
          ? "text-lg font-semibold uppercase tracking-wide text-ink-soft"
          : "text-sm font-semibold uppercase tracking-wide text-ink-soft"
      }
    >
      Vraag {questionNumber} van {totalQuestions}
    </p>
  );

  const title = (
    <h2
      className={
        large
          ? `font-display italic leading-snug text-ink ${
              useSplit ? "text-[clamp(1.75rem,3.4vw,3rem)]" : "text-4xl sm:text-5xl"
            }`
          : "font-display text-2xl italic leading-snug text-ink sm:text-3xl"
      }
    >
      {question.question}
    </h2>
  );

  const anecdote = question.anecdote && (
    <p
      className={
        large
          ? "rounded-2xl bg-white/70 p-5 text-xl italic text-ink-soft shadow-sm"
          : "rounded-2xl bg-white/70 p-4 text-sm italic text-ink-soft shadow-sm"
      }
    >
      {question.anecdote}
    </p>
  );

  const media = question.type === "multiple_choice" && (
    <MediaBlock imageUrl={question.imageUrl} videoUrl={visibleVideoUrl} size={size} fill={useSplit} />
  );

  if (useSplit) {
    // Geen items-center op deze grid: die zou de mediacel op zijn eigen
    // (auto = 0) hoogte laten staan i.p.v.'m te laten uitrekken tot de
    // rijhoogte, waardoor de foto onzichtbaar zou zijn.
    return (
      <div className="grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="min-h-0 lg:order-2">{media}</div>
        <div className="flex min-h-0 flex-col justify-center gap-4 lg:order-1">
          {label}
          {title}
          {anecdote}
        </div>
      </div>
    );
  }

  return (
    <div className={large ? "space-y-6" : "space-y-4"}>
      {label}
      {title}
      {anecdote}
      {media}
    </div>
  );
}
