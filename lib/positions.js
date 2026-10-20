// 1-2-3-1 for each team. Coordinates are % of the pitch (x from left, y from top).
// Red attacks upward from the bottom half, Blue downward from the top half.
export const TEAMS = {
  red: { name: "Red" },
  blue: { name: "Blue" },
};

const ROLES = {
  GK: "goalkeeper",
  LB: "left back",
  RB: "right back",
  LM: "left mid",
  CM: "centre mid",
  RM: "right mid",
  ST: "striker",
};

export const POSITIONS = [
  // Spaced so a name tag never covers the next magnet, even on a small phone.
  { id: "R-GK", team: "red", role: "GK", x: 50, y: 89 },
  { id: "R-LB", team: "red", role: "LB", x: 28, y: 83 },
  { id: "R-RB", team: "red", role: "RB", x: 72, y: 83 },
  { id: "R-LM", team: "red", role: "LM", x: 14, y: 68 },
  { id: "R-CM", team: "red", role: "CM", x: 50, y: 73 },
  { id: "R-RM", team: "red", role: "RM", x: 86, y: 68 },
  { id: "R-ST", team: "red", role: "ST", x: 50, y: 57 },
  { id: "B-GK", team: "blue", role: "GK", x: 50, y: 7 },
  { id: "B-LB", team: "blue", role: "LB", x: 72, y: 15 },
  { id: "B-RB", team: "blue", role: "RB", x: 28, y: 15 },
  { id: "B-LM", team: "blue", role: "LM", x: 86, y: 30 },
  { id: "B-CM", team: "blue", role: "CM", x: 50, y: 24 },
  { id: "B-RM", team: "blue", role: "RM", x: 14, y: 30 },
  { id: "B-ST", team: "blue", role: "ST", x: 50, y: 41 },
];

// Order used when someone joins without picking: fill both teams evenly, keepers last.
export const FILL_ORDER = [
  "R-CM", "B-CM", "R-ST", "B-ST", "R-LM", "B-LM", "R-RM", "B-RM",
  "R-LB", "B-LB", "R-RB", "B-RB", "R-GK", "B-GK",
];

export const BENCH = "BENCH";

export function describe(positionId) {
  if (positionId === BENCH) return "the bench";
  const p = POSITIONS.find((pos) => pos.id === positionId);
  if (!p) return "a spot";
  return `${TEAMS[p.team].name}, ${ROLES[p.role]}`;
}

export function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
