import { it, expect } from "vitest";
import { ready, send } from "./fixtures";
import { cleanDead, draw, checkResult } from "../rules";
import { resolveEffect } from "../effects";
import { listLegalActions } from "../commands";
import { stats } from "../rules";
import type { GameState, PlayerId, Unit } from "../types";
const pet = (pid: PlayerId, defId: string): Unit => ({
  id: `pet-${pid}`,
  defId,
  owner: pid,
  damage: 0,
  exhausted: false,
  enteredRound: 0,
  barrier: 0,
  buff: 0,
  companion: true,
  stage: 0,
});
const drain = (state: GameState) => {
  let s = state;
  for (let i = 0; i < 12 && s.phase === "response"; i++)
    s = send(s, s.priority, { type: "pass" });
  return s;
};
for (const defId of ["brotoco", "sintila"])
  it(`evolves ${defId} to ascendant only across rounds`, () => {
    let s = ready();
    s.round = 5;
    s.priority = "p1";
    const p = s.players.p1;
    p.companion.defId = defId;
    p.companion.resonance = 7;
    p.companion.history = [2, 3];
    p.energy = 10;
    p.board = [pet("p1", defId)];
    s = send(s, "p1", { type: "evolve-companion" });
    s = drain(s);
    expect(s.players.p1.companion.stage).toBe(1);
    expect(
      listLegalActions(s, "p1").some(
        (x) => x.action.type === "evolve-companion",
      ),
    ).toBe(false);
    s = send(s, s.priority, { type: "pass" });
    s = send(s, s.priority, { type: "pass" });
    if (s.priority !== "p1") s = send(s, s.priority, { type: "pass" });
    s = send(s, "p1", { type: "evolve-companion" });
    s = drain(s);
    expect(s.players.p1.companion.stage).toBe(2);
    expect(s.result).toBeNull();
    expect(s.players.p2.nexus).toBe(25);
  });
it("companion death enforces wait, increased cost and base stage", () => {
  let s = ready();
  s.round = 3;
  s.players.p1.board = [pet("p1", "brotoco")];
  s.players.p1.companion.resonance = 7;
  s.players.p1.board[0].damage = 10;
  cleanDead(s);
  expect(s.players.p1.companion.availableRound).toBe(5);
  s.priority = "p1";
  s.players.p1.energy = 10;
  expect(
    listLegalActions(s, "p1").some((x) => x.action.type === "summon-companion"),
  ).toBe(false);
  s.round = 4;
  expect(
    listLegalActions(s, "p1").some((x) => x.action.type === "summon-companion"),
  ).toBe(false);
  s.round = 5;
  s = send(s, "p1", { type: "summon-companion" });
  expect(s.players.p1.energy).toBe(6);
  expect(s.players.p1.board[0].stage).toBe(0);
  expect(s.players.p1.companion.resonance).toBe(7);
});
it("fatigue grows while overflow discards publicly", () => {
  const s = ready(),
    p = s.players.p1;
  p.hand.push(...p.deck.splice(0, 4));
  draw(s, "p1");
  expect(p.hand.length).toBe(8);
  expect(p.discard.length).toBe(1);
  p.deck = [];
  draw(s, "p1", 3);
  expect(p.nexus).toBe(19);
  expect(p.fatigue).toBe(3);
});
it("barrier does not stack and zero heal grants no resonance", () => {
  const s = ready();
  s.players.p1.board = [pet("p1", "brotoco")];
  const e = {
    id: "a",
    owner: "p1" as const,
    source: "abrigo",
    kind: "barrier" as const,
    target: { kind: "unit" as const, id: "pet-p1" },
    amount: 2,
    response: true,
  };
  resolveEffect(s, e);
  resolveEffect(s, e);
  expect(s.players.p1.board[0].barrier).toBe(2);
  resolveEffect(s, { ...e, kind: "heal", source: "reparo" });
  expect(s.players.p1.companion.resonance).toBe(0);
});
it("full board prevents companion and weather bonus does not accumulate", () => {
  const s = ready();
  s.priority = "p1";
  s.players.p1.energy = 10;
  s.players.p1.board = Array.from({ length: 5 }, (_, i) => ({
    ...pet("p1", "brotoco"),
    id: `u${i}`,
    defId: "lontra-condutora",
    companion: false,
  }));
  expect(
    listLegalActions(s, "p1").some((x) => x.action.type === "summon-companion"),
  ).toBe(false);
  s.weather.active = "rain";
  expect(stats(s, s.players.p1.board[0])[0]).toBe(3);
  expect(stats(s, s.players.p1.board[0])[0]).toBe(3);
  s.weather.active = "stable";
  expect(stats(s, s.players.p1.board[0])[0]).toBe(2);
});
it("simultaneous zero nexus resolves as a draw and rejects further play", () => {
  const s = ready();
  s.players.p1.nexus = 0;
  s.players.p2.nexus = 0;
  checkResult(s);
  expect(s.result).toBe("draw");
  expect(listLegalActions(s, "p1")).toEqual([]);
});
