import { it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CompanionDetails } from "./companion-details";
import { COMPANIONS } from "../../content/companions";
it("discloses every stage, ascension consequence and public progression", () => {
  const html = renderToStaticMarkup(
    createElement(CompanionDetails, {
      companion: COMPANIONS.sintila,
      progress: {
        defId: "sintila",
        stage: 1,
        deaths: 0,
        availableRound: 1,
        evolvedRound: 3,
        awakenedRound: 3,
        resonance: 7,
        scored: [],
        history: [2, 3],
      },
      ownerLabel: "Vínculo adversário",
    }),
  );
  expect(html).toContain("Ascendente");
  expect(html).toContain("6 / 6");
  expect(html).toContain("Cause 1 de dano a cada criatura inimiga");
  expect(html).toContain("Vínculo adversário");
  expect(html).toContain("7 de ressonância");
});
