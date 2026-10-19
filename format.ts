/** Convert a YouTube URL to an embeddable URL, or return null if not YouTube. */
export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2];
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

export function youtubeThumb(url: string): string | null {
  const embed = youtubeEmbed(url);
  if (!embed) return null;
  const id = embed.split("/").pop();
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function formatBytes(bytes: number) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  return `${Math.floor(mo / 12)} yr ago`;
}
