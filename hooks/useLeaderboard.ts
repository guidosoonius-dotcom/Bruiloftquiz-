"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Answer, Player } from "@/lib/types";

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  score: number;
}

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      const [{ data: playersData }, { data: answersData }] = await Promise.all([
        supabase.from("players").select("*"),
        supabase.from("answers").select("*"),
      ]);
      if (!active) return;
      setPlayers((playersData as Player[]) ?? []);
      setAnswers((answersData as Answer[]) ?? []);
    }
    load();

    const channel = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "players" },
        (payload) => setPlayers((prev) => [...prev, payload.new as Player])
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "answers" },
        (payload) => setAnswers((prev) => [...prev, payload.new as Answer])
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "answers" },
        // Herlaad alles i.p.v. lokaal filteren: bij een bulk-delete (reset)
        // vuurt Postgres 1 event per verwijderde rij en kan een client een
        // event missen — een volledige refetch garandeert dat de score
        // uiteindelijk klopt, ook als niet elk los event aankwam.
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

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
