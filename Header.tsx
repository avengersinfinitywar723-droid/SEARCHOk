"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Logo from "./Logo";

export default function Header() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo />
        </Link>

        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-2xl items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos..."
            className="h-10 w-full rounded-l-full border border-zinc-700 bg-zinc-900 px-5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-red-500"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <Link
          href="/upload"
          className="flex shrink-0 items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Upload</span>
        </Link>
      </div>
    </header>
  );
}
