export type PlayerId = "p1" | "p2";
export type DeckId = "jardins" | "aurora";
export type WeatherId = "stable" | "rain";
export type Target =
  { kind: "unit"; id: string } | { kind: "nexus"; playerId: PlayerId };
export type EffectKind =
  | "heal"
  | "barrier"
  | "damage"
  | "draw"
  | "weather"
  | "buff"
  | "cancel"
  | "heal-all"
  | "summon";
export interface CardDef {
  id: string;
  name: string;
  cost: number;
  region: "neutral" | DeckId;
  kind: "creature" | "tactic";
  attack?: number;
  health?: number;
  effect?: EffectKind;
  amount?: number;
  response?: boolean;
  haste?: boolean;
  onEnterHeal?: boolean;
  conductor?: boolean;
  art: number;
  rarity: "Comum" | "Incomum" | "Rara" | "Lendária";
  text: string;
}
export interface CardInstance {
  id: string;
  defId: string;
}
export interface Unit {
  id: string;
  defId: string;
  owner: PlayerId;
  damage: number;
  exhausted: boolean;
  enteredRound: number;
  barrier: number;
  buff: number;
  companion: boolean;
  stage: 0 | 1 | 2;
}
export interface CompanionDef {
  forms: readonly [string, string, string];
  ascension: {
    kind: "heal-all" | "damage-enemies";
    amount: number;
    text: string;
  };
  id: string;
  name: string;
  region: DeckId;
  cost: number;
  stats: readonly (readonly [number, number])[];
  art: number;
  objectives: readonly string[];
  description: string;
}
export interface CompanionState {
  defId: string;
  stage: 0 | 1 | 2;
  deaths: number;
  availableRound: number;
  evolvedRound: number;
  awakenedRound: number;
  resonance: number;
  scored: string[];
  history: number[];
}
export interface PlayerState {
  teamId: string;
  nexus: number;
  energy: number;
  maxEnergy: number;
  hand: CardInstance[];
  deck: CardInstance[];
  discard: CardInstance[];
  board: Unit[];
  companion: CompanionState;
  fatigue: number;
  mulliganDone: boolean;
}
export type Action =
  | { type: "mulligan"; ids: string[] }
  | {
      type: "play-card";
      cardId: string;
      target?: Target;
      weather?: WeatherId;
      stackId?: string;
    }
  | { type: "summon-companion" }
  | { type: "evolve-companion" }
  | { type: "attack"; unitId: string }
  | { type: "block"; unitId: string }
  | { type: "decline-block" }
  | { type: "pass" }
  | { type: "concede" };
export interface PendingEffect {
  id: string;
  owner: PlayerId;
  kind: EffectKind | "evolve" | "ascend-damage";
  source: string;
  target?: Target;
  amount: number;
  weather?: WeatherId;
  stackId?: string;
  card?: CardInstance;
  response: boolean;
}
export interface GameEvent {
  id: number;
  type: string;
  round: number;
  owner?: PlayerId;
  source?: string;
  targetId?: string;
  amount?: number;
  text: string;
}
export interface Combat {
  attackerId: string;
  attacker: PlayerId;
  blockerId?: string;
  blocked: boolean;
  step: "before-block" | "choose-block" | "before-damage";
}
export interface GameState {
  matchId: string;
  revision: number;
  rng: number;
  seed: number;
  mode: "standard" | "tutorial";
  phase: "mulligan" | "main" | "response" | "block" | "ended" | "error";
  round: number;
  priority: PlayerId;
  starter: PlayerId;
  players: Record<PlayerId, PlayerState>;
  stack: PendingEffect[];
  combat: Combat | null;
  weather: { active: WeatherId; override: WeatherId | null };
  passes: number;
  returnPriority: PlayerId;
  events: GameEvent[];
  processed: string[];
  result: null | "p1" | "p2" | "draw";
  error?: string;
  nextId: number;
}
export interface MatchConfig {
  seed: number;
  deckIds: [DeckId, DeckId];
  mode: "standard" | "tutorial";
}
export interface CommandEnvelope {
  matchId: string;
  commandId: string;
  expectedRevision: number;
  playerId: PlayerId;
  action: Action;
}
export type ApplyResult =
  | { ok: true; state: GameState; events: GameEvent[] }
  | { ok: false; state: GameState; reason: string };
export interface LegalAction {
  action: Action;
  label: string;
}
export interface PublicPlayer {
  teamId: string;
  nexus: number;
  energy: number;
  maxEnergy: number;
  handCount: number;
  deckCount: number;
  discard: CardInstance[];
  board: Unit[];
  companion: CompanionState;
  fatigue: number;
}
export interface PlayerView {
  matchId: string;
  revision: number;
  playerId: PlayerId;
  round: number;
  phase: GameState["phase"];
  priority: PlayerId;
  self: PublicPlayer & { hand: CardInstance[] };
  opponent: PublicPlayer;
  weather: WeatherId;
  forecast: WeatherId[];
  stack: PendingEffect[];
  combat: Combat | null;
  actions: LegalAction[];
  events: GameEvent[];
  result: GameState["result"];
  error?: string;
}
