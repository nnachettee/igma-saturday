import Link from "next/link";
import Pitch from "@/components/Pitch";

export default function Home() {
  return (
    <div className="landing">
      <section className="landing-copy">
        <h1 className="match">
          <span className="match-time">Saturday, 9&nbsp;PM</span>
          <span className="match-place">La Chopera, El Retiro</span>
        </h1>
        <p className="lede">
          <strong>Pick your position for this week&rsquo;s 7v7.</strong> See who&rsquo;s in,
          which spots are still open and who you&rsquo;re up against. No more sorting the
          lineup in WhatsApp.
        </p>
        <p className="for-who">For IGMA Pickup Games players at IE University.</p>
        <div className="cta-row">
          <Link href="/signup" className="button button-primary">
            Sign up
          </Link>
          <p className="cta-alt">
            Already playing? <Link href="/login">Log in</Link>
          </p>
        </div>
      </section>

      <section className="landing-board" aria-label="Preview of the lineup board">
        {/* Visitors tap the spots: send them to sign up. */}
        <Link href="/signup" className="board-link" aria-label="Sign up to pick your spot">
          <Pitch
            demo={{
              filled: ["R-GK", "R-LB", "R-CM", "R-ST", "B-GK", "B-RB", "B-LM", "B-CM", "B-ST"],
              highlight: "R-RM",
            }}
          />
        </Link>
        <p className="board-caption">Tap an open spot and your name goes on the board.</p>
      </section>
    </div>
  );
}
