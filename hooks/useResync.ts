"use client";

import { useEffect } from "react";

/**
 * Roept `reload` aan zodra het tabblad weer zichtbaar wordt. Realtime-events
 * die binnenkomen terwijl een telefoon op slot staat of de gast in een andere
 * app zit worden niet opnieuw afgeleverd, dus zonder deze herlaadactie blijft
 * zo'n telefoon op een oude vraag of fase hangen.
 */
export function useResyncOnVisible(reload: () => void) {
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") reload();
    }
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", reload);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", reload);
    };
  }, [reload]);
}
