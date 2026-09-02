"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    let active = true;

    supabase
      .from("quiz_config")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (active && data) setConfig(data as QuizConfig);
      });

    const channel = supabase
      .channel("quiz_config_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quiz_config", filter: "id=eq.1" },
        (payload) => setConfig(payload.new as QuizConfig)
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { config };
}
