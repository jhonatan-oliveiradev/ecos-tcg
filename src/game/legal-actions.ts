import type { GameState, PlayerId, LegalAction, Action, Target } from "./types";
import { CARDS } from "../content/cards";
import { COMPANIONS } from "../content/companions";
import { other, stats } from "./rules";
import { getEvolutionBlockers } from "./companions";
export function listLegalActions(s: GameState, pid: PlayerId): LegalAction[] {
  const out: LegalAction[] = [];
  const add = (action: Action, label: string) => out.push({ action, label });
  const p = s.players[pid];
  if (s.phase === "ended" || s.phase === "error") return out;
  if (s.phase === "mulligan") {
    if (!p.mulliganDone) add({ type: "mulligan", ids: [] }, "Manter mão");
    return out;
  }
  if (s.priority !== pid) return out;
  if (s.phase === "block") {
    for (const u of p.board)
      if (!u.exhausted) add({ type: "block", unitId: u.id }, "Bloquear");
    add({ type: "decline-block" }, "Receber no Nexo");
    return out;
  }
  if (s.phase === "response") add({ type: "pass" }, "Continuar resolução");
  if (s.phase === "main") {
    add({ type: "end-turn" }, "Encerrar turno");
    if (s.turnStep === "preparation")
      add({ type: "start-battle" }, "Ir para batalha");
  }
  if (s.phase === "main" && s.turnStep === "preparation") {
    const c = p.companion,
      def = COMPANIONS[c.defId];
    if (
      !p.board.some((u) => u.companion) &&
      p.board.length < 5 &&
      p.energy >= Math.min(10, def.cost + 2 * c.deaths) &&
      s.round >= c.availableRound
    )
      add({ type: "summon-companion" }, `Invocar ${def.name}`);
    if (!getEvolutionBlockers(s, pid).length)
      add(
        { type: "evolve-companion" },
        c.stage === 0 ? "Despertar" : "Ascender",
      );
  }
  if (s.phase === "main" && s.turnStep === "battle") {
    for (const u of p.board)
      if (
        !u.exhausted &&
        (u.enteredRound < s.round || (!u.companion && CARDS[u.defId].haste))
      ) {
        add({ type: "attack", unitId: u.id }, "Atacar Nexo");
        for (const [index, target] of s.players[other(pid)].board.entries()) {
          const name = target.companion
            ? COMPANIONS[target.defId].forms[target.stage]
            : CARDS[target.defId].name;
          const damage = Math.max(0, stats(s, u)[0] - target.barrier);
          add(
            { type: "attack", unitId: u.id, targetId: target.id },
            `Atacar ${name} · posição ${index + 1} · ${damage} de dano previsto · recebe até ${Math.max(0, stats(s, target)[0] - u.barrier)}`,
          );
        }
      }
  }
  for (const card of p.hand) {
    const d = CARDS[card.defId];
    if (p.energy < d.cost) continue;
    if ((s.phase === "response" || s.turnStep === "battle") && !d.response)
      continue;
    if (d.kind === "creature") {
      if (
        s.phase === "main" &&
        s.turnStep === "preparation" &&
        p.board.length < 5
      )
        add({ type: "play-card", cardId: card.id }, `Invocar ${d.name}`);
      continue;
    }
    const base = { type: "play-card" as const, cardId: card.id };
    const target = (t: Target) => add({ ...base, target: t }, d.name);
    switch (d.effect) {
      case "heal":
        for (const u of p.board)
          if (u.damage > 0) target({ kind: "unit", id: u.id });
        break;
      case "barrier":
        for (const u of p.board)
          if (u.barrier < (d.amount ?? 0)) target({ kind: "unit", id: u.id });
        break;
      case "buff":
        for (const u of p.board) target({ kind: "unit", id: u.id });
        break;
      case "damage":
        for (const u of s.players[other(pid)].board)
          target({ kind: "unit", id: u.id });
        break;
      case "weather":
        for (const weather of ["stable", "rain"] as const)
          add(
            { ...base, weather },
            weather === "rain" ? "Trazer chuva" : "Tempo estável",
          );
        break;
      case "cancel":
        for (const e of s.stack)
          if (e.owner !== pid && e.card)
            add(
              { ...base, stackId: e.id },
              `Interromper ${CARDS[e.card.defId].name}`,
            );
        break;
      case "heal-all":
        if (p.board.some((u) => u.damage > 0)) add(base, d.name);
        break;
      default:
        add(base, d.name);
    }
  }
  return out;
}
