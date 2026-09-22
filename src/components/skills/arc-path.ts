/**
 * Closed horizontal conveyor: a wide oval with a gentle S-bow.
 * Icons travel the arc, turn at the end, and continue across the other side.
 * Not a globe — one flat loop that spans the section.
 */

const SAMPLES = 72;
const S_BOW = 0.34;

function unitPoint(t: number): [number, number] {
  return [Math.cos(t), Math.sin(t) + S_BOW * Math.sin(2 * t)];
}

function fitPoints(
  points: Array<[number, number]>,
  width: number,
  height: number,
  pad: number,
): Array<[number, number]> {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const spanX = Math.max(0.001, maxX - minX);
  const spanY = Math.max(0.001, maxY - minY);
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);

  return points.map(([x, y]) => [
    pad + ((x - minX) / spanX) * innerW,
    pad + ((y - minY) / spanY) * innerH,
  ]);
}

function closedSmoothPath(points: Array<[number, number]>): string {
  const count = points.length;
  const n = (value: number) => value.toFixed(2);
  let path = `M ${n(points[0][0])} ${n(points[0][1])}`;

  for (let index = 0; index < count; index += 1) {
    const p0 = points[(index - 1 + count) % count];
    const p1 = points[index];
    const p2 = points[(index + 1) % count];
    const p3 = points[(index + 2) % count];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    path += ` C ${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2[0])} ${n(p2[1])}`;
  }

  return path;
}

export function stageHeight(width: number): number {
  if (width < 640) {
    return Math.round(Math.min(220, Math.max(168, width * 0.5)));
  }

  return Math.round(Math.min(340, Math.max(230, width * 0.34)));
}

export function stagePad(width: number): number {
  return width < 640 ? 28 : 40;
}

export function skillsArcPath(width: number, height: number): string {
  const raw: Array<[number, number]> = [];

  for (let index = 0; index < SAMPLES; index += 1) {
    raw.push(unitPoint((index / SAMPLES) * Math.PI * 2));
  }

  return closedSmoothPath(fitPoints(raw, width, height, stagePad(width)));
}
