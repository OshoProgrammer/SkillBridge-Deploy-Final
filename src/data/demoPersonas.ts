/**
 * SkillBridge — Predefined Demo Personas
 *
 * These IDs mirror the seeded officer accounts in `src/data/seedData.ts`
 * (INITIAL_USERS) that power the one-click "Registered Officers" demo cards.
 *
 * They are the ONLY accounts allowed to start a session without real
 * credentials (security passkey / Gmail OTP). This whitelist is used by both
 * the server (`/api/auth/demo-login`) and the client so that:
 *   - Demo Personas bypass the password + OTP flow and enter the demo experience.
 *   - Every real / newly registered officer keeps the normal authentication
 *     and Gmail OTP flow exactly as before.
 */
export const DEMO_PERSONA_IDS = [
  'user-learner',
  'user-admin',
  'user-hr',
  'user-manager',
  'user-trainer',
  'user-sme',
] as const;

export function isDemoPersonaId(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false;
  const clean = id.trim().toLowerCase();
  return (DEMO_PERSONA_IDS as readonly string[]).includes(clean);
}
