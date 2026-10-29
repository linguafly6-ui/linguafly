import { getSessionUser } from "@/lib/learning/auth";

/**
 * Compatibility wrapper retained for the older A2 exercise route.
 * Session identity is resolved from the request cookie by the shared auth module.
 */
export async function getLearningSession(request?: Request) {
  if (!request) return null;
  const { user } = await getSessionUser(request);
  return user ? { userId: user.id, email: user.email } : null;
}
