/**
 * Small deterministic spaced-repetition scheduler (SM-2-inspired).
 *
 * This module has no Cloudflare or framework dependencies. Call it from a
 * server-side handler after verifying the learner's identity; persist the
 * returned values in learning_review_items and append learning_review_history.
 *
 * quality: 0 = complete blackout, 1 = incorrect, 2 = incorrect but familiar,
 * 3 = correct with difficulty, 4 = correct, 5 = easy recall.
 */
export type ReviewState = {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
};

export type ReviewResult = ReviewState & {
  dueAt: string;
  reviewedAt: string;
  quality: number;
  wasCorrect: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function scheduleNextReview(
  previous: ReviewState,
  quality: number,
  reviewedAt = new Date().toISOString()
): ReviewResult {
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    throw new RangeError("quality must be an integer between 0 and 5");
  }

  const reviewedDate = new Date(reviewedAt);
  if (Number.isNaN(reviewedDate.getTime())) {
    throw new TypeError("reviewedAt must be a valid ISO date");
  }

  const oldEase = clamp(
    Number.isFinite(previous.easeFactor) ? previous.easeFactor : 2.5,
    1.3,
    3.0
  );
  const oldInterval = Math.max(0, Number.isFinite(previous.intervalDays) ? previous.intervalDays : 0);
  const oldRepetitions = Math.max(0, Math.floor(previous.repetitions || 0));
  const oldLapses = Math.max(0, Math.floor(previous.lapses || 0));

  // SM-2 ease adjustment. Difficult answers reduce future spacing.
  const easeFactor = clamp(
    oldEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    1.3,
    3.0
  );

  let intervalDays: number;
  let repetitions: number;
  let lapses = oldLapses;

  if (quality < 3) {
    intervalDays = 0.04; // approximately one hour; offer a same-session retry too
    repetitions = 0;
    lapses += 1;
  } else if (oldRepetitions === 0) {
    intervalDays = 1;
    repetitions = 1;
  } else if (oldRepetitions === 1) {
    intervalDays = 3;
    repetitions = 2;
  } else {
    intervalDays = Math.min(180, Math.max(1, oldInterval || 3) * easeFactor);
    repetitions = oldRepetitions + 1;
  }

  const dueDate = new Date(reviewedDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    intervalDays: Math.round(intervalDays * 100) / 100,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    lapses,
    dueAt: dueDate.toISOString(),
    reviewedAt: reviewedDate.toISOString(),
    quality,
    wasCorrect: quality >= 3,
  };
}
