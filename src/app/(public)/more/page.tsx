import Link from "next/link";

const ITEMS = [
  { label: "Calendar", href: "/calendar" },
  { label: "My Places", href: "/my-places" },
  { label: "Preparedness", href: "/preparedness" },
  { label: "Community", href: "/community" },
  { label: "Settings", href: "/settings" },
];

// Mobile-only overflow menu (UXS.md #24 bottom nav "MORE" item).
export default function MorePage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-2 font-display text-lg font-semibold">More</h1>
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-panel border border-border-subtle bg-bg-1 px-4 py-3 text-sm font-medium"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
