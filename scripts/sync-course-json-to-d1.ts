/**
 * Syncs src/content/cursos/**/unitN.json to a lossless D1 JSON mirror.
 *
 * Usage:
 *   npx tsx scripts/sync-course-json-to-d1.ts --sql-out-dir /tmp/d1-course-seed
 *
 * Generates batched idempotent SQL files, one per ten source units. It does not connect to D1;
 * the deploy workflow executes the generated files after applying migrations.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "src", "content", "cursos");
const outputArg = process.argv.findIndex((arg) => arg === "--sql-out-dir");
if (outputArg < 0 || !process.argv[outputArg + 1]) {
  console.error("Usage: sync-course-json-to-d1.ts --sql-out-dir <directory>");
  process.exit(1);
}
const OUT = path.resolve(process.argv[outputArg + 1]);

function sqlString(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

function unitNumberFromFile(file: string): number | null {
  const match = /^unit(\d+)\.json$/i.exec(file);
  return match ? Number(match[1]) : null;
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Course source directory missing: ${SOURCE_ROOT}`);
  const courseDirs = fs.readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const records: Array<{
    courseKey: string; level: string; unitNumber: number; unitId: string;
    title: string; sourcePath: string; hash: string; content: string;
  }> = [];

  for (const courseKey of courseDirs) {
    const dir = path.join(SOURCE_ROOT, courseKey);
    const files = fs.readdirSync(dir)
      .filter((file) => unitNumberFromFile(file) !== null)
      .sort((a, b) => unitNumberFromFile(a)! - unitNumberFromFile(b)!);

    const seen = new Set<number>();
    for (const file of files) {
      const unitNumber = unitNumberFromFile(file)!;
      if (seen.has(unitNumber)) throw new Error(`Duplicate unit number in ${courseKey}: ${unitNumber}`);
      seen.add(unitNumber);

      const absolutePath = path.join(dir, file);
      const raw = fs.readFileSync(absolutePath, "utf8");
      let parsed: any;
      try { parsed = JSON.parse(raw); }
      catch (error) { throw new Error(`Invalid JSON in ${path.relative(ROOT, absolutePath)}: ${String(error)}`); }

      if (!parsed || typeof parsed !== "object" || !parsed.course || !Array.isArray(parsed.blocks)) {
        throw new Error(`Unexpected course-unit schema: ${path.relative(ROOT, absolutePath)}`);
      }
      if (!parsed.course.level || !parsed.course.unit_id || !parsed.course.unit_title) {
        throw new Error(`Missing course metadata in ${path.relative(ROOT, absolutePath)}`);
      }
      for (const block of parsed.blocks) {
        if (!block || !Array.isArray(block.content)) {
          throw new Error(`Invalid block.content in ${path.relative(ROOT, absolutePath)}`);
        }
      }

      const content = JSON.stringify(parsed);
      records.push({
        courseKey,
        level: String(parsed.course.level).toUpperCase(),
        unitNumber,
        unitId: String(parsed.course.unit_id),
        title: String(parsed.course.unit_title),
        sourcePath: path.relative(ROOT, absolutePath).split(path.sep).join("/"),
        hash: createHash("sha256").update(content).digest("hex"),
        content,
      });
    }
  }

  if (!records.length) throw new Error("No unitN.json course files found; refusing to produce an empty sync.");
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const statements = records.map((record) => `INSERT INTO learning_course_json_units
  (course_key, level, unit_number, unit_id, title, source_path, content_hash, content_json, updated_at)
VALUES
  (${sqlString(record.courseKey)}, ${sqlString(record.level)}, ${record.unitNumber},
   ${sqlString(record.unitId)}, ${sqlString(record.title)}, ${sqlString(record.sourcePath)},
   ${sqlString(record.hash)}, ${sqlString(record.content)}, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
ON CONFLICT(course_key, unit_number) DO UPDATE SET
  level = excluded.level,
  unit_id = excluded.unit_id,
  title = excluded.title,
  source_path = excluded.source_path,
  content_hash = excluded.content_hash,
  content_json = excluded.content_json,
  updated_at = excluded.updated_at;`);

  // Keep SQL files comfortably below D1 request-size limits while avoiding one
  // network round trip per unit.
  const chunkSize = 10;
  for (let start = 0; start < statements.length; start += chunkSize) {
    const chunk = statements.slice(start, start + chunkSize);
    const filename = `batch-${String(Math.floor(start / chunkSize) + 1).padStart(3, "0")}.sql`;
    fs.writeFileSync(path.join(OUT, filename), chunk.join("\n"));
  }

  const byCourse = records.reduce<Record<string, number>>((counts, record) => {
    counts[record.courseKey] = (counts[record.courseKey] ?? 0) + 1;
    return counts;
  }, {});
  console.log(`[course-json-sync] Validated ${records.length} unit files across ${courseDirs.length} course folders.`);
  console.log(`[course-json-sync] Generated ${Math.ceil(records.length / 10)} batched idempotent SQL files in ${OUT}.`);
  console.log(JSON.stringify(byCourse, null, 2));
}

main();
