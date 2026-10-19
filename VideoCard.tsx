import Link from "next/link";
import type { Video } from "@/db/schema";
import { formatBytes, timeAgo, youtubeThumb } from "@/lib/format";

export default function VideoCard({ video }: { video: Video }) {
  const thumb = video.sourceType === "link" ? youtubeThumb(video.source) : null;
  const isFile = video.sourceType === "file";

  return (
    <Link href={`/watch/${video.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition group-hover:ring-red-600/60">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={video.title} className="h-full w-full object-cover" loading="lazy" />
        ) : isFile ? (
          <video
            src={`/api/videos/${video.id}/stream#t=0.5`}
            preload="metadata"
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </div>
        {isFile && video.size > 0 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {formatBytes(video.size)}
          </span>
        )}
        {!isFile && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            LINK
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-sm font-bold text-white">
          {video.title.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 group-hover:text-white">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            {video.views} views · {timeAgo(new Date(video.createdAt))}
          </p>
        </div>
      </div>
    </Link>
  );
}
