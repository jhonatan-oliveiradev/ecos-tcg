import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { HoloFinish } from "./holo-finish";
it("keeps rules as accessible real content and foil decorative", () => {
  const html = renderToStaticMarkup(
    createElement(HoloFinish, {
      enabled: true,
      children: createElement("p", null, "Brotoco · 1 ataque · 4 vida"),
    }),
  );
  expect(html).toContain("Brotoco");
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain("holo-enabled");
});
