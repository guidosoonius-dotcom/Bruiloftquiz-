"use client";

import { useState } from "react";
import Image from "next/image";

export function MediaBlock({
  imageUrl,
  videoUrl,
  size = "default",
}: {
  imageUrl?: string;
  videoUrl?: string;
  /** "large" voor het beamerscherm: meer ruimte, geen bijsnijden */
  size?: "default" | "large";
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        controls
        playsInline
        className={
          size === "large"
            ? "mx-auto aspect-video max-h-[55vh] w-full rounded-3xl bg-black/5 shadow-md"
            : "w-full rounded-2xl bg-black/5 shadow-sm"
        }
      />
    );
  }

  if (imageUrl && !imageFailed) {
    if (size === "large") {
      return (
        <div className="relative mx-auto h-[55vh] w-full overflow-hidden rounded-3xl bg-white/60 shadow-md">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-contain"
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
