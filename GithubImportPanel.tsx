"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildGithubEditorUrl,
  buildImportWorkflow,
  DEFAULT_REPOSITORY,
  parseRepository,
  WORKFLOW_PATH,
} from "@/lib/github-import";

export default function GithubImportPanel() {
  const [repository, setRepository] = useState(DEFAULT_REPOSITORY);
  const [workflow, setWorkflow] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const cleanRepository = parseRepository(repository);

  useEffect(() => {
    const controller = new AbortController();
    setError("");
    setWorkflow("");
    async function load() {
      try {
        const res = await fetch("/downloads/source-manifest.json", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Source download abhi available nahi hai. Dobara try karo.");
        const manifest = (await res.json()) as { sha256?: string };
        setWorkflow(
          buildImportWorkflow(`${window.location.origin}/downloads/search-ok-source.zip`, manifest.sha256 ?? ""),
        );
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Download load nahi ho saka.");
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const editorUrl = useMemo(() => {
    if (!cleanRepository || !workflow) return null;
    return buildGithubEditorUrl(cleanRepository, workflow);
  }, [cleanRepository, workflow]);

  async function copyWorkflow() {
    try {
      await navigator.clipboard.writeText(workflow);
      setNotice("Import file copy ho gayi. GitHub editor khaali ho to wahan paste kar do.");
    } catch {
      setShowCode(true);
      setNotice("Neeche text box mein long-press karke Select all → Copy karo.");
    }
  }

  const external = "text-sm font-medium text-red-400 underline decoration-red-500/40 underline-offset-4 hover:text-red-300";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-7">
        <label htmlFor="github-repository" className="text-sm font-semibold text-white">Aapki GitHub repository</label>
        <input
          id="github-repository"
          value={repository}
          onChange={(event) => setRepository(event.target.value)}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-describedby="repository-help"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-xs outline-none focus:border-red-500 sm:text-sm"
        />
        <p id="repository-help" className={`mt-2 text-xs ${cleanRepository ? "text-zinc-400" : "text-amber-400"}`}>
          {cleanRepository ? "Repository ka naam screenshot se liya hai. Sahi ho to aage badho." : "Format: username/repository — ya poora GitHub repository link paste karo."}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {editorUrl ? (
            <a
              href={editorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-red-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-red-500"
            >
              GitHub mein code add karo ↗
            </a>
          ) : (
            <button disabled className="rounded-full bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-500">
              {error ? "Import ready nahi hai" : cleanRepository ? "Source package load ho raha hai…" : "Repository naam check karo"}
            </button>
          )}
          <button
            onClick={copyWorkflow}
            disabled={!workflow}
            className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
          >
            Import file copy karo
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Button GitHub ka editor kholega. Wahan aapko <strong className="text-zinc-200">Commit changes</strong> karna hai.
          Is page ne abhi aapki repository mein koi code push nahi kiya hai.
        </p>
        {error && (
          <div role="alert" className="mt-4 rounded-lg border border-amber-900 bg-amber-950/30 p-3 text-sm text-amber-300">
            {error}{" "}
            <button onClick={() => setAttempt((n) => n + 1)} className="underline">Dobara load karo</button>
          </div>
        )}
        {notice && <p role="status" className="mt-3 text-sm text-emerald-400">{notice}</p>}
      </section>

      <ol className="space-y-5">
        <li className="rounded-2xl border border-zinc-800 p-5">
          <h2 className="flex items-center gap-3 font-bold"><StepNumber n={1} /> GitHub editor kholo</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Upar laal button dabao. GitHub login pooche to apne account se login karo.
            File ka naam <code className="break-all text-xs text-red-300">{WORKFLOW_PATH}</code> aur uska text bhara hona chahiye.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Text khaali ho? Is page par wapas aao → <strong>Import file copy karo</strong> → GitHub editor mein paste karo.
          </p>
        </li>
        <li className="rounded-2xl border border-zinc-800 p-5">
          <h2 className="flex items-center gap-3 font-bold"><StepNumber n={2} /> Commit changes dabao</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            GitHub mein <strong>Commit changes…</strong> dabao. Agar option aaye to <strong>Commit directly to main</strong> chuno,
            phir dobara <strong>Commit changes</strong> dabao. Sirf editor kholne se files save nahi hoti hain.
          </p>
          <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Guide illustration — asli screen thodi alag ho sakti hai</p>
            <p className="mt-3 text-sm font-bold">Commit changes</p>
            <div className="mt-2 rounded border border-slate-300 bg-white p-2 text-xs">Import SEARCH OK website</div>
            <p className="my-3 text-xs">◉ Commit directly to the main branch</p>
            <span className="inline-block rounded-md bg-green-700 px-4 py-2 text-xs font-bold text-white">Commit changes</span>
          </div>
        </li>
        <li className="rounded-2xl border border-zinc-800 p-5">
          <h2 className="flex items-center gap-3 font-bold"><StepNumber n={3} /> Actions complete hone do</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            GitHub ke <strong>Actions</strong> tab mein <strong>Add SEARCH OK website</strong> chalega. Green tick aane par
            <strong> Code</strong> tab kholo — ab website ki files dikhni chahiye. Ismein kuch minute lag sakte hain.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
            {cleanRepository && (
              <>
                <a href={`https://github.com/${cleanRepository}/actions/workflows/add-search-ok.yml`} target="_blank" rel="noopener noreferrer" className={external}>Actions kholo ↗</a>
                <a href={`https://github.com/${cleanRepository}`} target="_blank" rel="noopener noreferrer" className={external}>Repository mein files dekho ↗</a>
              </>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            Run start na ho to Actions enable karo, phir is workflow ka <strong>Run workflow</strong> dabao.
            Existing <code>src/</code> ya <code>package.json</code> mile to importer overwrite karne ke bajaye ruk jayega.
          </p>
        </li>
      </ol>

      <div className="rounded-2xl border border-emerald-900/70 bg-emerald-950/20 p-5">
        <h2 className="text-sm font-bold text-emerald-300">Code tab mein ye dikhna chahiye</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-zinc-200">
          {["src/", "public/", "package.json", "package-lock.json", "Dockerfile", "README.md"].map((file) => <div key={file} className="rounded bg-zinc-950/60 px-3 py-2">{file}</div>)}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Sirf README ya ZIP dikhne ka matlab poora code add nahi hua. Code GitHub par add hone ke baad hosting alag step hai.
        </p>
      </div>

      <details className="rounded-2xl border border-zinc-800 p-5">
        <summary className="cursor-pointer text-sm font-semibold">ZIP download / manual upload</summary>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          ZIP download karo → Extract karo → computer par GitHub ke <strong>Upload files</strong> mein saare extracted
          folders aur files upload karo. Folder paths same rehne chahiye aur <code>package.json</code> repo root par hona chahiye.
          Phone par folders upload karne ke bajaye upar wala import behtar hai.
        </p>
        <a href="/downloads/search-ok-source.zip" download="search-ok-source.zip" className="mt-4 inline-block rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-700">Poori website ZIP download ↓</a>
        <p className="mt-3 text-xs text-amber-300">Sirf ZIP ko GitHub par upload mat karna. GitHub use apne aap extract nahi karta.</p>
      </details>

      <details open={showCode} onToggle={(event) => setShowCode(event.currentTarget.open)} className="rounded-2xl border border-zinc-800 p-5">
        <summary className="cursor-pointer text-sm font-semibold">Import file ka text / troubleshooting</summary>
        <label htmlFor="workflow-source" className="mt-4 block break-all font-mono text-xs text-zinc-400">{WORKFLOW_PATH}</label>
        <textarea id="workflow-source" readOnly value={workflow} onFocus={(event) => event.target.select()} rows={12} className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 outline-none focus:border-red-500" />
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          403 / permission error: repository Settings → Actions → General → Workflow permissions check karo.
          Organization policies ya protected branch import ko rok sakti hain; us case mein manual ZIP upload use karo.
          Apna password ya personal access token chat mein mat bhejna.
        </p>
      </details>
      <p className="text-center text-xs leading-relaxed text-zinc-500">
        Import preview ke available rehne tak karo. Safal import ke baad code aapki GitHub repository mein rahega;
        preview link permanent hosting nahi hai.
      </p>
    </div>
  );
}

function StepNumber({ n }: { n: number }) {
  return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm text-white">{n}</span>;
}
