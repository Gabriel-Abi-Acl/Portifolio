/**
 * Desktop arc in a 0–100 box. Percentages match the SVG viewBox, so nodes
 * stay on the stroke when the stage stretches. y grows downward.
 *
 * The curve is a hill: outer milestones sit on the lower ends, inner ones
 * near the crest. Designed for 1–4 cards.
 */
const X0 = 15;
const X1 = 85;
const Y_END = 76;
const Y_PEAK = 42;

export type ArcPoint = {
  x: number;
  y: number;
};

function controlY(): number {
  return 2 * Y_PEAK - Y_END;
}

export function journeyArcPath(): string {
  const cy = controlY();
  const cx = (X0 + X1) / 2;
  return `M ${X0} ${Y_END} Q ${cx} ${cy} ${X1} ${Y_END}`;
}

export function journeyArcPoints(count: number): ArcPoint[] {
  if (count <= 0) return [];

  const cy = controlY();

  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const x = X0 + (X1 - X0) * t;
    const y = Y_END * (1 - t) ** 2 + 2 * (1 - t) * t * cy + t ** 2 * Y_END;
    return { x, y };
  });
}
