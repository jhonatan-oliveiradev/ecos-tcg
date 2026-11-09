import { it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResultScreen } from "./result-screen";
import { ready } from "../../game/__tests__/fixtures";
import { projectView } from "../../game/project-view";
it("presents a keyboard modal result instead of obscured duel controls", () => {
  const s = ready();
  s.phase = "ended";
  s.result = "p1";
  const html = renderToStaticMarkup(
    createElement(ResultScreen, {
      view: projectView(s, "p1"),
      onExit: () => {},
    }),
  );
  expect(html).toContain('role="dialog"');
  expect(html).toContain('aria-modal="true"');
  expect(html).toContain("Voltar à estação");
  expect(html).not.toContain("Passar iniciativa");
});
