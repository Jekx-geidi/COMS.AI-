import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, ShieldCheck, Upload } from "lucide-react";
import { getStaffAccess } from "@/lib/auth/require-staff";

export default async function AdminPage() {
  const access = await getStaffAccess();

  if (access.state === "unauthenticated") redirect("/admin/login?next=/admin");

  if (access.state === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="w-full max-w-lg rounded-panel border border-status-critical/40 bg-bg-1 p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
          <ShieldAlert className="mx-auto h-8 w-8 text-status-critical" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-semibold">Staff access required</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Your account is signed in, but it is not assigned an authorized COMS.AI staff role.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <section className="mx-auto max-w-5xl rounded-panel border border-border-strong bg-bg-1 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-status-stable/30 bg-status-stable/10 text-status-stable">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Protected operations area</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">Welcome{access.staff.displayName ? `, ${access.staff.displayName}` : ""}</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Signed in with the <span className="font-semibold text-text-primary">{access.staff.role.replace("_", " ")}</span> staff role.
            </p>
          </div>
        </div>
        <p className="mt-8 rounded-control border border-border-subtle bg-bg-0/45 px-4 py-4 text-sm leading-relaxed text-text-secondary">
          Capture raw advisories, then review and publish them as verified outage events — visible on the
          public dashboard, Live Map, and Locate Me as soon as they're published.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/admin/sources"
            className="group flex items-center justify-between gap-3 rounded-control border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-brand-cyan/60 hover:bg-brand-cyan/15"
          >
            <span className="flex items-center gap-2.5">
              <Upload className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
              Upload VECO / source updates
            </span>
            <ArrowRight className="h-4 w-4 text-brand-cyan transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          <Link
            href="/admin/advisory-inbox"
            className="group flex items-center justify-between gap-3 rounded-control border border-status-stable/30 bg-status-stable/10 px-4 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-status-stable/60 hover:bg-status-stable/15"
          >
            <span className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-status-stable" aria-hidden="true" />
              Review and publish advisories
            </span>
            <ArrowRight className="h-4 w-4 text-status-stable transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
