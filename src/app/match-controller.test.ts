import { it, expect, vi } from "vitest";
import { createMatchController } from "./match-controller";
it("cancels stale AI decisions on restart and dispose", () => {
  vi.useFakeTimers();
  const config = {
    seed: 42,
    deckIds: ["jardins", "aurora"] as ["jardins", "aurora"],
    mode: "standard" as const,
  };
  const c = createMatchController(config);
  c.dispatch({ type: "mulligan", ids: [] });
  c.restart({ ...config, seed: 43 });
  const before = c.getView();
  vi.runOnlyPendingTimers();
  expect(c.getView().matchId).toBe(before.matchId);
  expect(c.getView().round).toBe(1);
  c.dispose();
  const rev = c.getView().revision;
  vi.runAllTimers();
  expect(c.getView().revision).toBe(rev);
  vi.useRealTimers();
});
