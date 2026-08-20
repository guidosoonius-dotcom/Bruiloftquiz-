"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuizState } from "@/hooks/useQuizState";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { questions } from "@/lib/questions";
import { FloralAccents } from "@/components/FloralAccents";
import { QuizPhase } from "@/lib/types";

const HOST_SESSION_KEY = "bruiloftquiz.hostAuthed";

const PHASE_LABEL: Record<QuizPhase, string> = {
  lobby: "Wachtkamer",
  question: "Vraag live",
  reveal: "Antwoord onthuld",
  leaderboard: "Tussenstand getoond",
  finished: "Eindstand getoond",
};

export default function HostPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of sessionStorage
    if (sessionStorage.getItem(HOST_SESSION_KEY) === "1") setAuthed(true);
  }, []);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === process.env.NEXT_PUBLIC_HOST_PIN) {
      sessionStorage.setItem(HOST_SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setPinError(true);
    }
  }

  if (!authed) {
    return (
      <div className="relative flex flex-1 items-center justify-center px-6">
        <FloralAccents />
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3 text-center">
          <h1 className="font-display text-2xl italic text-ink">Quizmaster</h1>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError(false);
            }}
            placeholder="PIN"
            autoFocus
            className="w-full rounded-full bg-white/80 px-5 py-3 text-center text-ink shadow-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-lavender-deep"
          />
          {pinError && <p className="text-sm text-blush-deep">Onjuiste PIN</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-lavender-deep px-6 py-3 font-semibold text-white shadow-sm"
          >
            Inloggen
          </button>
        </form>
      </div>
    );
  }

  return <HostPanel />;
}

function HostPanel() {
  const { state } = useQuizState();
  const { playerCount, answers } = useLeaderboard();
  const [busy, setBusy] = useState(false);

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink-soft">Laden…</p>
      </div>
    );
  }

  const index = state.current_question_index;
  const question = questions[index];
  const isLastQuestion = index + 1 >= questions.length;
  const answeredCount = answers.filter((a) => a.question_index === index).length;

  async function updateState(patch: Partial<{
    phase: QuizPhase;
    current_question_index: number;
    question_started_at: string | null;
  }>) {
    setBusy(true);
    await supabase.from("quiz_state").update(patch).eq("id", 1);
    setBusy(false);
  }

  const startQuiz = () =>
    updateState({ phase: "question", current_question_index: 0, question_started_at: new Date().toISOString() });

  const revealAnswer = () => updateState({ phase: "reveal" });

  const nextQuestion = () =>
    updateState({
      phase: "question",
      current_question_index: index + 1,
      question_started_at: new Date().toISOString(),
    });

  const showLeaderboard = () => updateState({ phase: "leaderboard" });

  const showFinished = () => updateState({ phase: "finished" });

  const resetQuiz = () => {
    if (!confirm("Terug naar de wachtkamer? Scores blijven bewaard.")) return;
    updateState({ phase: "lobby", current_question_index: 0, question_started_at: null });
  };

  return (
    <div className="relative flex flex-1 flex-col px-5 py-8">
      <FloralAccents />
      <div className="mx-auto w-full max-w-md flex-1 space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl italic text-ink">Quizmaster-paneel</h1>
          <p className="text-sm text-ink-soft">
            {PHASE_LABEL[state.phase]} · {playerCount} deelnemers
          </p>
        </div>

        {question && (
          <div className="space-y-2 rounded-2xl bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {index + 1} van {questions.length}
              {state.phase === "question" && ` · ${answeredCount}/${playerCount} geantwoord`}
            </p>
            <p className="font-semibold text-ink">{question.question}</p>
            {question.anecdote && (
              <p className="text-sm italic text-ink-soft">{question.anecdote}</p>
            )}
            <ul className="space-y-1 text-sm">
              {question.options.map((option, i) => (
                <li
                  key={i}
                  className={i === question.correctIndex ? "font-semibold text-mint-deep" : "text-ink-soft"}
                >
                  {i === question.correctIndex ? "✓ " : "· "}
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          {state.phase === "lobby" && (
            <button
              onClick={startQuiz}
              disabled={busy}
              className="w-full rounded-full bg-mint-deep px-6 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              ▶ Start de quiz
            </button>
          )}

          {state.phase === "question" && (
            <button
              onClick={revealAnswer}
              disabled={busy}
              className="w-full rounded-full bg-lavender-deep px-6 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              ✅ Onthul antwoord
            </button>
          )}

          {(state.phase === "reveal" || state.phase === "leaderboard") && (
            <>
              {!isLastQuestion ? (
                <button
                  onClick={nextQuestion}
                  disabled={busy}
                  className="w-full rounded-full bg-mint-deep px-6 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.98]"
                >
                  ➡ Volgende vraag
                </button>
              ) : (
                <button
                  onClick={showFinished}
                  disabled={busy}
                  className="w-full rounded-full bg-blush-deep px-6 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.98]"
                >
                  🏁 Toon eindstand
                </button>
              )}
              {state.phase === "reveal" && (
                <button
                  onClick={showLeaderboard}
                  disabled={busy}
                  className="w-full rounded-full bg-white/80 px-6 py-3 font-semibold text-ink shadow-sm ring-1 ring-black/5 active:scale-[0.98]"
                >
                  🏆 Toon tussenstand
                </button>
              )}
            </>
          )}

          {state.phase === "finished" && (
            <p className="text-center text-sm text-ink-soft">De quiz is afgelopen. Bedankt!</p>
          )}

          <button
            onClick={resetQuiz}
            disabled={busy}
            className="w-full text-center text-xs text-ink-soft underline"
          >
            Terug naar wachtkamer
          </button>
        </div>
      </div>
    </div>
  );
}
