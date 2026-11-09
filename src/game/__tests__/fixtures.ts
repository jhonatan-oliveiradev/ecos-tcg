import { createMatch } from "../create-match";
import { applyCommand } from "../commands";
import type { GameState, PlayerId, Action } from "../types";
export function send(s: GameState, p: PlayerId, a: Action) {
  const r = applyCommand(s, {
    matchId: s.matchId,
    commandId: `cmd-${s.revision}`,
    expectedRevision: s.revision,
    playerId: p,
    action: a,
  });
  if (!r.ok) throw new Error(r.reason);
  return r.state;
}
export function ready() {
  let s = createMatch({
    seed: 42,
    deckIds: ["jardins", "aurora"],
    mode: "standard",
  });
  s = send(s, "p1", { type: "mulligan", ids: [] });
  return send(s, "p2", { type: "mulligan", ids: [] });
}
