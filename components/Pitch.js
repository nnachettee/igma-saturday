"use client";

import { POSITIONS, describe, initials } from "@/lib/positions";

/**
 * The tactics board.
 * - entries: saved spots [{ id, player_name, position, user_id }]
 * - demo: { filled: [positionIds], highlight: positionId } for the landing page (no real data)
 */
export default function Pitch({
  entries = [],
  myUserId = null,
  selected = null,
  justPlaced = null,
  onSelect = null,
  demo = null,
}) {
  const byPosition = new Map(entries.map((e) => [e.position, e]));

  return (
    <div className={`pitch${demo ? " pitch-demo" : ""}`}>
      <PitchLines />
      {POSITIONS.map((pos) => {
        const style = { left: `${pos.x}%`, top: `${pos.y}%` };

        if (demo) {
          const filled = demo.filled.includes(pos.id);
          const highlight = demo.highlight === pos.id;
          return (
            <div key={pos.id} className="spot" style={style} aria-hidden="true">
              {filled ? (
                <span className={`magnet magnet-${pos.team}`} />
              ) : (
                <span className={`ring${highlight ? " ring-selected" : ""}`}>
                  {highlight ? "You?" : pos.role}
                </span>
              )}
            </div>
          );
        }

        const entry = byPosition.get(pos.id);
        const mine = entry && entry.user_id === myUserId;
        const isSelected = selected === pos.id;

        if (entry) {
          return (
            <div key={pos.id} className="spot" style={style}>
              <span
                className={`magnet magnet-${pos.team}${mine ? " magnet-mine" : ""}${
                  justPlaced === pos.id ? " magnet-snap" : ""
                }`}
                aria-hidden="true"
              >
                {initials(entry.player_name)}
              </span>
              <span
                className={`tape${mine ? " tape-mine" : ""}`}
                data-testid="core-item"
                title={`${entry.player_name}, ${describe(pos.id)}`}
              >
                {entry.player_name}
              </span>
            </div>
          );
        }

        return (
          <div key={pos.id} className="spot" style={style}>
            <button
              type="button"
              className={`ring${isSelected ? " ring-selected" : ""}`}
              aria-pressed={isSelected}
              aria-label={`Pick ${describe(pos.id)}`}
              onClick={() => onSelect && onSelect(isSelected ? null : pos.id)}
            >
              {pos.role}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function PitchLines() {
  // Drawn on a 200 × 300 board; the pitch keeps a 2:3 ratio so circles stay round.
  return (
    <svg className="pitch-lines" viewBox="0 0 200 300" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="8" y="8" width="184" height="284" rx="1" />
        <line x1="8" y1="150" x2="192" y2="150" />
        <circle cx="100" cy="150" r="24" />
        {/* Blue area (top) */}
        <rect x="52" y="8" width="96" height="40" />
        <path d="M78 48 A 22 22 0 0 0 122 48" />
        {/* Red area (bottom) */}
        <rect x="52" y="252" width="96" height="40" />
        <path d="M78 252 A 22 22 0 0 1 122 252" />
      </g>
      <g fill="currentColor">
        <circle cx="100" cy="150" r="1.8" />
        <circle cx="100" cy="36" r="1.5" />
        <circle cx="100" cy="264" r="1.5" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="84" y="3" width="32" height="5" />
        <rect x="84" y="292" width="32" height="5" />
      </g>
    </svg>
  );
}
