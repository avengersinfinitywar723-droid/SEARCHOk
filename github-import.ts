export const DEFAULT_REPOSITORY = "avengersinfinitywar723-droid/SEARCHOk";
export const WORKFLOW_PATH = ".github/workflows/add-search-ok.yml";

export function parseRepository(input: string): string | null {
  const repository = input
    .trim()
    .replace(/^https?:\/\/(?:www\.)?github\.com\//i, "")
    .replace(/\/$/, "")
    .replace(/\.git$/, "");
  if (!/^[a-z\d][a-z\d-]{0,38}\/[a-z\d_.-]{1,100}$/i.test(repository)) return null;
  const name = repository.split("/")[1];
  if (name === "." || name === "..") return null;
  return repository;
}

export function buildImportWorkflow(sourceUrl: string, sha256: string): string {
  const url = new URL(sourceUrl);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("GitHub import ke liye public HTTPS preview link kholo.");
  }
  if (!/^[a-f\d]{64}$/i.test(sha256)) throw new Error("Source package checksum is invalid.");

  return `# Adds the SEARCH OK source files to this repository after you commit this file.
# Downloads only the archive below, verifies SHA-256, and pushes with GitHub's built-in token.
# Does not need your personal access token. Does not overwrite an existing website.
name: Add SEARCH OK website

on:
  push:
    paths:
      - ".github/workflows/add-search-ok.yml"
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: search-ok-source-import
  cancel-in-progress: false

jobs:
  import:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    env:
      SOURCE_URL: ${JSON.stringify(url.toString())}
      SOURCE_SHA256: "${sha256}"
    steps:
      - name: Check out your repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Protect existing website files
        run: |
          if [ -e package.json ] || [ -e src ]; then
            echo "::error::Website files already exist. Import stopped to avoid overwriting them."
            exit 1
          fi

      - name: Download and verify website source
        run: |
          curl --fail --show-error --silent --location --proto '=https' --retry 2 --max-time 90 "$SOURCE_URL" --output "$RUNNER_TEMP/search-ok-source.zip"
          printf '%s  %s\\n' "$SOURCE_SHA256" "$RUNNER_TEMP/search-ok-source.zip" | sha256sum --check -

      - name: Add website files
        run: |
          unzip -q "$RUNNER_TEMP/search-ok-source.zip" -d .
          mkdir -p public/downloads
          cp "$RUNNER_TEMP/search-ok-source.zip" public/downloads/search-ok-source.zip
          printf '{"sha256":"%s"}\\n' "$SOURCE_SHA256" > public/downloads/source-manifest.json
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add --all -- . ':!.github'
          git commit -m "Add SEARCH OK website source"
          git push origin "HEAD:$GITHUB_REF_NAME"
          printf 'SEARCH OK source added. Open the Code tab to see src, package.json and Dockerfile. Hosting is a separate next step.\\n' >> "$GITHUB_STEP_SUMMARY"
`;
}

export function buildGithubEditorUrl(repository: string, workflow: string): string {
  const clean = parseRepository(repository);
  if (!clean) throw new Error("Invalid GitHub repository.");
  const url = new URL(`https://github.com/${clean}/new/main`);
  url.searchParams.set("filename", WORKFLOW_PATH);
  url.searchParams.set("value", workflow);
  url.searchParams.set("message", "Import SEARCH OK website");
  return url.toString();
}
