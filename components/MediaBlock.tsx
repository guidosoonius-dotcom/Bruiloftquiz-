"use client";

import { useState } from "react";
import Image from "next/image";

export function MediaBlock({
  imageUrl,
  videoUrl,
  size = "default",
  fill = false,
}: {
  imageUrl?: string;
  videoUrl?: string;
  /** "large" voor het beamerscherm: meer ruimte, geen bijsnijden */
  size?: "default" | "large";
  /**
   * True wanneer een omringende flex-kolom al een hoogte bepaalt (het brede
   * beamerscherm naast de vraagtekst) — de media vult dan die kolom volledig
   * i.p.v. een vaste vh-hoogte te claimen, zodat het altijd binnen het
   * scherm past.
   */
  fill?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        controls
        playsInline
        autoPlay={size === "large"}
        className={
          fill
            ? "h-full max-h-full w-full rounded-3xl bg-black/5 object-contain shadow-md"
            : size === "large"
              ? "mx-auto aspect-video max-h-[55vh] w-full rounded-3xl bg-black/5 shadow-md"
              : "w-full rounded-2xl bg-black/5 shadow-sm"
        }
      />
    );
  }

  if (imageUrl && !imageFailed) {
    if (fill || size === "large") {
      // Geen omhullende kaart met achtergrondkleur: de foto krijgt zelf de
      // ronding en schaduw, en de doos rondom krimpt mee met de werkelijke
      // (bijgesneden) afmetingen. Zo blijft er geen wit kader over als de
      // beeldverhouding van de foto niet exact past bij de beschikbare ruimte.
      // next/image's fill-modus vereist juist een doos die de volle ruimte
      // opvult, dus hiervoor een gewone <img> die zelf op inhoud krimpt.
      return (
        <div className={fill ? "flex h-full w-full items-center justify-center" : "flex h-[55vh] w-full items-center justify-center"}>
          {/* eslint-disable-next-line @next/next/no-img-element -- moet op eigen inhoud krimpen i.p.v. de omringende doos vullen, wat next/image's fill-modus niet ondersteunt */}
          <img
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full rounded-3xl object-contain shadow-md"
            onError={() => setImageFailed(true)}
          />
        </div>
      );
    }
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/60 shadow-sm">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return null;
}
