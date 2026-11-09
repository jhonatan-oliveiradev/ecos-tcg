import { it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DuelScreen } from "./duel-screen";
import { ready } from "../../game/__tests__/fixtures";
import { projectView } from "../../game/project-view";
import type { Unit } from "../../game/types";
it("exposes exact announced targets and distinguishes duplicate creatures", () => {
  const s = ready();
  const u = (id: string): Unit => ({
    id,
    defId: "correio-antena",
    owner: "p1",
    damage: 0,
    exhausted: false,
    enteredRound: 0,
    barrier: 0,
    buff: 0,
    companion: false,
    stage: 0,
  });
  s.players.p1.board = [u("a"), u("b")];
  s.phase = "response";
  s.priority = "p1";
  s.stack = [
    {
      id: "spell",
      owner: "p2",
      kind: "damage",
      source: "pulso",
      target: { kind: "unit", id: "a" },
      amount: 2,
      response: true,
      card: { id: "card", defId: "pulso" },
    },
  ];
  const render = () =>
    renderToStaticMarkup(
      createElement(DuelScreen, {
        view: projectView(s, "p1"),
        onAction: () => {},
        onExit: () => {},
        onGuide: () => {},
      }),
    );
  const a = render();
  s.stack[0].target = { kind: "unit", id: "b" };
  const b = render();
  expect(a).not.toEqual(b);
  expect(a).toContain("Seu Correio de Antena · posição 1");
  expect(b).toContain("Seu Correio de Antena · posição 2");
});
it("keeps companion inspection available even when an attack is legal", () => {
  const s = ready();
  s.priority = "p1";
  s.players.p1.board = [
    {
      id: "pet",
      defId: "brotoco",
      owner: "p1",
      damage: 0,
      exhausted: false,
      enteredRound: 0,
      barrier: 0,
      buff: 0,
      companion: true,
      stage: 0,
    },
  ];
  const html = renderToStaticMarkup(
    createElement(DuelScreen, {
      view: projectView(s, "p1"),
      onAction: () => {},
      onExit: () => {},
      onGuide: () => {},
    }),
  );
  expect(html).toContain('aria-label="Inspecionar Brotoco"');
});
