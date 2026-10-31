import { getSessionUser, sha256 } from "@/lib/learning/auth";
import { getLearningDatabase } from "@/lib/learning/database";

/**
 * Resolve the authenticated legacy account to an opaque learner record.
 *
 * The legacy session remains the sole authentication authority. Only the
 * verified account's stable internal ID is linked; session tokens, token
 * hashes, email addresses, and subscription data are never copied to LEARNING_DB.
 */
export async function getLearningLearner(request: Request): Promise<{
  learnerId: string;
  legacyUserId: string;
} | null> {
  const { user } = await getSessionUser(request);
  if (!user?.id) return null;

  const db = await getLearningDatabase();
  const provider = "linguafly";
  const providerSubject = String(user.id);
  const learnerId = `lrn_${(await sha256(`linguafly-learner:${providerSubject}`)).slice(0, 40)}`;
  const identityId = `lid_${(await sha256(`linguafly-identity:${providerSubject}`)).slice(0, 40)}`;

  // Stable IDs plus INSERT OR IGNORE make concurrent first requests safe and
  // avoid creating duplicate learner identities.
  await db.batch([
    db.prepare(
      `INSERT OR IGNORE INTO learners (id, status)
       VALUES (?, 'active')`
    ).bind(learnerId),
    db.prepare(
      `INSERT OR IGNORE INTO learner_identities
         (id, learner_id, provider, provider_subject)
       VALUES (?, ?, ?, ?)`
    ).bind(identityId, learnerId, provider, providerSubject),
  ]);

  const identity = await db.prepare(
    `SELECT li.learner_id, l.status
     FROM learner_identities li
     INNER JOIN learners l ON l.id = li.learner_id
     WHERE li.provider = ? AND li.provider_subject = ?
     LIMIT 1`
  ).bind(provider, providerSubject).first<{
    learner_id: string;
    status: string;
  }>();

  if (!identity || identity.status !== "active" || identity.learner_id !== learnerId) {
    return null;
  }

  return { learnerId: identity.learner_id, legacyUserId: providerSubject };
}
