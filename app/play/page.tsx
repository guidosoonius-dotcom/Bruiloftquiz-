"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getStoredPlayer } from "@/lib/player";
import { useQuizState } from "@/hooks/useQuizState";
import { useQuizConfig } from "@/hooks/useQuizConfig";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getActiveQuestions } from "@/lib/questions";
import { computePoints } from "@/lib/scoring";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerOptionGrid } from "@/components/AnswerOptionGrid";
import { PhotoPickGrid } from "@/components/PhotoPickGrid";
import { TimerRing } from "@/components/TimerRing";
import { ScoreboardList } from "@/components/ScoreboardList";
import { FloralAccents } from "@/components/FloralAccents";

interface MyAnswer {
  selected_option: number | null;
  selected_options: number[] | null;
  is_correct: boolean;
  points_awarded: number;
}

export default function PlayPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<{ id: string; name: string } | null>(null);
  const [checkedPlayer, setCheckedPlayer] = useState(false);
  const { state } = useQuizState();
  const { config } = useQuizConfig();
  const { leaderboard, playerCount } = useLeaderboard();

  const activeQuestions = useMemo(
    () => getActiveQuestions(config?.question_order, config?.disabled_ids),
    [config]
  );

  const [myAnswer, setMyAnswer] = useState<MyAnswer | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
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
  const question = activeQuestions[questionIndex];

  // Load / reset my answer whenever the active question changes.
  useEffect(() => {
    if (!player) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset local answer before re-fetching for the new question
    setMyAnswer(null);
    setPicked([]);

    let active = true;
    function loadMyAnswer() {
      supabase
        .from("answers")
        .select("selected_option, selected_options, is_correct, points_awarded")
        .eq("player_id", player!.id)
        .eq("question_index", questionIndex)
        .maybeSingle()
        .then(({ data }) => {
          if (!active) return;
          if (data) {
            const answer = data as MyAnswer;
            setMyAnswer(answer);
            if (answer.selected_options) setPicked(answer.selected_options);
          } else {
            setMyAnswer(null);
            setPicked([]);
          }
        });
    }
    loadMyAnswer();

    // Als de host alle scores reset verdwijnt m'n antwoord uit de database —
    // herlaad dan opnieuw zodat "Antwoord verstuurd" niet blijft hangen.
    const channel = supabase
      .channel(`my_answer_${player.id}_${questionIndex}`)
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "answers" },
        loadMyAnswer
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
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

  async function submitAnswer(payload: { selected_option: number | null; selected_options: number[] | null; isCorrect: boolean }) {
    if (!player || !question || submitting) return;
    if (state?.phase !== "question" || secondsLeft <= 0) return;

    setSubmitting(true);
    const startedAt = state.question_started_at ? new Date(state.question_started_at).getTime() : Date.now();
    const elapsed = (Date.now() - startedAt) / 1000;
    const points = computePoints(payload.isCorrect, elapsed, question.timeLimitSeconds);

    const optimistic: MyAnswer = {
      selected_option: payload.selected_option,
      selected_options: payload.selected_options,
      is_correct: payload.isCorrect,
      points_awarded: points,
    };
    setMyAnswer(optimistic);

    // Upsert: een speler mag zijn antwoord wijzigen zolang de tijd nog loopt.
    await supabase.from("answers").upsert(
      {
        player_id: player.id,
        question_index: questionIndex,
        selected_option: payload.selected_option,
        selected_options: payload.selected_options,
        is_correct: payload.isCorrect,
        points_awarded: points,
      },
      { onConflict: "player_id,question_index" }
    );

    setSubmitting(false);
  }

  function handleSelect(index: number) {
    if (!question || question.type !== "multiple_choice" || secondsLeft <= 0) return;
    submitAnswer({
      selected_option: index,
      selected_options: null,
      isCorrect: index === question.correctIndex,
    });
  }

  function handlePhotoToggle(index: number) {
    if (!question || question.type !== "photo_pick" || submitting || secondsLeft <= 0) return;
    setPicked((prev) => {
      const next = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : prev.length >= 2
          ? prev
          : [...prev, index];
      if (next.length === 2 && next !== prev) {
        const correct = new Set(question.correctIndexes);
        const isCorrect = next.every((i) => correct.has(i));
        submitAnswer({ selected_option: null, selected_options: next, isCorrect });
      }
      return next;
    });
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

        {state.phase === "video_intro" && question?.type === "multiple_choice" && question.videoUrl && (
          <div key={`video-${questionIndex}`} className="animate-rise-in space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Vraag {questionIndex + 1} van {activeQuestions.length}
            </p>
            <p className="text-lg text-ink-soft">
              Kijk naar het scherm — de vraag komt zo!
            </p>
          </div>
        )}

        {state.phase === "question" && question && (
          <div key={`question-${questionIndex}`} className="animate-rise-in space-y-6">
            <div className="flex items-center justify-between">
              <TimerRing secondsLeft={secondsLeft} totalSeconds={question.timeLimitSeconds} />
              {myAnswer && secondsLeft > 0 && (
                <p className="text-sm font-semibold text-mint-deep">
                  Antwoord verstuurd ✓ <span className="font-normal text-ink-soft">(kan nog wijzigen)</span>
                </p>
              )}
              {myAnswer && secondsLeft <= 0 && (
                <p className="text-sm font-semibold text-mint-deep">Antwoord verstuurd ✓</p>
              )}
            </div>
            <QuestionCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={activeQuestions.length}
            />
            {question.type === "multiple_choice" ? (
              <AnswerOptionGrid
                options={question.options}
                selectedIndex={myAnswer?.selected_option ?? null}
                disabled={secondsLeft <= 0}
                onSelect={handleSelect}
              />
            ) : (
              <>
                <p className="text-center text-xs text-ink-soft">Tik de 2 juiste foto&apos;s aan</p>
                <PhotoPickGrid
                  tiles={question.tiles}
                  selectedIndexes={picked}
                  disabled={secondsLeft <= 0}
                  onToggle={handlePhotoToggle}
                />
              </>
            )}
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
              totalQuestions={activeQuestions.length}
            />
            {question.type === "multiple_choice" ? (
              <AnswerOptionGrid
                options={question.options}
                selectedIndex={myAnswer?.selected_option ?? null}
                correctIndex={question.correctIndex}
                disabled
                onSelect={() => {}}
              />
            ) : (
              <PhotoPickGrid
                tiles={question.tiles}
                selectedIndexes={myAnswer?.selected_options ?? []}
                correctIndexes={question.correctIndexes}
                disabled
                onToggle={() => {}}
              />
            )}
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
