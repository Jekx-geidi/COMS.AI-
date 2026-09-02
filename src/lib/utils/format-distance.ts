// "620 m away" / "1.4 km away" — the concrete distance is what makes
// MATCH_NEARBY useful instead of a bare yes/no ("outage nearby" alone tells
// a resident nothing actionable).
export function formatDistanceAway(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}
