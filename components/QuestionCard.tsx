import { Question } from "@/lib/types";
import { MediaBlock } from "./MediaBlock";

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
        Vraag {questionNumber} van {totalQuestions}
      </p>
      <h2 className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">
        {question.question}
      </h2>
      {question.anecdote && (
        <p className="rounded-2xl bg-white/70 p-4 text-sm italic text-ink-soft shadow-sm">
          {question.anecdote}
        </p>
      )}
      <MediaBlock
        imageUrl={question.imageUrl}
        videoUrl={question.videoIntro ? undefined : question.videoUrl}
      />
    </div>
  );
}
