import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { B1_COURSE } from "../src/lib/course/b1";
import { FINAL_TEST_B1_EXERCISES } from "../src/lib/course/b1/final-test-b1";

function sqlString(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

function buildRow(unitNumber: number, unitId: string, title: string, sourcePath: string, exercises: unknown[]) {
  const contentJson = JSON.stringify({
    course: { level: "B1", unit_id: unitId, unit_title: title },
    exercises,
  });
  const hash = createHash("sha256").update(contentJson).digest("hex");
  return `INSERT INTO learning_course_json_units
    (course_key, level, unit_number, unit_id, title, source_path, content_hash, content_json)
    VALUES ('ingles-b1', 'B1', ${unitNumber}, ${sqlString(unitId)}, ${sqlString(title)},
      ${sqlString(sourcePath)}, ${sqlString(hash)}, ${sqlString(contentJson)})
    ON CONFLICT(course_key, unit_number) DO UPDATE SET
      unit_id=excluded.unit_id,
      title=excluded.title,
      source_path=excluded.source_path,
      content_hash=excluded.content_hash,
      content_json=excluded.content_json,
      updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now');`;
}

async function main() {
  if (B1_COURSE.units.length !== 60) {
    throw new Error(`Expected 60 B1 units; found ${B1_COURSE.units.length}.`);
  }

  const statements = B1_COURSE.units.map((unit) => {
    if (!Array.isArray(unit.exercises) || unit.exercises.length < 60) {
      throw new Error(`B1 unit ${unit.id} has incomplete exercise data.`);
    }
    const unitRowId = `b1-unit-${String(unit.id).padStart(3, "0")}`;
    return [
      buildRow(
        unit.id,
        `U${unit.id}`,
        unit.title,
        `src/lib/course/b1/unit-${unit.id}-lessons-index.ts`,
        unit.exercises,
      ),
      `UPDATE units SET title=${sqlString(unit.title)} WHERE id=${sqlString(unitRowId)};`,
    ].join("\\n");
  });

  if (!Array.isArray(FINAL_TEST_B1_EXERCISES) || FINAL_TEST_B1_EXERCISES.length === 0) {
    throw new Error("B1 final test has no exercises.");
  }
  statements.push(buildRow(
    61,
    "B1-FINAL",
    "Test final B1",
    "src/lib/course/b1/final-test-b1.ts",
    FINAL_TEST_B1_EXERCISES,
  ));

  const directory = mkdtempSync(join(tmpdir(), "b1-d1-"));
  const sqlFile = join(directory, "b1-course.sql");
  try {
    writeFileSync(sqlFile, statements.join("\n\n"), "utf8");
    execFileSync("npx", [
      "wrangler", "d1", "execute", "linguafly-learning",
      "--remote", `--file=${sqlFile}`, "--json",
    ], { stdio: "inherit", env: process.env });
    process.stdout.write(`Synced ${B1_COURSE.units.length} B1 units and ${FINAL_TEST_B1_EXERCISES.length} final-test exercises to D1.\n`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("[sync-b1-course-to-d1]", error);
  process.exitCode = 1;
});
