import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Card } from "./card";
import { CARDS } from "../../content/cards";
it("renders real rules text and accessible card label", () => {
  const html = renderToStaticMarkup(
    createElement(Card, {
      card: CARDS["lontra-condutora"],
      onSelect: () => {},
      onInspect: () => {},
    }),
  );
  expect(html).toContain("Lontra Condutora");
  expect(html).toContain("Condutor");
  expect(html).toContain("aria-label");
  expect(html).toContain("Ilustração em revisão");
});
