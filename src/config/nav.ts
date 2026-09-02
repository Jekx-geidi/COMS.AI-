// Public navigation — Core Docs/UXS.md #24-25, adjusted per the no-login
// product decision: My Places lives in the open public nav, not a gated
// "authenticated user" tier (see README "Architecture decision" section).

export interface NavItem {
  label: string;
  href: string;
}

export const MOBILE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Locate", href: "/#locate-me" },
  { label: "AI", href: "/ask-ai" },
  { label: "More", href: "/more" },
];

export const DESKTOP_NAV: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Live Map", href: "/map" },
  { label: "Calendar", href: "/calendar" },
  { label: "Ask COMS", href: "/ask-ai" },
  { label: "My Places", href: "/my-places" },
  { label: "Preparedness", href: "/preparedness" },
  { label: "Community", href: "/community" },
];
