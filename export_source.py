#!/usr/bin/env python3
"""Export approved source files, never environment secrets or user uploads."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import stat
import zipfile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "downloads"
ROOT_FILES = [
    ".gitignore", ".dockerignore", ".env.example", "README.md", "DEPLOY.md",
    "Dockerfile", "docker-compose.yml", "railway.json", "render.yaml", "start.sh",
    "package.json", "package-lock.json", "next.config.ts", "next-env.d.ts",
    "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs", "drizzle.config.ts",
]
SOURCE_DIRS = ["src", "scripts", "public"]
EXTENSIONS = {
    ".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md", ".txt", ".py",
    ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff", ".woff2",
    ".ttf", ".sh", ".yaml", ".yml",
}
BLOCKED_PARTS = {
    "node_modules", ".next", ".git", ".github", "uploads", "downloads", "__pycache__",
}


def export():
    paths = []
    for name in ROOT_FILES:
        path = ROOT / name
        if not path.is_file() or path.is_symlink():
            raise RuntimeError(f"Required source file missing: {name}")
        paths.append(path)

    for directory in SOURCE_DIRS:
        for path in sorted((ROOT / directory).rglob("*")):
            relative = path.relative_to(ROOT)
            if not path.is_file() or path.is_symlink():
                continue
            if BLOCKED_PARTS.intersection(relative.parts):
                continue
            if path.name.startswith(".env") or path.suffix.lower() not in EXTENSIONS:
                continue
            paths.append(path)

    OUTPUT.mkdir(parents=True, exist_ok=True)
    archive_path = OUTPUT / "search-ok-source.zip"
    temp_path = OUTPUT / "search-ok-source.zip.tmp"
    names = []
    with zipfile.ZipFile(temp_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(set(paths)):
            name = path.relative_to(ROOT).as_posix()
            names.append(name)
            entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            entry.create_system = 3
            permissions = 0o755 if name == "start.sh" else 0o644
            entry.external_attr = (stat.S_IFREG | permissions) << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(entry, path.read_bytes())
    temp_path.replace(archive_path)

    manifest = {
        "file": archive_path.name,
        "sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
        "bytes": archive_path.stat().st_size,
        "files": len(names),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    (OUTPUT / "source-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Exported {len(names)} source files: {archive_path.name} ({manifest['bytes']:,} bytes)")
    print(f"SHA-256: {manifest['sha256']}")
    assert ".env" not in names
    assert not any(n.startswith(("uploads/", ".github/", "public/downloads/")) for n in names)


if __name__ == "__main__":
    export()
