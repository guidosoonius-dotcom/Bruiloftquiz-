"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useQuizState } from "@/hooks/useQuizState";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { questions } from "@/lib/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerOptionGrid } from "@/components/AnswerOptionGrid";
import { TimerRing } from "@/components/TimerRing";
import { ScoreboardList } from "@/components/ScoreboardList";
import { FloralAccents } from "@/components/FloralAccents";

/**
 * Beamerscherm voor in de zaal — puur weergave, geen bediening.
 * Volgt automatisch dezelfde live quiz_state als /host en /play, met meer
 * ruimte voor de vraagtekst, foto's en video's. Gasten geven hun antwoord
 * nog steeds op hun eigen telefoon via /play.
 */
export default function ScreenPage() {
  const { state } = useQuizState();
  const { leaderboard, playerCount, answers } = useLeaderboard();
  const [origin, setOrigin] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of window.location
    setOrigin(window.location.origin);
  }, []);

  const questionIndex = state?.current_question_index ?? 0;
  const question = questions[questionIndex];

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
        if (a.selected_option >= 0 && a.selected_option < 4) counts[a.selected_option]++;
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

  return (
    <div className="relative flex flex-1 flex-col px-10 py-12">
      <FloralAccents />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        {state.phase === "lobby" && (
          <div className="animate-rise-in flex flex-col items-center gap-6 text-center">
            <div className="mx-auto h-56 w-56 overflow-hidden rounded-full shadow-lg ring-4 ring-white">
              <Image
                src="/couple/couple-welcome.jpg"
                alt="Het bruidspaar"
                width={480}
                height={480}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <h1 className="font-signature text-8xl text-ink">De Bruiloftquiz</h1>
            <p className="text-2xl text-ink-soft">Doe mee vanaf je telefoon!</p>
            {origin && <p className="text-3xl font-semibold text-ink">{origin}</p>}
            <p className="text-xl text-ink-soft">{playerCount} deelnemers klaar</p>
          </div>
        )}

        {state.phase === "video_intro" && question?.videoUrl && (
          <div key={`video-${questionIndex}`} className="animate-rise-in space-y-6 text-center">
            <p className="text-lg font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {questionIndex + 1} van {questions.length}
            </p>
            <video
              src={question.videoUrl}
              controls
              autoPlay
              className="mx-auto aspect-video max-h-[65vh] w-full rounded-3xl bg-black/5 shadow-md"
            />
            <p className="text-2xl text-ink-soft">Kijk mee — de vraag komt zo!</p>
          </div>
        )}

        {state.phase === "question" && question && (
          <div key={`question-${questionIndex}`} className="animate-rise-in space-y-8">
            <div className="flex items-center justify-between">
              <TimerRing secondsLeft={secondsLeft} totalSeconds={question.timeLimitSeconds} size={120} />
              <p className="text-xl font-semibold text-ink-soft">
                {answeredCount}/{playerCount} geantwoord
              </p>
            </div>
            <QuestionCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={questions.length}
              size="large"
            />
            <AnswerOptionGrid
              options={question.options}
              selectedIndex={null}
              disabled
              onSelect={() => {}}
              size="large"
            />
          </div>
        )}

        {state.phase === "reveal" && question && (
          <div key={`reveal-${questionIndex}`} className="animate-rise-in space-y-8">
            <QuestionCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={questions.length}
              size="large"
            />
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
        )}

        {state.phase === "leaderboard" && (
          <div key={`leaderboard-${questionIndex}`} className="animate-rise-in space-y-10">
            <h2 className="text-center font-signature text-7xl text-ink">Tussenstand</h2>
            <ScoreboardList leaderboard={leaderboard} size="large" />
          </div>
        )}

        {state.phase === "finished" && (
          <div className="animate-rise-in space-y-10 text-center">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full shadow-lg ring-4 ring-white">
              <Image
                src="/couple/couple-3.jpg"
                alt="Het bruidspaar"
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-signature text-8xl text-ink">Eindstand!</h2>
            <ScoreboardList leaderboard={leaderboard} size="large" />
          </div>
        )}
      </div>
    </div>
  );
}
