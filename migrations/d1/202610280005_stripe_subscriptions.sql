-- Stripe recurring subscriptions for paid Linguafly learner access.
CREATE TABLE IF NOT EXISTS learning_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  status TEXT NOT NULL,
  current_period_end TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_learning_subscriptions_email_status
  ON learning_subscriptions(email, status);
CREATE INDEX IF NOT EXISTS idx_learning_subscriptions_customer
  ON learning_subscriptions(stripe_customer_id);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
