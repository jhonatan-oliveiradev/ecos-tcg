export function nextRandom(rng: number): { value: number; rng: number } {
  let n = rng | 0;
  n ^= n << 13;
  n ^= n >>> 17;
  n ^= n << 5;
  return { rng: n >>> 0, value: (n >>> 0) / 4294967296 };
}
export function shuffle<T>(
  items: T[],
  seed: number,
): { items: T[]; rng: number } {
  const out = [...items];
  let rng = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    const r = nextRandom(rng);
    rng = r.rng;
    const j = Math.floor(r.value * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return { items: out, rng };
}
