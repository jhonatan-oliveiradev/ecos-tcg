import type { GameState, PlayerId, PublicPlayer, PlayerView } from "./types";
import { other } from "./rules";
import { getForecast } from "./weather";
import { listLegalActions } from "./legal-actions";
export function projectView(s: GameState, pid: PlayerId): PlayerView {
  const project = (id: PlayerId): PublicPlayer => {
    const p = s.players[id];
    return {
      teamId: p.teamId,
      nexus: p.nexus,
      energy: p.energy,
      maxEnergy: p.maxEnergy,
      handCount: p.hand.length,
      deckCount: p.deck.length,
      discard: p.discard,
      board: p.board,
      companion: p.companion,
      fatigue: p.fatigue,
    };
  };
  return structuredClone({
    matchId: s.matchId,
    revision: s.revision,
    playerId: pid,
    round: s.round,
    phase: s.phase,
    priority: s.priority,
    turnOwner: s.turnOwner,
    turnStep: s.turnStep,
    turnsEnded: s.turnsEnded,
    self: { ...project(pid), hand: s.players[pid].hand },
    opponent: project(other(pid)),
    weather: s.weather.active,
    forecast: getForecast(s, 2),
    stack: s.stack,
    combat: s.combat,
    actions: listLegalActions(s, pid),
    events: s.events,
    result: s.result,
    error: s.error,
  });
}
