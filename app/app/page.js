"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Pitch from "@/components/Pitch";
import { getSupabase } from "@/lib/supabase";
import { BENCH, FILL_ORDER, POSITIONS, describe } from "@/lib/positions";

const PITCH_IDS = new Set(POSITIONS.map((p) => p.id));

export default function LineupPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { kind: "ok" | "error", text }
  const [justPlaced, setJustPlaced] = useState(null);
  const nameTouched = useRef(false);
  const inputRef = useRef(null);

  const load = useCallback(async () => {
    const { data, error } = await getSupabase()
      .from("spots")
      .select("id, user_id, player_name, position, created_at")
      .order("created_at", { ascending: true });
    if (error) {
      setMessage({ kind: "error", text: "Couldn’t load the lineup. Refresh the page to try again." });
      return [];
    }
    setEntries(data);
    setLoaded(true);
    return data;
  }, []);

  // Logged-in players only.
  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (err) {
      setMessage({ kind: "error", text: err.message });
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setUser(data.session.user);
      load();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router, load]);

  // Keep the board fresh while the page is open.
  useEffect(() => {
    if (!user) return;
    const refresh = () => document.visibilityState === "visible" && load();
    const timer = setInterval(refresh, 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [user, load]);

  const mine = user ? entries.find((e) => e.user_id === user.id) : null;

  // Show your saved name in the box once, unless you've started typing.
  useEffect(() => {
    if (mine && !nameTouched.current && name === "") setName(mine.player_name);
  }, [mine, name]);

  const onPitch = entries.filter((e) => PITCH_IDS.has(e.position));
  const bench = entries.filter((e) => e.position === BENCH);
  const openCount = POSITIONS.length - onPitch.length;

  function pickTarget(current) {
    const takenByOthers = new Set(
      current.filter((e) => e.user_id !== user.id && e.position !== BENCH).map((e) => e.position)
    );
    if (selected && !takenByOthers.has(selected)) return selected;
    if (selected && takenByOthers.has(selected)) return null; // someone beat you to it
    const myCurrent = current.find((e) => e.user_id === user.id);
    if (myCurrent) return myCurrent.position; // just renaming
    return FILL_ORDER.find((id) => !takenByOthers.has(id)) || BENCH;
  }

  async function save(e) {
    e.preventDefault();
    const text = name.trim();
    if (!text) {
      setMessage({ kind: "error", text: "Type your name first." });
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    setMessage(null);
    const supabase = getSupabase();
    let current = entries;

    for (let attempt = 0; attempt < 3; attempt++) {
      const target = pickTarget(current);
      if (target === null) {
        setSelected(null);
        setMessage({ kind: "error", text: "Someone just took that spot. Pick another one." });
        await load();
        setBusy(false);
        return;
      }
      const myRow = current.find((r) => r.user_id === user.id);
      const { error } = myRow
        ? await supabase.from("spots").update({ player_name: text, position: target }).eq("id", myRow.id)
        : await supabase.from("spots").insert({ player_name: text, position: target });

      if (!error) {
        await load();
        setSelected(null);
        setJustPlaced(target);
        setTimeout(() => setJustPlaced(null), 600);
        setMessage({
          kind: "ok",
          text:
            target === BENCH
              ? "All 14 spots are taken, so you’re on the bench."
              : `You’re in: ${describe(target)}.`,
        });
        setBusy(false);
        return;
      }
      if (error.code !== "23505") break; // not a "spot already taken" clash
      current = await load(); // the spot went while you were typing: try again
    }

    setMessage({ kind: "error", text: "Couldn’t save your spot. Try again." });
    setBusy(false);
  }

  async function leave() {
    if (!mine) return;
    setBusy(true);
    const { error } = await getSupabase().from("spots").delete().eq("id", mine.id);
    await load();
    setSelected(null);
    setMessage(
      error
        ? { kind: "error", text: "Couldn’t remove you. Try again." }
        : { kind: "ok", text: "You’re out for Saturday. Your spot is open again." }
    );
    setBusy(false);
  }

  function choose(id) {
    setSelected(id);
    setMessage(null);
    if (id) inputRef.current?.focus({ preventScroll: true });
  }

  let buttonLabel = "Join";
  if (mine && selected && selected !== mine.position) buttonLabel = "Move here";
  else if (mine) buttonLabel = "Save name";

  let hint = "Tap an open spot, or join and take the first free one.";
  if (selected) hint = `Spot: ${describe(selected)}.`;
  else if (mine && mine.position === BENCH) hint = "You’re on the bench. Tap a spot if one opens up.";
  else if (mine) hint = `You’re playing ${describe(mine.position)}.`;

  return (
    <div className="lineup">
      <div className="lineup-head">
        <h1 className="lineup-title">
          <span>Saturday, 9 PM</span>
          <span className="lineup-place">La Chopera, El Retiro</span>
        </h1>
        <p className="count" aria-live="polite">
          {loaded ? (
            openCount > 0 ? (
              <>
                <strong>{onPitch.length} of 14</strong> in, {openCount} open
              </>
            ) : (
              <strong>Full: 14 of 14 in</strong>
            )
          ) : (
            "Loading the lineup…"
          )}
        </p>
      </div>

      <div className="teams-key" aria-hidden="true">
        <span className="key key-blue">Blue</span>
        <span className="key key-red">Red</span>
      </div>

      <Pitch
        entries={onPitch}
        myUserId={user?.id}
        selected={selected}
        justPlaced={justPlaced}
        onSelect={choose}
      />

      <form className="join-bar" onSubmit={save}>
        <p className="join-hint">{hint}</p>
        <div className="join-row">
          <label className="sr-only" htmlFor="player-name">
            Your name
          </label>
          <input
            id="player-name"
            ref={inputRef}
            type="text"
            maxLength={80}
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              nameTouched.current = true;
              setName(e.target.value);
            }}
            data-testid="core-input"
          />
          <button
            type="submit"
            className="button button-primary"
            disabled={busy || !user}
            data-testid="core-submit"
          >
            {busy ? "Saving…" : buttonLabel}
          </button>
        </div>
        {message && (
          <p className={`join-message join-message-${message.kind}`} role="status">
            {message.text}
          </p>
        )}
        {mine && (
          <button type="button" className="link-button leave" onClick={leave} disabled={busy}>
            I can’t make it
          </button>
        )}
      </form>

      {(bench.length > 0 || (loaded && openCount === 0)) && (
        <section className="bench" aria-labelledby="bench-title">
          <h2 id="bench-title" className="bench-title">
            Bench
          </h2>
          <p className="bench-note">When the pitch is full, new players wait here.</p>
          {bench.length > 0 ? (
            <ul className="bench-list">
              {bench.map((b) => (
                <li
                  key={b.id}
                  className={`tape bench-tape${b.user_id === user?.id ? " tape-mine" : ""}`}
                  data-testid="core-item"
                >
                  {b.player_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="bench-empty">Nobody on the bench yet.</p>
          )}
        </section>
      )}
    </div>
  );
}
