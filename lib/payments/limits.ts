export const FREE_LIMITS = {
      prompts: 5,
      uploads: 3,
      windowHours: 24,
} as const;

export type UsageRow = {
      prompts_used: number;
      uploads_used: number;
      is_subscribed: boolean;
      dodo_subscription_id: string | null;
      subscription_status: string | null;
      last_reset_at: string | null;
};

/** Returns true if the usage window has expired and counters should be reset. */
export function isWindowExpired(lastResetAt: string | null): boolean {
      if (!lastResetAt) return true;
      const elapsed = Date.now() - new Date(lastResetAt).getTime();
      return elapsed >= FREE_LIMITS.windowHours * 60 * 60 * 1000;
}
