export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className={`flex items-center gap-2 ${big ? "text-3xl" : "text-lg"} font-extrabold tracking-tight`}>
      <span
        className={`flex ${big ? "h-12 w-16" : "h-7 w-10"} items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-900/40`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={big ? "h-7 w-7" : "h-4 w-4"}>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
      <span>
        <span className="text-white">SEARCH</span> <span className="text-red-500">OK</span>
      </span>
    </span>
  );
}
