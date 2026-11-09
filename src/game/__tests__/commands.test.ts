import { it, expect } from "vitest";
import { createMatch } from "../create-match";
import { applyCommand, listLegalActions } from "../commands";
import { projectView } from "../project-view";
import type { Action } from "../types";
import { ready, send } from "./fixtures";
it("passes twice refill energy and draw exactly once", () => {
  let s = ready();
  s = send(s, s.priority, { type: "pass" });
  s = send(s, s.priority, { type: "pass" });
  expect(s.round).toBe(2);
  expect(s.players.p1.energy).toBe(2);
  expect(s.players.p1.hand).toHaveLength(5);
});
it("rejects stale, repeated and out of turn commands without mutation", () => {
  const s = ready();
  const before = JSON.stringify(s);
  const c = {
    matchId: s.matchId,
    commandId: "unique",
    expectedRevision: s.revision,
    playerId: s.priority,
    action: { type: "pass" } as Action,
  };
  const r = applyCommand(s, c);
  expect(r.ok).toBe(true);
  expect(JSON.stringify(s)).toBe(before);
  if (r.ok) {
    expect(applyCommand(r.state, c).ok).toBe(false);
  }
  expect(
    applyCommand(s, { ...c, playerId: s.priority === "p1" ? "p2" : "p1" }).ok,
  ).toBe(false);
});
it("projects no hidden identities", () => {
  const s = ready();
  const view = projectView(s, "p1");
  expect(view.opponent.handCount).toBe(4);
  expect("hand" in view.opponent).toBe(false);
  for (const c of s.players.p2.hand)
    expect(JSON.stringify(view)).not.toContain(c.id);
  expect(listLegalActions(s, s.priority).length).toBeGreaterThan(0);
});
it("mulligan does not redraw returned instances", () => {
  let s = createMatch({
    seed: 1,
    deckIds: ["jardins", "aurora"],
    mode: "standard",
  });
  const ids = s.players.p1.hand.map((c) => c.id);
  s = send(s, "p1", { type: "mulligan", ids });
  expect(s.players.p1.hand).toHaveLength(4);
  expect(s.players.p1.hand.some((c) => ids.includes(c.id))).toBe(false);
});
