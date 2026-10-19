"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VideoActions({
  id,
  title,
  description,
}: {
  id: number;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [t, setT] = useState(title);
  const [d, setD] = useState(description);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function save() {
    if (!t.trim()) return;
    setBusy(true);
    await fetch(`/api/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t, description: d }),
    });
    setBusy(false);
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this video permanently?")) return;
    setBusy(true);
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50";

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={share} className={btn}>
          {copied ? "Link copied!" : "Share"}
        </button>
        <button onClick={() => setEditing(true)} className={btn}>
          Edit
        </button>
        <button onClick={remove} disabled={busy} className={`${btn} text-red-400 hover:bg-red-950/40`}>
          Delete
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold">Edit video</h3>
            <label className="mt-4 block text-xs font-medium text-zinc-400">Title</label>
            <input
              value={t}
              onChange={(e) => setT(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <label className="mt-4 block text-xs font-medium text-zinc-400">Description</label>
            <textarea
              value={d}
              onChange={(e) => setD(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(false)} className={btn}>
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy || !t.trim()}
                className="rounded-full bg-red-600 px-5 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
