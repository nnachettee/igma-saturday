"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function logOut() {
    await getSupabase().auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="topbar">
      <Link href={session ? "/app" : "/"} className="brand" aria-label="IGMA home">
        <small>The IGMA</small>
        <b>Sunday League</b>
      </Link>
      <nav className="topbar-nav">
        {session === undefined ? null : session ? (
          <button type="button" className="link-button" data-testid="logout" onClick={logOut}>
            Log out
          </button>
        ) : pathname === "/login" ? (
          <Link href="/signup" className="link-button">
            Sign up
          </Link>
        ) : (
          <Link href="/login" className="link-button">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
