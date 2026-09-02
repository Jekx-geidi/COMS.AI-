import { APP_TIMEZONE } from "./timezone";

export function formatTime(iso?: string): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: APP_TIMEZONE,
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function formatTimeRange(startAt?: string, endAt?: string): string | undefined {
  const start = formatTime(startAt);
  const end = formatTime(endAt);
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  return undefined;
}

export function formatFullDateTime(iso?: string): string | undefined {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: APP_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeVerified(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
