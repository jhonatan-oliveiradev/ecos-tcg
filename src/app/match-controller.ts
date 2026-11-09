import type { Action, MatchConfig, PlayerView, GameState } from "../game/types";
import { createMatch } from "../game/create-match";
import { applyCommand } from "../game/commands";
import { projectView } from "../game/project-view";
import { chooseAction } from "../ai/choose-action";
export interface MatchController {
  getView(): PlayerView;
  subscribe(listener: () => void): () => void;
  dispatch(action: Action): void;
  restart(config: MatchConfig): void;
  dispose(): void;
}
export function createMatchController(config: MatchConfig): MatchController {
  let serial = 0;
  let state: GameState;
  let view: PlayerView;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  const listeners = new Set<() => void>();
  function cancel() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }
  function notify() {
    view = projectView(state, "p1");
    for (const l of listeners) l();
    schedule();
  }
  function act(action: Action, pid: "p1" | "p2") {
    const result = applyCommand(state, {
      matchId: state.matchId,
      commandId: `${state.matchId}-${state.revision}`,
      expectedRevision: state.revision,
      playerId: pid,
      action,
    });
    if (result.ok) {
      state = result.state;
      notify();
    }
  }
  function schedule() {
    cancel();
    if (disposed || state.result || state.phase === "error") return;
    const aiTurn =
      state.phase === "mulligan"
        ? !state.players.p2.mulliganDone
        : state.priority === "p2";
    const humanActions = projectView(state, "p1").actions;
    const automaticPass =
      state.phase === "response" &&
      state.priority === "p1" &&
      humanActions.length === 1 &&
      humanActions[0].action.type === "pass";
    if (!aiTurn && !automaticPass) return;
    const id = state.matchId;
    timer = setTimeout(() => {
      timer = null;
      if (disposed || state.matchId !== id) return;
      act(
        automaticPass
          ? { type: "pass" }
          : chooseAction(projectView(state, "p2"), state.seed + state.revision),
        automaticPass ? "p1" : "p2",
      );
    }, 400);
  }
  function restart(c: MatchConfig) {
    cancel();
    serial++;
    state = createMatch(c);
    state.matchId += `-session-${serial}`;
    notify();
  }
  restart(config);
  return {
    getView: () => view,
    subscribe(l) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    dispatch(a) {
      if (!disposed) act(a, "p1");
    },
    restart,
    dispose() {
      disposed = true;
      cancel();
      listeners.clear();
    },
  };
}
