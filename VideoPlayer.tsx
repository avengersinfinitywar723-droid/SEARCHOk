"use client";

import { useEffect } from "react";

export default function VideoPlayer({
  id,
  src,
  embed,
  mimeType,
}: {
  id: number;
  src: string;
  embed: string | null;
  mimeType: string;
}) {
  useEffect(() => {
    fetch(`/api/videos/${id}/view`, { method: "POST" }).catch(() => {});
  }, [id]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-zinc-800">
      {embed ? (
        <iframe
          src={`${embed}?autoplay=1&rel=0`}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <video key={src} controls autoPlay playsInline className="h-full w-full" preload="metadata">
          <source src={src} type={mimeType.startsWith("video/") && mimeType !== "video/url" ? mimeType : undefined} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
