"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole, Radio } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 text-sm text-text-secondary">
          Loading secure sign-in…
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("We could not sign you in. Check your staff credentials and try again.");
        return;
      }

      const nextPath = searchParams.get("next");
      router.replace(nextPath?.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Staff authentication is not available right now. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <ThemeToggle className="absolute right-4 top-4" />
      <section className="w-full max-w-md overflow-hidden rounded-panel bg-bg-1/95 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <div className="bg-bg-2/35 px-6 py-6">
          <Logo className="h-7 w-auto" />
          <span className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-cyan">
            <Radio className="h-3 w-3" aria-hidden="true" /> COMS.AI staff access
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            This space is restricted to authorized operations staff. Resident features never require an account.
          </p>
        </div>

        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Work email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-control bg-bg-0 px-3 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:ring-2 focus:ring-brand-cyan/45"
              placeholder="name@organization.com"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-control bg-bg-0 px-3 text-text-primary outline-none transition-colors focus:ring-2 focus:ring-brand-cyan/45"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-control bg-status-critical/10 px-3 py-2 text-sm text-status-critical">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-control bg-brand-cyan px-4 text-sm font-bold text-text-on-accent transition-colors hover:bg-brand-cyan-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in to operations"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}
