"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { QuizState } from "@/lib/types";

export function useQuizState() {
  const [state, setState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from("quiz_state")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (active) {
          setState(data as QuizState);
          setLoading(false);
        }
      });

    const channel = supabase
      .channel("quiz_state_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_state", filter: "id=eq.1" },
        (payload) => setState(payload.new as QuizState)
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { state, loading };
}
