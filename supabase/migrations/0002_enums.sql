-- COMS.AI: canonical enums (Core Docs/DATABASE-STRUCTURE.md #5)
-- Do not create ad-hoc status strings in application code; use these.

create type outage_status as enum (
  'NORMAL',
  'MONITORING',
  'POSSIBLE',
  'SCHEDULED',
  'CONFIRMED',
  'ONGOING',
  'RESTORING',
  'RESTORED',
  'CANCELLED',
  'COMPLETED',
  'UNKNOWN'
);

create type coverage_type as enum (
  'FULL',
  'PARTIAL',
  'STREET',
  'SITIO',
  'LANDMARK_AREA',
  'POINT',
  'POLYGON',
  'UNKNOWN_EXTENT'
);

create type verification_state as enum (
  'DRAFT',
  'REVIEW_REQUIRED',
  'VERIFIED',
  'REJECTED',
  'SUPERSEDED'
);

create type source_type as enum (
  'UTILITY',
  'GRID_OPERATOR',
  'GOVERNMENT',
  'LGU',
  'SOCIAL_MEDIA',
  'WEBSITE',
  'MANUAL',
  'OTHER'
);

create type report_type as enum (
  'POWER_OUT',
  'POWER_RESTORED',
  'FLICKERING',
  'LOW_VOLTAGE',
  'INTERMITTENT'
);

create type moderation_status as enum (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED'
);

create type notification_type as enum (
  'NEW_ADVISORY',
  'TOMORROW_REMINDER',
  'PREPARATION_REMINDER',
  'STARTING_SOON',
  'EVENT_CHANGED',
  'AREA_CHANGED',
  'CANCELLED',
  'RESTORED',
  'COMMUNITY_CLUSTER'
);

create type notification_channel as enum (
  'IN_APP',
  'WEB_PUSH',
  'EMAIL',
  'SMS',
  'MESSENGER',
  'VIBER',
  'TELEGRAM'
);

-- Staff roles only. Residents never occupy a role here — they have no account.
create type staff_role as enum (
  'MODERATOR',
  'ADMIN',
  'SUPER_ADMIN'
);
