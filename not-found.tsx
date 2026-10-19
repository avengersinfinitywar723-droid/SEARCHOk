import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl font-black text-red-600">404</p>
      <p className="mt-3 text-zinc-300">This video could not be found.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
        Back to SEARCH OK
      </Link>
    </div>
  );
}
