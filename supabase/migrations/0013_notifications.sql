-- COMS.AI: notification queue/history.
-- ADAPTED from Core Docs/DATABASE-STRUCTURE.md #16: device_id instead of
-- user_id (no resident login — see README "Architecture decision").

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  outage_event_id uuid references outage_events(id) on delete cascade,
  event_version_id uuid references outage_event_versions(id),
  user_place_id uuid references user_places(id) on delete cascade,
  notification_type notification_type not null,
  channel notification_channel not null,
  title text not null,
  body text not null,
  idempotency_key text not null unique,
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivery_status text not null default 'PENDING',
  opened_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists notifications_device_idx on notifications(device_id);
create index if not exists notifications_schedule_idx on notifications(scheduled_at, delivery_status);
