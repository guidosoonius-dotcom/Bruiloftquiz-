"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getStoredPlayer, storePlayer } from "@/lib/player";
import { FloralAccents } from "@/components/FloralAccents";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of localStorage
    setExisting(getStoredPlayer());
  }, []);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setJoining(true);
    setError(null);

    const { data, error } = await supabase
      .from("players")
      .insert({ name: trimmed })
      .select()
      .single();

    if (error || !data) {
      setError("Meedoen lukte niet, probeer het nog eens.");
      setJoining(false);
      return;
    }

    storePlayer(data.id, data.name);
    router.push("/play");
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/couple/couple-welcome.jpg"
          alt="Het bruidspaar"
          fill
          priority
          className="animate-hero-kenburns object-cover object-[50%_22%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(61,53,71,0.15) 0%, rgba(251,246,241,0) 30%, rgba(251,246,241,0.85) 70%, var(--cream) 92%)",
          }}
        />
      </div>

      <FloralAccents />

      <div className="relative z-10 -mt-24 flex flex-1 flex-col px-6 pb-12">
        <div className="animate-fade-up mx-auto w-full max-w-sm space-y-7 text-center">
          <div className="space-y-2 [text-shadow:0_1px_16px_rgba(251,246,241,0.9)]">
            <p className="font-display text-sm italic text-ink-soft">Welkom bij</p>
            <h1 className="font-signature text-6xl leading-tight text-ink">De Bruiloftquiz</h1>
            <p className="text-sm text-ink-soft">
              Doe mee vanaf je telefoon — de quizmaster start zo!
            </p>
          </div>

          {existing ? (
            <div
              className="animate-fade-up space-y-3"
              style={{ animationDelay: "150ms" }}
            >
              <p className="text-sm text-ink-soft">
                Je doet al mee als{" "}
                <span className="font-semibold text-ink">{existing.name}</span>
              </p>
              <button
                onClick={() => router.push("/play")}
                className="w-full rounded-full bg-lavender-deep px-6 py-3 font-semibold text-white shadow-sm transition active:scale-[0.98]"
              >
                Verder naar de quiz
              </button>
              <button
                onClick={() => setExisting(null)}
                className="text-xs text-ink-soft underline"
              >
                Toch met een andere naam meedoen
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleJoin}
              className="animate-fade-up space-y-3"
              style={{ animationDelay: "150ms" }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jouw naam"
                maxLength={40}
                autoFocus
                className="w-full rounded-full bg-white/80 px-5 py-3 text-center text-ink shadow-sm outline-none ring-1 ring-black/5 placeholder:text-ink-soft/70 focus:ring-2 focus:ring-lavender-deep"
              />
              {error && <p className="text-sm text-blush-deep">{error}</p>}
              <button
                type="submit"
                disabled={!name.trim() || joining}
                className="w-full rounded-full bg-lavender-deep px-6 py-3 font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-50"
              >
                {joining ? "Even geduld…" : "Doe mee!"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
