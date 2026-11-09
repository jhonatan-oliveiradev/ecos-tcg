import { describe, it, expect } from "vitest";
import { createMatch } from "../create-match";
import { validateDeck } from "../../content/decks";
describe("partida determinística", () => {
  it("valida os dois decks completos", () => {
    expect(validateDeck("jardins")).toEqual([]);
    expect(validateDeck("aurora")).toEqual([]);
  });
  it("usa mesma semente e começa com recursos corretos", () => {
    const s = createMatch({
      seed: 42,
      deckIds: ["jardins", "aurora"],
      mode: "standard",
    });
    expect(s).toEqual(
      createMatch({
        seed: 42,
        deckIds: ["jardins", "aurora"],
        mode: "standard",
      }),
    );
    expect(s.players.p1.nexus).toBe(25);
    expect(s.players.p1.energy).toBe(1);
    expect(s.players.p1.hand).toHaveLength(4);
    expect(s.players.p1.deck).toHaveLength(26);
    expect(s.phase).toBe("mulligan");
    expect(s.players.p1.board).toHaveLength(0);
  });
});
