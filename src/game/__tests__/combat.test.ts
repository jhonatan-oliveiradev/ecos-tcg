import { it, expect } from "vitest";
import { ready, send } from "./fixtures";
import type { GameState, PlayerId, Unit } from "../types";
function unit(
  s: GameState,
  p: PlayerId,
  id: string,
  defId = "guardiao-viaduto",
): Unit {
  const u: Unit = {
    id,
    defId,
    owner: p,
    damage: 0,
    exhausted: false,
    enteredRound: 0,
    barrier: 0,
    buff: 0,
    companion: false,
    stage: 0,
  };
  s.players[p].board.push(u);
  return u;
}
function passResponses(s: GameState) {
  for (let i = 0; i < 10 && s.phase === "response"; i++)
    s = send(s, s.priority, { type: "pass" });
  return s;
}
it("blocks simultaneous damage and preserves persistent damage", () => {
  let s = ready();
  s.priority = "p1";
  s.turnOwner = "p1";
  s.turnStep = "battle";
  unit(s, "p1", "a");
  unit(s, "p2", "b");
  s = send(s, "p1", { type: "attack", unitId: "a" });
  s = passResponses(s);
  expect(s.phase).toBe("block");
  s = send(s, "p2", { type: "block", unitId: "b" });
  s = passResponses(s);
  expect(s.players.p1.board[0].damage).toBe(2);
  expect(s.players.p2.board[0].damage).toBe(2);
  expect(s.players.p2.nexus).toBe(25);
  expect(s.players.p1.board[0].exhausted).toBe(true);
});
it("removed blocker keeps attack blocked", () => {
  let s = ready();
  s.priority = "p1";
  s.turnOwner = "p1";
  s.turnStep = "battle";
  unit(s, "p1", "a");
  unit(s, "p2", "b", "ave-sinal");
  s = send(s, "p1", { type: "attack", unitId: "a" });
  s = passResponses(s);
  s = send(s, "p2", { type: "block", unitId: "b" });
  s.players.p2.board = [];
  s = passResponses(s);
  expect(s.players.p2.nexus).toBe(25);
  expect(s.phase).toBe("main");
});
it("cannot attack with a fresh creature, allows haste", () => {
  const s = ready();
  s.priority = "p1";
  s.turnOwner = "p1";
  s.turnStep = "battle";
  unit(s, "p1", "fresh").enteredRound = s.round;
  expect(() => send(s, "p1", { type: "attack", unitId: "fresh" })).toThrow();
  s.players.p1.board[0].defId = "felino-tubo";
  expect(() =>
    send(s, "p1", { type: "attack", unitId: "fresh" }),
  ).not.toThrow();
});
it("dead target fizzles response and costs stay paid", () => {
  let s = ready();
  s.priority = "p1";
  s.turnOwner = "p1";
  s.turnStep = "battle";
  unit(s, "p2", "target", "ave-sinal");
  s.players.p1.energy = 10;
  s.players.p1.hand.push({ id: "spell", defId: "pulso" });
  s = send(s, "p1", {
    type: "play-card",
    cardId: "spell",
    target: { kind: "unit", id: "target" },
  });
  s.players.p2.board = [];
  s = passResponses(s);
  expect(s.players.p1.energy).toBe(8);
  expect(s.phase).toBe("main");
});
