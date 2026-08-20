"use client";

import { useState } from "react";
import Image from "next/image";

export function MediaBlock({ imageUrl, videoUrl }: { imageUrl?: string; videoUrl?: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        controls
        playsInline
        className="w-full rounded-2xl bg-black/5 shadow-sm"
      />
    );
  }

  if (imageUrl && !imageFailed) {
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
