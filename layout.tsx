import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SEARCH OK – Unlimited Videos",
  description: "Upload, search and watch unlimited videos on SEARCH OK.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} SEARCH OK · Unlimited Videos ·{" "}
          <a href="/guide" className="text-red-500 hover:underline">
            Hosting Guide
          </a>{" "}
          ·{" "}
          <a href="/guide/github" className="text-red-500 hover:underline">
            Code GitHub mein add karo
          </a>
        </footer>
      </body>
    </html>
  );
}
