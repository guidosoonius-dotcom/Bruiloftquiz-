"use client";

import { useMemo } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Player } from "@/lib/types";

const STEPS = [
  { label: "Scan de QR-code met de camera van je telefoon", color: "bg-mint-deep" },
  { label: "Vul je naam in en tik op “Doe mee!”", color: "bg-lavender-deep" },
  { label: "Wacht tot de quizmaster de eerste vraag start", color: "bg-blush-deep" },
];

/**
 * Welkomstscherm voor de beamer terwijl gasten binnendruppelen. Links het
 * bruidspaar in een boogvormig kader met de live teller, rechts de titel en
 * een duidelijke "zo doe je mee"-kaart. Alles schaalt mee met de hoogte van
 * het beeld, zodat het op 720p en 1080p binnen één scherm past.
 */
export function ScreenWelcome({
  origin,
  players,
}: {
  origin: string;
  players: Player[];
}) {
  const playerCount = players.length;
  const displayUrl = origin.replace(/^https?:\/\//, "");

  const recentPlayers = useMemo(
    () =>
      [...players]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 5),
    [players]
  );

  return (
    <div className="grid w-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-[5vw]">
      {/* Bruidspaar in een boogkader met de live deelnemersteller */}
      <div className="animate-fade-up relative mx-auto w-fit max-w-full pb-10">
        <div
          aria-hidden
          className="absolute -inset-4 bottom-6 rounded-t-full rounded-b-[2.75rem] border border-lavender-deep/35"
        />
        <div className="relative aspect-[3/4] h-[min(66vh,46rem)] max-w-full overflow-hidden rounded-t-full rounded-b-[2rem] bg-white shadow-2xl ring-8 ring-white/85">
          <Image
            src="/couple/couple-welcome.jpg"
            alt="Het bruidspaar"
            fill
            priority
            sizes="40vw"
            className="animate-hero-kenburns object-cover object-[50%_22%]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/35 to-transparent"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-5 whitespace-nowrap rounded-3xl bg-white/95 px-8 py-4 shadow-xl ring-1 ring-black/5">
          <span className="relative flex h-4 w-4">
            <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-mint-deep" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-mint-deep" />
          </span>
          <span
            key={playerCount}
            className="animate-pop-in font-display text-7xl font-semibold leading-none tabular-nums text-ink"
          >
            {playerCount}
          </span>
          <span className="text-lg font-semibold uppercase leading-tight tracking-wide text-ink-soft">
            {playerCount === 1 ? "deelnemer" : "deelnemers"}
            <br />
            {playerCount === 1 ? "doet mee" : "doen mee"}
          </span>
        </div>
      </div>

      {/* Titel + zo doe je mee */}
      <div className="flex flex-col gap-[3vh]">
        <div className="animate-fade-up space-y-2" style={{ animationDelay: "120ms" }}>
          <p className="flex items-center gap-4 text-lg font-semibold uppercase tracking-[0.4em] text-ink-soft">
            <span aria-hidden className="h-px w-14 bg-ink-soft/40" />
            Erik &amp; Cas
          </p>
          <p className="font-display text-[clamp(1.5rem,3.4vh,2.25rem)] italic text-ink-soft">Welkom bij</p>
          <h1 className="whitespace-nowrap font-signature text-[clamp(3.5rem,min(6.8vw,13vh),8.5rem)] leading-[1.1] text-ink">
            De Bruiloftquiz
          </h1>
          <p className="font-display text-[clamp(1.4rem,3vh,1.9rem)] text-ink">Hoe goed ken jij het bruidspaar?</p>
        </div>

        {origin && (
          <div
            className="animate-fade-up flex items-center gap-8 rounded-[2rem] bg-white/75 p-[min(3vh,1.75rem)] shadow-xl ring-1 ring-white backdrop-blur-sm"
            style={{ animationDelay: "240ms" }}
          >
            <div className="shrink-0 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
              <QRCodeSVG
                value={origin}
                size={220}
                className="h-[min(24vh,14rem)] w-[min(24vh,14rem)]"
              />
            </div>
            <div className="min-w-0 space-y-[1.8vh]">
              <ol className="space-y-[1.4vh]">
                {STEPS.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xl font-semibold text-white ${step.color}`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[clamp(1.1rem,2.4vh,1.5rem)] leading-snug text-ink">{step.label}</span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-ink/10 pt-[1.6vh] text-[clamp(1rem,2vh,1.25rem)] text-ink-soft">
                Geen camera? Ga naar{" "}
                <span className="font-semibold text-ink">{displayUrl}</span>
              </p>
            </div>
          </div>
        )}

        <div
          className="animate-fade-up min-h-[3.25rem]"
          style={{ animationDelay: "360ms" }}
        >
          {recentPlayers.length > 0 ? (
            <div className="flex items-center gap-3 overflow-hidden [mask-image:linear-gradient(to_right,black_85%,transparent)]">
              <span className="shrink-0 text-lg font-semibold uppercase tracking-wide text-ink-soft">
                Net binnen
              </span>
              {recentPlayers.map((p) => (
                <span
                  key={p.id}
                  className="animate-pop-in max-w-[12rem] shrink-0 truncate rounded-full bg-white/80 px-5 py-2 text-xl font-semibold text-ink shadow-sm ring-1 ring-black/5"
                >
                  {p.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-display text-2xl italic text-ink-soft">
              Wie is de eerste die meedoet?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
