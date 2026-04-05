export const FREE_LIMITS = {
  prompts: 3,
  uploads: 2,
} as const;

export type UsageRow = {
  prompts_used: number;
  uploads_used: number;
  is_subscribed: boolean;
  dodo_subscription_id: string | null;
  subscription_status: string | null;
};
