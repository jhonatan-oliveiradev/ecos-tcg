import { useSyncExternalStore } from "react";
import type { MatchController } from "./match-controller";
export function useMatch(controller: MatchController) {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getView,
    controller.getView,
  );
}
