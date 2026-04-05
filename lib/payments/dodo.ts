import DodoPayments from "dodopayments";

let _client: DodoPayments | null = null;

/** Lazily initialise the Dodo client so it is never created at build time. */
export function getDodo(): DodoPayments {
  if (!_client) {
    _client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
      environment:
        (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") ?? "test_mode",
      webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    });
  }
  return _client;
}
