"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useResyncOnVisible } from "./useResync";

export interface QuizConfig {
  id: number;
  question_order: number[];
  disabled_ids: number[];
}

/**
 * De live vraagvolgorde/uitsluitingen die de quizmaster vanuit /host kan
 * aanpassen. `config` is `null` totdat de eerste fetch binnen is — gebruik
 * dan de standaardvolgorde uit lib/questions.ts als fallback.
 */
export function useQuizConfig() {
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("quiz_config").select("*").eq("id", 1).single();
    if (data) setConfig(data as QuizConfig);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch; setState happens after the await
    load();
    const channel = supabase
      .channel("quiz_config_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_config", filter: "id=eq.1" },
        (payload) => setConfig(payload.new as QuizConfig)
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") load();
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  useResyncOnVisible(load);

  return { config };
}
