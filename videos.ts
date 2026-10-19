import path from "node:path";
import fs from "node:fs";

export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

export function safeFileName(original: string) {
  const ext = path.extname(original).toLowerCase().replace(/[^a-z0-9.]/g, "") || ".mp4";
  const stamp = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  return `${stamp}${ext}`;
}
