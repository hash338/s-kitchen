import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export const Route = createFileRoute("/s-kitchen-staff-2024")({
  head: () => ({
    meta: [
      { title: "Staff Access — S-Kitchen" },
      { name: "description", content: "Private staff access for S-Kitchen." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Staff Access — S-Kitchen" },
      { property: "og:description", content: "Private staff access for S-Kitchen." },
    ],
  }),
  component: StaffLogin,
});

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function StaffLogin() {
  const navigate = useNavigate();
  const { session } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) void navigate({ to: "/admin" });
  }, [session, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setError(null);
    setBusy(true);

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
      setBusy(false);
      if (signInError) {
        setError("Wrong email or password.");
        return;
      }
      void navigate({ to: "/admin" });
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      ...parsed.data,
      options: { emailRedirectTo: `${window.location.origin}/s-kitchen-staff-2024` },
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    toast.success("Account created. Check your email to confirm, then sign in.");
    setMode("signin");
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-20">
      <div className="rounded-2xl border border-gold/40 bg-card p-7 shadow-gold">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-gold">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="font-display text-2xl text-gold-gradient">Staff access</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is for S-Kitchen staff only.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={fieldClass}
            />
          </div>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
          }}
          className="mt-4 w-full text-xs text-muted-foreground transition-colors hover:text-gold"
        >
          {mode === "signin"
            ? "First time? Create the staff account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
