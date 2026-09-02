import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getStaffAccess } from "@/lib/auth/require-staff";
import { SourceUploadForm } from "@/features/sources/components/source-upload-form";

export default async function AdminSourcesPage() {
  const access = await getStaffAccess();

  if (access.state === "unauthenticated") redirect("/admin/login?next=/admin/sources");

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
      <section className="mx-auto max-w-3xl">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to admin
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold">Upload VECO / source updates</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Capture the raw advisory exactly as published — text and/or a file. This is evidence capture only: it
          is stored for review and is not shown to residents until it goes through verification and publishing
          (a later stage).
        </p>
        <div className="mt-6">
          <SourceUploadForm />
        </div>
      </section>
    </main>
  );
}
