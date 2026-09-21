"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuizState } from "@/hooks/useQuizState";
import { useQuizConfig } from "@/hooks/useQuizConfig";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { questionsById, defaultQuestionOrder, resolveQuestionOrder, getActiveQuestions } from "@/lib/questions";
import { FloralAccents } from "@/components/FloralAccents";
import { MediaBlock } from "@/components/MediaBlock";
import { PhotoPickGrid } from "@/components/PhotoPickGrid";
import { QuizPhase } from "@/lib/types";

const HOST_SESSION_KEY = "bruiloftquiz.hostAuthed";

const PHASE_LABEL: Record<QuizPhase, string> = {
  lobby: "Wachtkamer",
  video_intro: "Video wordt getoond",
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
  const { config } = useQuizConfig();
  const { playerCount, answers } = useLeaderboard();
  const [busy, setBusy] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink-soft">Laden…</p>
      </div>
    );
  }

  const order = resolveQuestionOrder(config?.question_order);
  const disabledIds = config?.disabled_ids ?? [];
  const activeQuestions = getActiveQuestions(config?.question_order, config?.disabled_ids);

  const index = state.current_question_index;
  const question = activeQuestions[index];
  const isLastQuestion = index + 1 >= activeQuestions.length;
  const answeredCount = answers.filter((a) => a.question_index === index).length;

  async function updateState(patch: Partial<{
    phase: QuizPhase;
    current_question_index: number;
    question_started_at: string | null;
  }>) {
    setBusy(true);
    setUpdateError(null);
    const { error } = await supabase.from("quiz_state").update(patch).eq("id", 1);
    if (error) setUpdateError(error.message);
    setBusy(false);
  }

  async function updateConfig(patch: Partial<{ question_order: number[]; disabled_ids: number[] }>) {
    setBusy(true);
    setUpdateError(null);
    const { error } = await supabase.from("quiz_config").update(patch).eq("id", 1);
    if (error) setUpdateError(error.message);
    setBusy(false);
  }

  const startQuiz = () =>
    activeQuestions[0]?.type === "multiple_choice" && activeQuestions[0].videoIntro
      ? updateState({ phase: "video_intro", current_question_index: 0, question_started_at: null })
      : updateState({ phase: "question", current_question_index: 0, question_started_at: new Date().toISOString() });

  const startQuestion = () =>
    updateState({ phase: "question", question_started_at: new Date().toISOString() });

  const revealAnswer = () => updateState({ phase: "reveal" });

  const nextQuestion = () => {
    const next = activeQuestions[index + 1];
    return next?.type === "multiple_choice" && next.videoIntro
      ? updateState({ phase: "video_intro", current_question_index: index + 1, question_started_at: null })
      : updateState({
          phase: "question",
          current_question_index: index + 1,
          question_started_at: new Date().toISOString(),
        });
  };

  const previousQuestion = () => {
    if (index <= 0) return;
    const prev = activeQuestions[index - 1];
    return prev?.type === "multiple_choice" && prev.videoIntro
      ? updateState({ phase: "video_intro", current_question_index: index - 1, question_started_at: null })
      : updateState({
          phase: "question",
          current_question_index: index - 1,
          question_started_at: new Date().toISOString(),
        });
  };

  const showLeaderboard = () => updateState({ phase: "leaderboard" });

  const showFinished = () => updateState({ phase: "finished" });

  const resetQuiz = () => {
    if (!confirm("Terug naar de wachtkamer? Scores blijven bewaard.")) return;
    updateState({ phase: "lobby", current_question_index: 0, question_started_at: null });
  };

  async function resetScores() {
    if (!confirm("Alle scores wissen? Dit kan niet ongedaan gemaakt worden.")) return;
    setBusy(true);
    setUpdateError(null);
    const { error } = await supabase.from("answers").delete().not("id", "is", null);
    if (error) setUpdateError(error.message);
    setBusy(false);
  }

  function moveQuestion(pos: number, direction: -1 | 1) {
    const newPos = pos + direction;
    if (newPos < 0 || newPos >= order.length) return;
    const newOrder = [...order];
    [newOrder[pos], newOrder[newPos]] = [newOrder[newPos], newOrder[pos]];
    updateConfig({ question_order: newOrder });
  }

  function toggleDisabled(id: number) {
    const isDisabled = disabledIds.includes(id);
    if (!isDisabled) {
      const activeCount = order.filter((qid) => !disabledIds.includes(qid)).length;
      if (activeCount <= 1) {
        setUpdateError("Er moet minstens 1 vraag actief blijven.");
        return;
      }
    }
    const newDisabled = isDisabled ? disabledIds.filter((qid) => qid !== id) : [...disabledIds, id];
    updateConfig({ disabled_ids: newDisabled });
  }

  const resetOrder = () => updateConfig({ question_order: defaultQuestionOrder, disabled_ids: [] });

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

        {updateError && (
          <p className="rounded-2xl bg-blush/70 p-3 text-center text-sm text-blush-deep">
            Actie is niet gelukt: {updateError}
          </p>
        )}

        {question && (
          <div className="space-y-2 rounded-2xl bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {index + 1} van {activeQuestions.length}
              {state.phase === "question" && ` · ${answeredCount}/${playerCount} geantwoord`}
            </p>
            <p className="font-semibold text-ink">{question.question}</p>
            {question.anecdote && (
              <p className="text-sm italic text-ink-soft">{question.anecdote}</p>
            )}
            {question.type === "multiple_choice" ? (
              <>
                <MediaBlock imageUrl={question.imageUrl} videoUrl={question.videoUrl} />
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
              </>
            ) : (
              <>
                <p className="text-sm text-ink-soft">
                  {question.tiles.length} tegels · juist zijn foto{" "}
                  {question.correctIndexes.map((i) => i + 1).join(" & ")}
                </p>
                <PhotoPickGrid
                  tiles={question.tiles}
                  selectedIndexes={[]}
                  correctIndexes={question.correctIndexes}
                  disabled
                  onToggle={() => {}}
                />
              </>
            )}
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

          {state.phase === "video_intro" && (
            <button
              onClick={startQuestion}
              disabled={busy}
              className="w-full rounded-full bg-mint-deep px-6 py-4 text-lg font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              ▶ Start vraag
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

          {index > 0 && state.phase !== "lobby" && state.phase !== "finished" && (
            <button
              onClick={previousQuestion}
              disabled={busy}
              className="w-full text-center text-xs text-ink-soft underline"
            >
              ⬅ Vorige vraag
            </button>
          )}

          <button
            onClick={resetQuiz}
            disabled={busy}
            className="w-full text-center text-xs text-ink-soft underline"
          >
            Terug naar wachtkamer
          </button>

          <button
            onClick={resetScores}
            disabled={busy}
            className="w-full text-center text-xs text-blush-deep underline"
          >
            Alle scores resetten
          </button>
        </div>

        {state.phase === "lobby" && (
          <QuestionManager
            order={order}
            disabledIds={disabledIds}
            busy={busy}
            onMove={moveQuestion}
            onToggle={toggleDisabled}
            onReset={resetOrder}
          />
        )}
      </div>
    </div>
  );
}

function QuestionManager({
  order,
  disabledIds,
  busy,
  onMove,
  onToggle,
  onReset,
}: {
  order: number[];
  disabledIds: number[];
  busy: boolean;
  onMove: (pos: number, direction: -1 | 1) => void;
  onToggle: (id: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl bg-white/70 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Vragen beheren
        </p>
        <button onClick={onReset} disabled={busy} className="text-xs text-ink-soft underline">
          Standaardvolgorde
        </button>
      </div>
      <ul className="space-y-1.5">
        {order.map((id, pos) => {
          const q = questionsById[id];
          if (!q) return null;
          const isDisabled = disabledIds.includes(id);
          return (
            <li
              key={id}
              className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${isDisabled ? "opacity-40" : ""}`}
            >
              <div className="flex flex-col">
                <button
                  onClick={() => onMove(pos, -1)}
                  disabled={busy || pos === 0}
                  className="leading-none text-ink-soft disabled:opacity-30"
                  aria-label="Omhoog"
                >
                  ▲
                </button>
                <button
                  onClick={() => onMove(pos, 1)}
                  disabled={busy || pos === order.length - 1}
                  className="leading-none text-ink-soft disabled:opacity-30"
                  aria-label="Omlaag"
                >
                  ▼
                </button>
              </div>
              <p className={`flex-1 truncate text-sm ${isDisabled ? "line-through" : "text-ink"}`}>
                {pos + 1}. {q.question}
              </p>
              <button
                onClick={() => onToggle(id)}
                disabled={busy}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  isDisabled ? "bg-white text-ink-soft ring-1 ring-black/10" : "bg-mint-deep text-white"
                }`}
              >
                {isDisabled ? "Uit" : "Aan"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
