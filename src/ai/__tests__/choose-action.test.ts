import { it, expect } from "vitest";
import { chooseAction } from "../choose-action";
import { projectView } from "../../game/project-view";
import { ready } from "../../game/__tests__/fixtures";
it("uses legal actions without seeing enemy hand", () => {
  const s = ready();
  const v = projectView(s, s.priority);
  const a = chooseAction(v, 8);
  expect(v.actions.map((x) => x.action)).toContainEqual(a);
  s.players[s.priority === "p1" ? "p2" : "p1"].hand.reverse();
  expect(chooseAction(projectView(s, s.priority), 8)).toEqual(a);
});
it("takes an available lethal attack", () => {
  const s = ready();
  s.priority = "p1";
  s.players.p2.nexus = 1;
  s.players.p1.board.push({
    id: "a",
    defId: "cervo-concreto",
    owner: "p1",
    damage: 0,
    exhausted: false,
    enteredRound: 0,
    barrier: 0,
    buff: 0,
    companion: false,
    stage: 0,
  });
  expect(chooseAction(projectView(s, "p1"), 1)).toEqual({
    type: "attack",
    unitId: "a",
  });
});
