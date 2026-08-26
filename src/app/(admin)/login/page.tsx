"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Leaf, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Username atau password salah.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Card container */}
      <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-lg sm:max-w-md sm:p-8">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-3 sm:mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:h-14 sm:w-14">
            <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Login Admin
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Masuk ke CMS E-Katalog Tape Bakung Kidul
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Username field */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-medium text-foreground sm:text-sm">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:h-11"
            />
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-foreground sm:text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:h-11"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60 sm:h-11"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-muted-foreground sm:mt-8">
        © {new Date().getFullYear()} E-Katalog Tape Bakung Kidul
      </p>
    </section>
  );
}
