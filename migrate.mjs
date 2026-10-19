// Creates the required tables if they don't exist. Runs automatically on container start.
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const ssl = /sslmode=require|neon\.tech|render\.com|supabase\.co/.test(url)
  ? { rejectUnauthorized: false }
  : undefined;

const client = new pg.Client({ connectionString: url, ssl });

const sql = `
CREATE TABLE IF NOT EXISTS videos (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  source_type text NOT NULL DEFAULT 'file',
  source text NOT NULL,
  mime_type text NOT NULL DEFAULT 'video/mp4',
  size bigint NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);`;

for (let attempt = 1; attempt <= 15; attempt++) {
  try {
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log("✓ Database ready");
    process.exit(0);
  } catch (err) {
    console.log(`Database not ready (attempt ${attempt}/15): ${err.message}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
}
console.error("Could not connect to database");
process.exit(1);
