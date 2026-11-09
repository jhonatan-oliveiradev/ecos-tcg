import { it, expect } from "vitest";
import { ready, send } from "./fixtures";
import { listLegalActions, applyCommand } from "../commands";
import type { GameState, Unit } from "../types";
const creature = (id: string, owner: "p1" | "p2", round = 0): Unit => ({
  id,
  owner,
  defId: "guardiao-viaduto",
  enteredRound: round,
  exhausted: false,
  damage: 0,
  barrier: 0,
  buff: 0,
  companion: false,
  stage: 0,
});
const drain = (s: GameState) => {
  for (let i = 0; i < 20 && s.phase === "response"; i++)
    s = send(s, s.priority, { type: "pass" });
  return s;
};
it("keeps preparation with its owner, separates battle and spends no energy attacking", () => {
  let s = ready();
  const p = s.turnOwner;
  s.players[p].hand = [{ id: "cheap", defId: "vigia-musgo" }];
  s = send(s, p, { type: "play-card", cardId: "cheap" });
  expect(s.priority).toBe(p);
  expect(s.turnStep).toBe("preparation");
  expect(listLegalActions(s, p).some((x) => x.action.type === "attack")).toBe(
    false,
  );
  s.players[p].board.push(creature("ready", p));
  s = send(s, p, { type: "start-battle" });
  expect(
    listLegalActions(s, p).some((x) => x.action.type === "summon-companion"),
  ).toBe(false);
  expect(
    listLegalActions(s, p).some(
      (x) => x.action.type === "attack" && x.action.unitId === "cheap",
    ),
  ).toBe(false);
  expect(s.players[p].energy).toBe(0);
  s = send(s, p, { type: "attack", unitId: "ready" });
  s = drain(s);
  s = send(s, s.priority, { type: "decline-block" });
  s = drain(s);
  const foe = p === "p1" ? "p2" : "p1";
  expect(s.players[foe].nexus).toBe(23);
  expect(s.priority).toBe(p);
  expect(s.turnStep).toBe("battle");
  expect(s.players[p].energy).toBe(0);
  expect(listLegalActions(s, p).some((x) => x.action.type === "attack")).toBe(
    false,
  );
});
it("direct creature attacks trade damage and never spill into the Nexo when target disappears", () => {
  let s = ready();
  s.turnOwner = s.priority = "p1";
  s.players.p1.board = [creature("a", "p1")];
  s.players.p2.board = [creature("b", "p2")];
  s = send(s, "p1", { type: "start-battle" });
  const before = structuredClone(s);
  const command = {
    matchId: s.matchId,
    commandId: "bad",
    expectedRevision: s.revision,
    playerId: "p1" as const,
    action: { type: "attack" as const, unitId: "a", targetId: "missing" },
  };
  expect(applyCommand(s, command).ok).toBe(false);
  expect(s).toEqual(before);
  let resolved = send(s, "p1", { type: "attack", unitId: "a", targetId: "b" });
  resolved = drain(resolved);
  expect(resolved.players.p1.board[0].damage).toBe(2);
  expect(resolved.players.p2.board[0].damage).toBe(2);
  expect(resolved.players.p2.nexus).toBe(25);
  expect(resolved.priority).toBe("p1");
  s = send(s, "p1", { type: "attack", unitId: "a", targetId: "b" });
  s.players.p2.board = [];
  s = drain(s);
  expect(s.players.p2.nexus).toBe(25);
  expect(s.phase).toBe("main");
});
it("cannot end a turn during reactions and returns to the active owner after a defender response", () => {
  let s = ready();
  s.turnOwner = s.priority = "p1";
  s.players.p1.board = [creature("a", "p1")];
  s.players.p2.board = [creature("b", "p2")];
  s.players.p2.hand = [{ id: "shield", defId: "abrigo" }];
  s.players.p2.energy = 1;
  s = send(s, "p1", { type: "start-battle" });
  s = send(s, "p1", { type: "attack", unitId: "a", targetId: "b" });
  expect(
    listLegalActions(s, "p2").some((x) => x.action.type === "end-turn"),
  ).toBe(false);
  s = send(s, "p2", {
    type: "play-card",
    cardId: "shield",
    target: { kind: "unit", id: "b" },
  });
  s = drain(s);
  expect(s.players.p2.board[0].damage).toBe(0);
  expect(s.priority).toBe("p1");
  expect(s.turnOwner).toBe("p1");
});
