# SEARCH OK

A Next.js video library with file uploads, URL/YouTube videos, search, playback, view counts, and editing. Video metadata is stored in PostgreSQL using Drizzle; uploaded videos are stored on a filesystem volume.

## The repository must contain the code

Creating an empty GitHub repository does not transfer this project automatically. After import, you should see `src/`, `package.json`, `package-lock.json`, `Dockerfile`, and `public/` at the top level of the repository.

### Import from the preview on a phone

Open `/guide/github` on the SEARCH OK preview. Check the repository name, choose **GitHub mein code add karo**, then commit the proposed `.github/workflows/add-search-ok.yml` file directly to `main`. GitHub Actions downloads a SHA-256-verified source ZIP and commits the website files using GitHub's built-in repository token. It will not overwrite an existing `src/` or `package.json`. No personal token needs to be shared.

The import needs the preview's download URL to be reachable. Complete it while the preview is available. If the editor opens blank, use the copy button on the guide and paste the workflow there. If Actions are disabled, enable them in the repository. An organization policy or branch protection can block the import; use manual upload instead in that case.

### Manual ZIP upload

Download `/downloads/search-ok-source.zip` from the preview. Extract it first, then upload the contents to the repository, preserving all folder paths. Do not upload only the ZIP: GitHub does not extract it automatically. A desktop browser supports dragging the folders and files into **Upload files**. A phone's file picker may not preserve directories, so the import workflow is preferable on a phone.

## Run locally

1. Install Node.js 22+ and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Run `npm ci`.
4. Run `npx drizzle-kit push` to create the database tables.
5. Run `npm run dev` and open `http://localhost:3000`.

## Host

See [DEPLOY.md](DEPLOY.md). The Docker image creates the required database table on startup. Set `DATABASE_URL` and mount persistent storage at `/app/uploads` with `UPLOAD_DIR=/app/uploads`.

A GitHub repository is code storage, not the live Next.js server. GitHub Pages cannot run this PostgreSQL-backed application. A stable hosting domain works only while the hosting service and database remain active. Free plans have storage, bandwidth, credit, and availability limits; unlimited video storage is not included.

**Security notice:** This version has no login or owner permissions. Anyone who can reach it can upload, edit, and delete videos. Add access control before using it as a public personal video library. Keep backups of the database and uploaded files.

## Rebuild the shareable source ZIP

With Python 3 installed, run `python3 scripts/export_source.py`. It exports only an explicit list of source/configuration files and approved asset folders, not `.env`, uploads, build output, or dependencies. Generated ZIPs are not nested inside new exports.
