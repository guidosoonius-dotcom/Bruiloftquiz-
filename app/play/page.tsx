"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getStoredPlayer } from "@/lib/player";
import { useQuizState } from "@/hooks/useQuizState";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { questions } from "@/lib/questions";
import { computePoints } from "@/lib/scoring";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerOptionGrid } from "@/components/AnswerOptionGrid";
import { TimerRing } from "@/components/TimerRing";
import { ScoreboardList } from "@/components/ScoreboardList";
import { FloralAccents } from "@/components/FloralAccents";

interface MyAnswer {
  selected_option: number;
  is_correct: boolean;
  points_awarded: number;
}

export default function PlayPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<{ id: string; name: string } | null>(null);
  const [checkedPlayer, setCheckedPlayer] = useState(false);
  const { state } = useQuizState();
  const { leaderboard, playerCount } = useLeaderboard();

  const [myAnswer, setMyAnswer] = useState<MyAnswer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const stored = getStoredPlayer();
    if (!stored) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of localStorage
    setPlayer(stored);
    setCheckedPlayer(true);
  }, [router]);

  const questionIndex = state?.current_question_index ?? 0;
  const question = questions[questionIndex];

  // Load / reset my answer whenever the active question changes.
  useEffect(() => {
    if (!player) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset local answer before re-fetching for the new question
    setMyAnswer(null);
    supabase
      .from("answers")
      .select("selected_option, is_correct, points_awarded")
      .eq("player_id", player.id)
      .eq("question_index", questionIndex)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setMyAnswer(data as MyAnswer);
      });
  }, [player, questionIndex]);

  // Countdown timer while a question is live.
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

  const ownRank = useMemo(
    () => leaderboard.findIndex((e) => e.playerId === player?.id),
    [leaderboard, player]
  );

  async function handleSelect(index: number) {
    if (!player || !question || myAnswer || submitting) return;
    if (state?.phase !== "question") return;

    setSubmitting(true);
    const startedAt = state.question_started_at ? new Date(state.question_started_at).getTime() : Date.now();
    const elapsed = (Date.now() - startedAt) / 1000;
    const isCorrect = index === question.correctIndex;
    const points = computePoints(isCorrect, elapsed, question.timeLimitSeconds);

    const optimistic: MyAnswer = { selected_option: index, is_correct: isCorrect, points_awarded: points };
    setMyAnswer(optimistic);

    const { error } = await supabase.from("answers").insert({
      player_id: player.id,
      question_index: questionIndex,
      selected_option: index,
      is_correct: isCorrect,
      points_awarded: points,
    });

    if (error) {
      // Waarschijnlijk al beantwoord (unique constraint) — haal het bestaande antwoord op.
      const { data } = await supabase
        .from("answers")
        .select("selected_option, is_correct, points_awarded")
        .eq("player_id", player.id)
        .eq("question_index", questionIndex)
        .maybeSingle();
      if (data) setMyAnswer(data as MyAnswer);
    }
    setSubmitting(false);
  }

  if (!checkedPlayer || !state || !player) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink-soft">Laden…</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col px-5 py-8">
      <FloralAccents />
      <div className="mx-auto w-full max-w-md flex-1">
        {state.phase === "lobby" && (
          <div className="animate-rise-in flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="font-display text-2xl italic text-ink">
              Welkom, {player.name}!
            </p>
            <p className="text-sm text-ink-soft">
              De quiz begint zo — hou je telefoon erbij.
            </p>
            <p className="text-xs text-ink-soft">{playerCount} deelnemers klaar</p>
          </div>
        )}

        {state.phase === "video_intro" && question?.videoUrl && (
          <div key={`video-${questionIndex}`} className="animate-rise-in space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {questionIndex + 1} van {questions.length}
            </p>
            <video
              src={question.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full rounded-2xl bg-black/5 shadow-sm"
            />
            <p className="text-sm text-ink-soft">
              Kijk mee — de vraag komt zo!
            </p>
          </div>
        )}

        {state.phase === "question" && question && (
          <div key={`question-${questionIndex}`} className="animate-rise-in space-y-6">
            <div className="flex items-center justify-between">
              <TimerRing secondsLeft={secondsLeft} totalSeconds={question.timeLimitSeconds} />
              {myAnswer && (
                <p className="text-sm font-semibold text-mint-deep">Antwoord verstuurd ✓</p>
              )}
            </div>
            <QuestionCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={questions.length}
            />
            <AnswerOptionGrid
              options={question.options}
              selectedIndex={myAnswer?.selected_option ?? null}
              disabled={!!myAnswer || secondsLeft <= 0}
              onSelect={handleSelect}
            />
            {!myAnswer && secondsLeft <= 0 && (
              <p className="text-center text-sm text-blush-deep">Tijd is voorbij!</p>
            )}
          </div>
        )}

        {state.phase === "reveal" && question && (
          <div key={`reveal-${questionIndex}`} className="animate-rise-in space-y-6">
            <QuestionCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={questions.length}
            />
            <AnswerOptionGrid
              options={question.options}
              selectedIndex={myAnswer?.selected_option ?? null}
              correctIndex={question.correctIndex}
              disabled
              onSelect={() => {}}
            />
            <div
              className="animate-rise-in rounded-2xl bg-white/70 p-4 text-center shadow-sm"
              style={{ animationDelay: "300ms" }}
            >
              {myAnswer ? (
                <p className="font-semibold text-ink">
                  {myAnswer.is_correct ? "Goed! 🎉" : "Helaas, fout antwoord"}{" "}
                  <span className="text-ink-soft">(+{myAnswer.points_awarded} punten)</span>
                </p>
              ) : (
                <p className="font-semibold text-ink-soft">Je hebt niet op tijd geantwoord.</p>
              )}
            </div>
          </div>
        )}

        {state.phase === "leaderboard" && (
          <div key={`leaderboard-${questionIndex}`} className="animate-rise-in space-y-6">
            <h2 className="text-center font-display text-3xl italic text-ink">Tussenstand</h2>
            <ScoreboardList leaderboard={leaderboard} ownPlayerId={player.id} />
            {ownRank >= 0 && (
              <p className="text-center text-xs text-ink-soft">
                Jij staat op plek {ownRank + 1} van de {leaderboard.length}
              </p>
            )}
          </div>
        )}

        {state.phase === "finished" && (
          <div className="animate-rise-in space-y-6 text-center">
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full shadow-lg ring-4 ring-white">
              <Image
                src="/couple/couple-3.jpg"
                alt="Het bruidspaar"
                width={240}
                height={240}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-display text-3xl italic text-ink">Eindstand!</h2>
            <ScoreboardList leaderboard={leaderboard} ownPlayerId={player.id} />
            {ownRank >= 0 && (
              <p className="text-sm text-ink-soft">
                Jij eindigde op plek {ownRank + 1} van de {leaderboard.length} — bedankt voor het
                meespelen! 💛
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
