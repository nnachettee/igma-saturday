"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function friendlyError(error, mode) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login")) return "Wrong email or password. Try again.";
  if (msg.includes("already registered")) return "This email already has an account. Log in instead.";
  if (msg.includes("password") && msg.includes("6")) return "Use a password with at least 6 characters.";
  if (msg.includes("email") && msg.includes("invalid")) return "That email doesn’t look right. Check it and try again.";
  if (msg.includes("missing")) return error.message;
  return mode === "signup"
    ? "Couldn’t create your account. Check your email and password and try again."
    : "Couldn’t log you in. Check your email and password and try again.";
}

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const prefix = isSignup ? "signup" : "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already logged in? Go straight to the board.
  useEffect(() => {
    try {
      getSupabase()
        .auth.getSession()
        .then(({ data }) => {
          if (data.session) router.replace("/app");
        });
    } catch {}
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const supabase = getSupabase();
      const { data, error } = isSignup
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (!data.session) {
        // Only happens if "Confirm email" is still on in Supabase.
        setError("Account created, but email confirmation is switched on. Log in once it’s confirmed.");
        setBusy(false);
        return;
      }
      router.replace("/app");
    } catch (err) {
      setError(friendlyError(err, mode));
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <h1 className="auth-title">{isSignup ? "Sign up" : "Log in"}</h1>
      <p className="auth-sub">
        {isSignup
          ? "Make an account, then pick your spot for Saturday."
          : "Welcome back. Your spot is waiting."}
      </p>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid={`${prefix}-email`}
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            name="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid={`${prefix}-password`}
          />
          {isSignup && <span className="field-hint">At least 6 characters.</span>}
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary button-full"
          disabled={busy}
          data-testid={`${prefix}-submit`}
        >
          {busy ? (isSignup ? "Signing up…" : "Logging in…") : isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        {isSignup ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            New here? <Link href="/signup">Sign up</Link>
          </>
        )}
      </p>
    </div>
  );
}
