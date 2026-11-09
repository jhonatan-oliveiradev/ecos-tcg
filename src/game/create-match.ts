import type { GameState, MatchConfig, PlayerId, PlayerState } from "./types";
import { shuffle, nextRandom } from "./random";
import { deckCards, DECKS } from "../content/decks";
export function createMatch(config: MatchConfig): GameState {
  let rng = config.seed || 1;
  const players = {} as Record<PlayerId, PlayerState>;
  for (const [i, pid] of (["p1", "p2"] as const).entries()) {
    const id = config.deckIds[i];
    const cards = deckCards(id).map((defId, j) => ({
      id: `${pid}-c${j}`,
      defId,
    }));
    const out = shuffle(cards, rng);
    rng = out.rng;
    players[pid] = {
      teamId: pid,
      nexus: 25,
      energy: 1,
      maxEnergy: 1,
      hand: out.items.slice(0, 4),
      deck: out.items.slice(4),
      discard: [],
      board: [],
      fatigue: 0,
      mulliganDone: false,
      companion: {
        defId: DECKS[id].companion,
        stage: 0,
        deaths: 0,
        availableRound: 1,
        evolvedRound: 0,
        awakenedRound: 0,
        resonance: 0,
        scored: [],
        history: [],
      },
    };
  }
  const pick = nextRandom(rng);
  const starter = pick.value < 0.5 ? "p1" : "p2";
  return {
    matchId: `match-${config.seed}-${config.deckIds.join("-")}`,
    revision: 0,
    rng: pick.rng,
    seed: config.seed,
    mode: config.mode,
    phase: "mulligan",
    round: 1,
    priority: starter,
    starter,
    players,
    stack: [],
    combat: null,
    weather: { active: "stable", override: null },
    passes: 0,
    returnPriority: starter,
    events: [],
    processed: [],
    result: null,
    nextId: 1,
  };
}
