"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Answer, Player } from "@/lib/types";
import { useResyncOnVisible } from "./useResync";

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  score: number;
}

/** Vervangt een bestaande rij met hetzelfde id, of voegt 'm toe. */
function upsertById<T extends { id: string }>(rows: T[], row: T): T[] {
  const index = rows.findIndex((r) => r.id === row.id);
  if (index === -1) return [...rows, row];
  const next = [...rows];
  next[index] = row;
  return next;
}

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const load = useCallback(async () => {
    const [{ data: playersData }, { data: answersData }] = await Promise.all([
      supabase.from("players").select("*"),
      supabase.from("answers").select("*"),
    ]);
    if (playersData) setPlayers(playersData as Player[]);
    if (answersData) setAnswers(answersData as Answer[]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch; setState happens after the await
    load();
    const channel = supabase
      .channel("leaderboard_changes")
      // Upsert i.p.v. append: een event kan binnenkomen voor een rij die de
      // laatste herlaadactie al had opgehaald, en dubbele rijen zouden punten
      // dubbel tellen.
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "players" },
        (payload) => setPlayers((prev) => upsertById(prev, payload.new as Player))
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "answers" },
        (payload) => setAnswers((prev) => upsertById(prev, payload.new as Answer))
      )
      // Een gewijzigd antwoord (binnen de tijd) komt binnen als UPDATE.
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "answers" },
        (payload) => setAnswers((prev) => upsertById(prev, payload.new as Answer))
      )
      // Bij een DELETE (scores resetten / spelers opschonen) vuurt Postgres
      // één event per rij; een volledige herlaadactie is robuuster dan lokaal
      // filteren, ook als niet elk los event aankomt.
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "answers" }, () => load())
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "players" }, () => load())
      .subscribe((status) => {
        if (status === "SUBSCRIBED") load();
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  useResyncOnVisible(load);

  const leaderboard: LeaderboardEntry[] = players
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      score: answers
        .filter((a) => a.player_id === player.id)
        .reduce((sum, a) => sum + a.points_awarded, 0),
    }))
    .sort((a, b) => b.score - a.score);

  return { leaderboard, playerCount: players.length, answers };
}
