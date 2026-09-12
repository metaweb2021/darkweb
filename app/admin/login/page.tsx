"use client";

import { useActionState } from "react";
import { adminLogin, type LoginResult } from "./actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginResult | null, FormData>(
    adminLogin,
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-xs text-muted-2 mb-2">~/ admin</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin{" "}
            <span className="text-primary text-glow">Login</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Authenticate to access the dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <form action={action} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="admin"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {state && !state.success && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Authenticating…" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center font-mono text-xs text-muted-2">
          DARKHACK — Admin Portal
        </p>
      </div>
    </div>
  );
}
