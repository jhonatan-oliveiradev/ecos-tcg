import type { GameState, WeatherId } from "./types";
import { nextRandom } from "./random";
export function naturalWeather(seed: number, round: number): WeatherId {
  const block = Math.floor((round - 1) / 3);
  const value = nextRandom(
    ((seed + block * 2654435761) ^ 0x9e3779b9) >>> 0 || 1,
  ).value;
  return (round - 1) % 3 === Math.floor(value * 3) ? "rain" : "stable";
}
export function getForecast(s: GameState, count: number): WeatherId[] {
  return Array.from({ length: count }, (_, i) =>
    naturalWeather(s.seed, s.round + i + 1),
  );
}
