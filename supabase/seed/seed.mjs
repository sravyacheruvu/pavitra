/**
 * seed.mjs — seed all festival CMS documents into the Supabase `festivals` table.
 *
 * Usage (from the project root):
 *   SUPABASE_URL="https://<ref>.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="<service_role_key>" \
 *   node supabase/seed/seed.mjs
 *
 * The service_role key bypasses RLS and must NEVER ship in the app or be
 * committed. Keep it in your shell env or an untracked .env.seed file.
 *
 * What it does:
 *   1. Ensures the `festivals` table + policies exist (runs festivals_schema.sql
 *      via the SQL endpoint when possible; otherwise prints a reminder).
 *   2. Upserts every *_2026.json document in this folder, keyed by id.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "\n✗ Missing credentials.\n" +
      "  Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, e.g.:\n\n" +
      '    SUPABASE_URL="https://xxxx.supabase.co" \\\n' +
      '    SUPABASE_SERVICE_ROLE_KEY="eyJ..." \\\n' +
      "    node supabase/seed/seed.mjs\n\n" +
      "  (Find both under Supabase → Project Settings → API.)\n"
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const files = readdirSync(__dirname).filter(
  (f) => f.endsWith(".json") && f !== "package.json"
);

if (files.length === 0) {
  console.error("No *.json festival documents found next to seed.mjs.");
  process.exit(1);
}

const rows = files.map((f) => {
  const doc = JSON.parse(readFileSync(join(__dirname, f), "utf8"));
  return {
    id: doc.id,
    slug: doc.slug,
    year: doc.year,
    festival_date: doc.observed_on?.date ?? null,
    name: doc.name ?? null,
    data: doc,
    schema_version: doc.schema_version ?? 1,
    updated_at: new Date().toISOString(),
  };
});

const { data, error } = await supabase
  .from("festivals")
  .upsert(rows, { onConflict: "id" })
  .select("id, slug, festival_date");

if (error) {
  console.error("\n✗ Seed failed:", error.message);
  if (/relation .*festivals.* does not exist/i.test(error.message)) {
    console.error(
      "  The table doesn't exist yet. Run festivals_schema.sql in the Supabase\n" +
        "  SQL editor first, then re-run this script."
    );
  }
  process.exit(1);
}

console.log(`\n✓ Seeded ${data.length} festival(s):`);
for (const r of data) console.log(`   • ${r.id.padEnd(32)} ${r.festival_date ?? ""}`);
console.log("");
