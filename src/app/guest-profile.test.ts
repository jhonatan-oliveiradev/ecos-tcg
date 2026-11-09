import { describe, it, expect } from "vitest";
import {
  DEFAULT_PROFILE,
  readProfile,
  withMatch,
  type LocalMatch,
} from "./guest-profile";
const match: LocalMatch = {
  id: "local-1",
  deck: "jardins",
  outcome: "win",
  rounds: 8,
  date: "2026-11-09T17:00:00.000Z",
};
describe("local guest records", () => {
  it("starts without invented progress and recovers from malformed or unknown data", () => {
    for (const raw of [null, "broken", "null", '{"version":2}', "[]"])
      expect(readProfile(raw)).toEqual(DEFAULT_PROFILE);
    expect(DEFAULT_PROFILE.matches).toHaveLength(0);
  });
  it("normalizes preferences and rejects invalid match records", () => {
    const profile = readProfile(
      JSON.stringify({
        version: 1,
        name: "  Jhonatan  ",
        deck: "other",
        finish: "paid",
        reducedMotion: "true",
        matches: [
          match,
          null,
          { ...match, id: "bad", rounds: -1 },
          { ...match, id: "date", date: "invalid" },
          match,
        ],
      }),
    );
    expect(profile).toEqual({
      ...DEFAULT_PROFILE,
      name: "Jhonatan",
      matches: [match],
    });
  });
  it("records a finished duel once even if the result effect runs again", () => {
    const recorded = withMatch(DEFAULT_PROFILE, match);
    expect(
      withMatch(recorded, { ...match, date: "2026-11-10T17:00:00.000Z" }),
    ).toBe(recorded);
    expect(recorded.matches).toHaveLength(1);
    expect(DEFAULT_PROFILE.matches).toHaveLength(0);
  });
  it("retains the last 50 records without losing preferences", () => {
    let profile = {
      ...DEFAULT_PROFILE,
      name: "Jhonatan",
      finish: "holo" as const,
      deck: "aurora" as const,
    };
    for (let i = 0; i < 60; i++)
      profile = withMatch(profile, {
        ...match,
        id: `match-${i}`,
      }) as typeof profile;
    expect(profile.matches).toHaveLength(50);
    expect(profile.matches[0].id).toBe("match-59");
    expect(profile.matches.at(-1)?.id).toBe("match-10");
    expect(readProfile(JSON.stringify(profile))).toEqual(profile);
  });
});
