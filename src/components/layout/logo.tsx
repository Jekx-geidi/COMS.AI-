interface LogoProps {
  className?: string;
}

// The wordmark is white for Dark Command Mode; on the light theme the same
// white strokes would disappear against a white panel. Both variants are
// always rendered and CSS (driven by the data-theme attribute on <html>,
// see globals.css) toggles which one is visible — a plain server component,
// so there is no client-only branch to hydrate-mismatch on.
export function Logo({ className }: LogoProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/coms-ai-logo.svg"
        alt="COMS.AI"
        className={`coms-logo-dark ${className ?? ""}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/coms-ai-logo-light.svg"
        alt="COMS.AI"
        className={`coms-logo-light ${className ?? ""}`}
      />
    </>
  );
}
