import { it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { COMPANIONS } from "./companions";
import { DECKS } from "./decks";
import { CompanionDetails } from "../ui/cards/companion-details";
it("names the Jardins companion line Brotoco, Terruno and Ceroto", () => {
  expect(DECKS.jardins.companion).toBe("brotoco");
  const html = renderToStaticMarkup(
    createElement(CompanionDetails, {
      companion: COMPANIONS["brotoco"],
      ownerLabel: "Seu vínculo",
    }),
  );
  expect(html).toContain("Brotoco");
  expect(html).toContain("Terruno");
  expect(html).toContain("Ceroto");
  expect(html).not.toContain("Lúmen");
});
