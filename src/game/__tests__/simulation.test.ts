import { it, expect } from "vitest";
import { createMatch } from "../create-match";
import { send } from "./fixtures";
import { projectView } from "../project-view";
import { chooseAction } from "../../ai/choose-action";
it("finishes 50 seeded legal matches with valid resources and zones", () => {
  for (let seed = 1; seed <= 50; seed++) {
    let s = createMatch({
      seed,
      deckIds: ["jardins", "aurora"],
      mode: "standard",
    });
    s = send(s, "p1", { type: "mulligan", ids: [] });
    s = send(s, "p2", { type: "mulligan", ids: [] });
    for (let i = 0; i < 2000 && !s.result; i++) {
      const a = chooseAction(projectView(s, s.priority), seed + i);
      s = send(s, s.priority, a);
      for (const p of Object.values(s.players)) {
        expect(p.energy, `seed ${seed}`).toBeGreaterThanOrEqual(0);
        expect(p.board.length).toBeLessThanOrEqual(5);
        const ids = [...p.hand, ...p.deck, ...p.discard, ...p.board].map(
          (c) => c.id,
        );
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
    expect(s.result, `seed ${seed}, round ${s.round}`).not.toBeNull();
  }
}, 20000);
