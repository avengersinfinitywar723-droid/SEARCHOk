import type { Metadata } from "next";
import Link from "next/link";
import GithubImportPanel from "@/components/GithubImportPanel";

export const metadata: Metadata = {
  title: "Website ko GitHub mein add karo | SEARCH OK",
  description: "Import the complete SEARCH OK website into your GitHub repository, or download its source ZIP.",
  robots: { index: false, follow: false },
};

export default function GithubGuidePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/guide" className="text-xs font-medium text-zinc-400 hover:text-white">← Hosting guide</Link>
      <div className="mb-7 mt-5">
        <span className="rounded-full border border-red-900 bg-red-950/40 px-3 py-1 text-xs font-semibold text-red-400">SEARCH OK · GitHub import</span>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">Repo ban gayi. Ab website ka code add karte hain.</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Repository banane se files apne aap nahi aati hain. Neeche ka button GitHub mein import file kholega;
          aapke Commit karne ke baad GitHub Actions poori website ka code add karega.
        </p>
      </div>
      <GithubImportPanel />
    </div>
  );
}
