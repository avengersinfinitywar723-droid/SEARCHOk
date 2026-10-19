import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { UPLOAD_DIR } from "@/lib/videos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [row] = await db.select().from(videos).where(eq(videos.id, Number(id)));
  if (!row || row.sourceType !== "file") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, path.basename(row.source));
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const total = stat.size;
  const range = req.headers.get("range");
  const baseHeaders: Record<string, string> = {
    "Content-Type": row.mimeType || "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    let start = match && match[1] ? parseInt(match[1], 10) : 0;
    let end = match && match[2] ? parseInt(match[2], 10) : total - 1;
    if (Number.isNaN(start) || start < 0) start = 0;
    if (Number.isNaN(end) || end >= total) end = total - 1;
    if (start > end) {
      return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
    }
    const stream = fs.createReadStream(filePath, { start, end });
    return new NextResponse(Readable.toWeb(stream) as unknown as ReadableStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = fs.createReadStream(filePath);
  return new NextResponse(Readable.toWeb(stream) as unknown as ReadableStream, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(total) },
  });
}
