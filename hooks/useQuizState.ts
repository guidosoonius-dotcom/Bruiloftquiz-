"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { QuizState } from "@/lib/types";
import { useResyncOnVisible } from "./useResync";

export function useQuizState() {
  const [state, setState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("quiz_state").select("*").eq("id", 1).single();
    if (data) setState(data as QuizState);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch; setState happens after the await
    load();
    const channel = supabase
      .channel("quiz_state_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_state", filter: "id=eq.1" },
        (payload) => setState(payload.new as QuizState)
      )
      // Ook na een herverbinding opnieuw ophalen: tijdens de onderbreking
      // gemiste wijzigingen worden niet nagestuurd.
      .subscribe((status) => {
        if (status === "SUBSCRIBED") load();
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  useResyncOnVisible(load);

  return { state, loading };
}
