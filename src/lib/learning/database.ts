import { resolveCloudflareEnv } from "@/lib/db/client";

/**
 * Returns the isolated learning-content database.
 *
 * Keep resolveCloudflareEnv's legacy DB access unchanged: authentication and
 * existing article APIs still use DB. All new academic content and learner
 * progress reads/writes must use LEARNING_DB through this helper.
 */
export async function getLearningDatabase(): Promise<D1Database> {
  const { env } = await resolveCloudflareEnv();
  if (!env.LEARNING_DB) {
    throw new Error("LEARNING_DB binding unavailable");
  }
  return env.LEARNING_DB;
}
