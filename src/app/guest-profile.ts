import type { DeckId } from "../game/types";

export type Finish = "standard" | "holo";
export interface LocalMatch {
  id: string;
  deck: DeckId;
  outcome: "win" | "loss" | "draw";
  rounds: number;
  date: string;
}
export interface GuestProfile {
  version: 1;
  name: string;
  deck: DeckId;
  finish: Finish;
  reducedMotion: boolean;
  matches: LocalMatch[];
}
export const DEFAULT_PROFILE: GuestProfile = {
  version: 1,
  name: "Vinculador",
  deck: "jardins",
  finish: "standard",
  reducedMotion: false,
  matches: [],
};
export function readProfile(raw: string | null): GuestProfile {
  if (!raw) return DEFAULT_PROFILE;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return DEFAULT_PROFILE;
    return {
      version: 1,
      name:
        typeof data.name === "string" && data.name.trim()
          ? data.name.trim().slice(0, 24)
          : DEFAULT_PROFILE.name,
      deck: data.deck === "aurora" ? "aurora" : "jardins",
      finish: data.finish === "holo" ? "holo" : "standard",
      reducedMotion: data.reducedMotion === true,
      matches: Array.isArray(data.matches)
        ? data.matches
            .filter(
              (m: LocalMatch) =>
                m &&
                typeof m.id === "string" &&
                ["jardins", "aurora"].includes(m.deck) &&
                ["win", "loss", "draw"].includes(m.outcome) &&
                Number.isInteger(m.rounds) &&
                m.rounds > 0 &&
                typeof m.date === "string" &&
                Number.isFinite(Date.parse(m.date)),
            )
            .filter(
              (m: LocalMatch, i: number, all: LocalMatch[]) =>
                all.findIndex((x) => x.id === m.id) === i,
            )
            .slice(0, 50)
        : [],
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}
export function withMatch(
  profile: GuestProfile,
  match: LocalMatch,
): GuestProfile {
  if (profile.matches.some((m) => m.id === match.id)) return profile;
  return { ...profile, matches: [match, ...profile.matches].slice(0, 50) };
}
