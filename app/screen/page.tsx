"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useQuizState } from "@/hooks/useQuizState";
import { useQuizConfig } from "@/hooks/useQuizConfig";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getActiveQuestions } from "@/lib/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerOptionGrid } from "@/components/AnswerOptionGrid";
import { PhotoPickGrid } from "@/components/PhotoPickGrid";
import { TimerRing } from "@/components/TimerRing";
import { ScoreboardList } from "@/components/ScoreboardList";
import { FloralAccents } from "@/components/FloralAccents";
import { ScreenWelcome } from "@/components/ScreenWelcome";

/**
 * Beamerscherm voor in de zaal — puur weergave, geen bediening.
 * Volgt automatisch dezelfde live quiz_state als /host en /play, met meer
 * ruimte voor de vraagtekst, foto's en video's. Gasten geven hun antwoord
 * nog steeds op hun eigen telefoon via /play.
 */
export default function ScreenPage() {
  const { state } = useQuizState();
  const { config } = useQuizConfig();
  const { leaderboard, players, playerCount, answers } = useLeaderboard();
  const [origin, setOrigin] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  // Browsers staan automatisch afspelen mét geluid pas toe na één klik op de
  // pagina. Zonder die klik blijven de filmpjes op de beamer stil op pauze.
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  const activeQuestions = useMemo(
    () => getActiveQuestions(config?.question_order, config?.disabled_ids),
    [config]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of window.location
    setOrigin(window.location.origin);
  }, []);

  const questionIndex = state?.current_question_index ?? 0;
  const question = activeQuestions[questionIndex];

  useEffect(() => {
    if (state?.phase !== "question" || !state.question_started_at || !question) return;
    const startedAt = new Date(state.question_started_at).getTime();

    function tick() {
      const elapsed = (Date.now() - startedAt) / 1000;
      setSecondsLeft(Math.max(0, question.timeLimitSeconds - elapsed));
    }
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [state?.phase, state?.question_started_at, question]);

  const answeredCount = useMemo(
    () => answers.filter((a) => a.question_index === questionIndex).length,
    [answers, questionIndex]
  );

  const voteCounts = useMemo(() => {
    const counts = [0, 0, 0, 0];
    answers
      .filter((a) => a.question_index === questionIndex)
      .forEach((a) => {
        if (a.selected_option !== null && a.selected_option >= 0 && a.selected_option < 4) {
          counts[a.selected_option]++;
        }
      });
    return counts;
  }, [answers, questionIndex]);

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink-soft">Laden…</p>
      </div>
    );
  }

  const contentMaxWidth =
    state.phase === "lobby"
      ? "max-w-[92rem]"
      : state.phase === "question" || state.phase === "reveal"
        ? "max-w-[80rem]"
        : "max-w-5xl";

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden px-10 py-8">
      <FloralAccents />
      {!soundUnlocked && (
        <button
          onClick={() => setSoundUnlocked(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-ink px-6 py-3 text-lg font-semibold text-white shadow-lg"
        >
          🔊 Klik hier één keer om filmpjes met geluid af te spelen
        </button>
      )}
      {state.phase !== "lobby" && origin && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-md ring-1 ring-black/5">
          <QRCodeSVG value={origin} size={88} />
          <p className="max-w-28 text-sm leading-snug text-ink-soft">
            Te laat? Scan en doe alsnog mee!
          </p>
        </div>
      )}
      <div className={`mx-auto flex w-full min-h-0 flex-1 flex-col justify-center ${contentMaxWidth}`}>
        {state.phase === "lobby" && <ScreenWelcome origin={origin} players={players} />}

        {state.phase === "video_intro" && question?.type === "multiple_choice" && question.videoUrl && (
          <div
            key={`video-${questionIndex}`}
            className="animate-rise-in flex h-full min-h-0 flex-col items-center gap-6 text-center"
          >
            <p className="shrink-0 text-lg font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {questionIndex + 1} van {activeQuestions.length}
            </p>
            <video
              src={question.videoUrl}
              controls
              autoPlay
              className="min-h-0 w-full flex-1 rounded-3xl bg-black/5 object-contain shadow-md"
            />
            <p className="shrink-0 text-2xl text-ink-soft">Kijk mee — de vraag komt zo!</p>
          </div>
        )}

        {state.phase === "question" && question && (
          <div key={`question-${questionIndex}`} className="animate-rise-in flex h-full min-h-0 flex-col gap-6">
            <div className="flex shrink-0 items-center justify-between">
              <TimerRing secondsLeft={secondsLeft} totalSeconds={question.timeLimitSeconds} size={110} />
              <p className="text-xl font-semibold text-ink-soft">
                {answeredCount}/{playerCount} geantwoord
              </p>
            </div>
            {question.type === "multiple_choice" ? (
              <>
                <div className="min-h-0 flex-1">
                  <QuestionCard
                    question={question}
                    questionNumber={questionIndex + 1}
                    totalQuestions={activeQuestions.length}
                    size="large"
                    layout="split"
                  />
                </div>
                <div className="mx-auto w-full max-w-3xl shrink-0">
                  <AnswerOptionGrid
                    options={question.options}
                    selectedIndex={null}
                    disabled
                    onSelect={() => {}}
                    size="large"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="shrink-0">
                  <QuestionCard
                    question={question}
                    questionNumber={questionIndex + 1}
                    totalQuestions={activeQuestions.length}
                    size="large"
                  />
                </div>
                <div className="mx-auto min-h-0 w-full max-w-4xl flex-1">
                  <PhotoPickGrid
                    tiles={question.tiles}
                    selectedIndexes={[]}
                    disabled
                    onToggle={() => {}}
                    size="large"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {state.phase === "reveal" && question && (
          <div key={`reveal-${questionIndex}`} className="animate-rise-in flex h-full min-h-0 flex-col gap-6">
            {question.type === "multiple_choice" ? (
              <>
                <div className="min-h-0 flex-1">
                  <QuestionCard
                    question={question}
                    questionNumber={questionIndex + 1}
                    totalQuestions={activeQuestions.length}
                    size="large"
                    layout="split"
                    revealed
                  />
                </div>
                <div className="mx-auto w-full max-w-3xl shrink-0">
                  <AnswerOptionGrid
                    options={question.options}
                    selectedIndex={null}
                    correctIndex={question.correctIndex}
                    disabled
                    onSelect={() => {}}
                    size="large"
                    voteCounts={voteCounts}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="shrink-0">
                  <QuestionCard
                    question={question}
                    questionNumber={questionIndex + 1}
                    totalQuestions={activeQuestions.length}
                    size="large"
                    revealed
                  />
                </div>
                <div className="mx-auto min-h-0 w-full max-w-4xl flex-1">
                  <PhotoPickGrid
                    tiles={question.tiles}
                    selectedIndexes={[]}
                    correctIndexes={question.correctIndexes}
                    disabled
                    onToggle={() => {}}
                    size="large"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {state.phase === "leaderboard" && (
          <div
            key={`leaderboard-${questionIndex}`}
            className="animate-rise-in flex h-full min-h-0 flex-col gap-6"
          >
            <h2 className="shrink-0 text-center font-signature text-7xl text-ink">Tussenstand</h2>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ScoreboardList leaderboard={leaderboard} size="large" />
            </div>
          </div>
        )}

        {state.phase === "finished" && (
          <div className="animate-rise-in flex h-full min-h-0 flex-col items-center gap-6 text-center">
            <div className="shrink-0 space-y-4">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full shadow-lg ring-4 ring-white">
                <Image
                  src="/couple/couple-3.jpg"
                  alt="Het bruidspaar"
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-signature text-8xl text-ink">Eindstand!</h2>
            </div>
            <div className="min-h-0 w-full flex-1 overflow-y-auto">
              <ScoreboardList leaderboard={leaderboard} size="large" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
