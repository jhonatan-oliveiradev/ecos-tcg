import { it, expect } from "vitest";
import { createMatch } from "../create-match";
import { send } from "./fixtures";
import { chooseAction } from "../../ai/choose-action";
import { projectView } from "../project-view";
it("allows the tutorial player to reach a real first attack against the AI", () => {
  let s = createMatch({
    seed: 42,
    mode: "tutorial",
    deckIds: ["jardins", "aurora"],
  });
  s = send(s, "p1", { type: "mulligan", ids: [] });
  s = send(s, "p2", { type: "mulligan", ids: [] });
  const cheap = s.players.p1.hand.find((c) => c.defId === "vigia-musgo")!;
  s = send(s, "p1", { type: "play-card", cardId: cheap.id });
  s = send(s, "p1", { type: "end-turn" });
  for (
    let i = 0;
    i < 100 && !(s.round === 2 && s.phase === "main" && s.priority === "p1");
    i++
  ) {
    const pid = s.priority;
    s = send(
      s,
      pid,
      pid === "p2"
        ? chooseAction(projectView(s, pid), s.seed + s.revision)
        : s.phase === "block"
          ? { type: "decline-block" }
          : { type: "pass" },
    );
  }
  expect(s.round).toBe(2);
  expect(s.priority).toBe("p1");
  expect(s.players.p1.board.some((u) => u.id === cheap.id)).toBe(true);
  s = send(s, "p1", { type: "start-battle" });
  const attack = projectView(s, "p1").actions.find(
    (x) => x.action.type === "attack" && x.action.unitId === cheap.id,
  )!;
  expect(attack).toBeDefined();
  const energy = s.players.p1.energy;
  s = send(s, "p1", attack.action);
  expect(s.players.p1.energy).toBe(energy);
  for (let i = 0; i < 100 && s.phase !== "main"; i++) {
    const pid = s.priority;
    s = send(
      s,
      pid,
      pid === "p2"
        ? chooseAction(projectView(s, pid), s.seed + s.revision)
        : { type: "pass" },
    );
  }
  expect(
    s.events.some(
      (e) =>
        e.owner === "p1" && (e.type === "nexus-damage" || e.type === "damage"),
    ),
  ).toBe(true);
});
