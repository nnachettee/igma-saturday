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
        <p className="for-who">For IGMA Sunday League players at IE University.</p>
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
        <Pitch
          demo={{
            filled: ["R-GK", "R-LB", "R-CM", "R-ST", "B-GK", "B-RB", "B-LM", "B-CM", "B-ST"],
            highlight: "R-RM",
          }}
        />
        <p className="board-caption">Tap an open spot and your name goes on the board.</p>
      </section>
    </div>
  );
}
