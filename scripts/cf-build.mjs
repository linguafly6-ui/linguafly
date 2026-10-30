#!/usr/bin/env node
/**
 * Cloudflare/OpenNext build wrapper — public articles plus the interactive tutor.
 *
 * The Cloudflare Worker serves the article experience (including D1-backed
 * /api/articles/* routes and SEO basics) and /tutor-ia with its /api/tutor-avatar
 * endpoints. Most course/platform pages and unrelated AI/evaluation APIs remain
 * excluded because the complete Next.js route tree exceeds the Worker bundle
 * limit. This keeps the published speaking tutor and article site on one Worker.
 *
 * This script temporarily moves excluded routes (and swaps a shared file for
 * an article-only version) out of src/app before building, then restores them
 * afterwards — regardless of whether the build succeeded.
 *
 * Usage: node scripts/cf-build.mjs <opennextjs-cloudflare-subcommand...>
 *   e.g. node scripts/cf-build.mjs build
 *        node scripts/cf-build.mjs build preview
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const BACKUP_DIR = path.join(ROOT, '.cf-excluded');

// Route directories (relative to src/app) not needed by the article/tutor
// experience are excluded from the Cloudflare Worker build. These stay
// in git untouched — they're only moved out of the way during `cf:build`.
const EXCLUDED_APP_DIRS = [
  'aplicaciones-para-aprender-ingles',
  'aprender-ingles',
  'certificaciones-ingles-oficiales',
  'content',
  'curso-a1',
  'curso-a2',
  'curso-b1',
  'curso-b2',
  'curso-c1',
  'curso-c2',
  'curso-camarero-a1',
  'curso-camarero-a2',
  'curso-camarero-b1',
  'curso-camarero-b2',
  'curso-logistica-a1',
  'curso-logistica-a2',
  'curso-logistica-b1',
  'curso-logistica-b2',
  'curso-recepcionista-a1',
  'curso-recepcionista-a2',
  'curso-recepcionista-b1',
  'curso-recepcionista-b2',
  'cursos-por-sector',
  'demo-course',
  'fitness',
  'frases-en-ingles',
  'herramientas',
  'ingles-para-viajar',
  'juego-ingles',
  'misiones',
  'podcasts',
  'practice',
  'preview',
  'test-toefl',
  'test-translation',
  'tutor-privado',
  'vocabulario',
  // Blog/course relation map + keyword hub pages — not the D1 article API,
  // and rely on filesystem reads that don't work in Workers anyway.
  path.join('blog', 'ejercicios-relacionados'),
  path.join('blog', 'temas'),
  // Non-article API routes (AI tutor/evaluation, course, translate, etc.)
  path.join('api', 'ai-lab'),
  path.join('api', 'ai-tutor'),
  path.join('api', 'contact'),
  path.join('api', 'course'),
  path.join('api', 'curriculum'),
  path.join('api', 'debug'),
  path.join('api', 'evaluate-answer'),
  path.join('api', 'evaluate-multiple-choice'),
  path.join('api', 'evaluate-response'),
  path.join('api', 'evaluate-sentence-building'),
  path.join('api', 'evaluate-speaking'),
  path.join('api', 'evaluate-speaking-azure'),
  path.join('api', 'evaluate-speaking-part1'),
  path.join('api', 'evaluate-speaking-part2'),
  path.join('api', 'evaluate-speaking-part3'),
  path.join('api', 'evaluate-speaking-part4'),
  path.join('api', 'evaluate-text-answer'),
  path.join('api', 'evaluate-writing'),
  path.join('api', 'game-content'),
  path.join('api', 'generate-audio'),
  path.join('api', 'generate-exercises'),
  path.join('api', 'indexnow'),
  path.join('api', 'pre-generate-exercises'),
  path.join('api', 'roleplay-chat'),
  path.join('api', 'translate'),
  path.join('api', 'translate-cloudflare'),
  path.join('api', 'tts'),
  path.join('api', 'vocabulario'),
];

// Shared files that are replaced with a lightweight, article-only version
// during the Cloudflare build. `swapped` is the file that normally lives in
// git; `cf` is the Cloudflare-only replacement (also tracked in git).
// Preview builds can opt in to the B1 unit pages without changing production builds.
// Keep the default Cloudflare Worker lean; only the dedicated Preview command sets this flag.
const INCLUDE_B1_IN_PREVIEW = process.env.CF_INCLUDE_B1 === '1';
const ACTIVE_EXCLUDED_APP_DIRS = INCLUDE_B1_IN_PREVIEW
  ? EXCLUDED_APP_DIRS.filter((dir) => dir !== 'curso-b1')
  : EXCLUDED_APP_DIRS;

const SWAPPED_FILES = [
  {
    swapped: path.join('src', 'components', 'blog', 'BlogExerciseMapBanner.tsx'),
    cf: path.join('src', 'components', 'blog', 'BlogExerciseMapBanner.cf-stub.tsx'),
  },
];

function moveExcludedDirs() {
  for (const relDir of ACTIVE_EXCLUDED_APP_DIRS) {
    const src = path.join(APP_DIR, relDir);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(BACKUP_DIR, 'app', relDir);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(src, dest);
  }
}

function restoreExcludedDirs() {
  const backupAppDir = path.join(BACKUP_DIR, 'app');
  if (!fs.existsSync(backupAppDir)) return;
  for (const relDir of EXCLUDED_APP_DIRS) {
    const dest = path.join(APP_DIR, relDir);
    const src = path.join(backupAppDir, relDir);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.rmSync(dest, { recursive: true, force: true });
    fs.renameSync(src, dest);
  }
}

function swapFiles() {
  for (const { swapped, cf } of SWAPPED_FILES) {
    const swappedPath = path.join(ROOT, swapped);
    const cfPath = path.join(ROOT, cf);
    const backupPath = path.join(BACKUP_DIR, swapped);
    if (!fs.existsSync(cfPath)) continue;
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    if (fs.existsSync(swappedPath)) fs.renameSync(swappedPath, backupPath);
    fs.mkdirSync(path.dirname(swappedPath), { recursive: true });
    fs.copyFileSync(cfPath, swappedPath);
  }
}

function restoreSwappedFiles() {
  for (const { swapped } of SWAPPED_FILES) {
    const swappedPath = path.join(ROOT, swapped);
    const backupPath = path.join(BACKUP_DIR, swapped);
    if (!fs.existsSync(backupPath)) continue;
    fs.rmSync(swappedPath, { force: true });
    fs.renameSync(backupPath, swappedPath);
  }
}

function prune() {
  if (fs.existsSync(BACKUP_DIR)) {
    // A previous run left the tree pruned (e.g. crashed before restoring).
    // Restore first so we start from a clean, full checkout.
    restoreExcludedDirs();
    restoreSwappedFiles();
    fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
  }
  moveExcludedDirs();
  swapFiles();
}

function restore() {
  restoreExcludedDirs();
  restoreSwappedFiles();
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
}

export { prune, restore, EXCLUDED_APP_DIRS, SWAPPED_FILES };

function generateArticleCanonicals() {
  const result = spawnSync('node', [path.join(ROOT, 'scripts', 'generate-article-canonical-paths.mjs')], {
    stdio: 'inherit',
    cwd: ROOT,
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/cf-build.mjs <opennextjs-cloudflare-subcommand...>');
    process.exit(1);
  }

  generateArticleCanonicals();
  prune();
  console.warn(`[cf-build] Pruned ${ACTIVE_EXCLUDED_APP_DIRS.length} excluded app directories for the Cloudflare build. B1 included: ${INCLUDE_B1_IN_PREVIEW}.`);

  let exitCode = 1;
  try {
    for (const subcommand of args) {
      const result = spawnSync('npx', ['opennextjs-cloudflare', subcommand], {
        stdio: 'inherit',
        cwd: ROOT,
      });
      exitCode = result.status ?? 1;
      if (exitCode !== 0) break;
    }
  } finally {
    restore();
    console.warn('[cf-build] Restored full app tree after Cloudflare build.');
  }

  process.exit(exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
