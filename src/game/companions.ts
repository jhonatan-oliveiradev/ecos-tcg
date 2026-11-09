import type { GameState, PlayerId } from "./types";
import { companionName } from "../content/companions";
import { event } from "./rules";
export function scoreObjective(s: GameState, pid: PlayerId, key: string) {
  const p = s.players[pid],
    c = p.companion;
  if (
    !p.board.some((u) => u.companion) ||
    c.scored.includes(key) ||
    c.scored.length >= 2
  )
    return;
  const valid =
    c.defId === "brotoco" ? ["heal", "protect"] : ["response", "rain-combat"];
  if (!valid.includes(key)) return;
  c.scored.push(key);
  c.resonance++;
  if (
    (c.defId === "brotoco" && key === "heal") ||
    (c.defId === "sintila" && key === "response")
  )
    if (!c.history.includes(s.round)) c.history.push(s.round);
  event(
    s,
    "resonance",
    `${companionName(c.defId, c.stage)}: +1 de ressonância.`,
    {
      owner: pid,
      amount: 1,
    },
  );
}
export function getEvolutionBlockers(s: GameState, pid: PlayerId): string[] {
  const p = s.players[pid],
    c = p.companion;
  const reasons: string[] = [];
  if (!p.board.some((u) => u.companion))
    reasons.push("Invoque sua companheira.");
  if (c.stage === 2) reasons.push("Estágio máximo alcançado.");
  if (c.resonance < (c.stage === 0 ? 3 : 7))
    reasons.push(`Exige ${c.stage === 0 ? 3 : 7} de ressonância.`);
  if (c.evolvedRound === s.round) reasons.push("Já evoluiu nesta rodada.");
  if (p.energy < (c.stage === 0 ? 2 : 4)) reasons.push("Energia insuficiente.");
  if (c.stage === 1 && (c.awakenedRound >= s.round || c.history.length < 2))
    reasons.push(
      "Exige Desperta em rodada anterior e objetivo temático em duas rodadas.",
    );
  return reasons;
}
