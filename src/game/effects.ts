import type { GameState, PendingEffect, PlayerId, Unit } from "./types";
import { CARDS } from "../content/cards";
import { COMPANIONS, companionName } from "../content/companions";
import {
  findUnit,
  stats,
  event,
  cleanDead,
  checkResult,
  draw,
  other,
} from "./rules";
import { scoreObjective } from "./companions";
export function heal(s: GameState, u: Unit, n: number) {
  const actual = Math.min(n, u.damage);
  u.damage -= actual;
  if (actual > 0) {
    event(s, "heal", `Restauração: ${actual} de vida.`, {
      owner: u.owner,
      targetId: u.id,
      amount: actual,
    });
    scoreObjective(s, u.owner, "heal");
  }
  return actual;
}
export function damageUnit(s: GameState, u: Unit, n: number) {
  const absorbed = Math.min(u.barrier, n);
  if (absorbed > 0) {
    u.barrier = 0;
    event(s, "protect", `Barreira preveniu ${absorbed} de dano.`, {
      owner: u.owner,
      targetId: u.id,
      amount: absorbed,
    });
    scoreObjective(s, u.owner, "protect");
  }
  const actual = Math.max(0, n - absorbed);
  u.damage += actual;
  if (actual)
    event(s, "damage", `${actual} de dano a uma criatura.`, {
      owner: u.owner,
      targetId: u.id,
      amount: actual,
    });
  return actual;
}
export function summon(
  s: GameState,
  pid: PlayerId,
  id: string,
  defId: string,
  companion = false,
) {
  const p = s.players[pid];
  const u: Unit = {
    id,
    defId,
    owner: pid,
    damage: 0,
    exhausted: false,
    enteredRound: s.round,
    barrier: 0,
    buff: 0,
    companion,
    stage: 0,
  };
  p.board.push(u);
  event(
    s,
    "summon",
    `${companion ? COMPANIONS[defId].name : CARDS[defId].name} entrou no campo.`,
    { owner: pid, source: defId, targetId: id },
  );
  if (!companion && CARDS[defId].onEnterHeal) {
    const target = p.board
      .filter((x) => x.id !== id && x.damage > 0)
      .sort((a, b) => b.damage - a.damage)[0];
    if (target) heal(s, target, 2);
  }
}
export function resolveEffect(s: GameState, e: PendingEffect): GameState {
  const u = e.target?.kind === "unit" ? findUnit(s, e.target.id) : undefined;
  let effective = 0;
  switch (e.kind) {
    case "heal":
      if (u) effective = heal(s, u, e.amount);
      break;
    case "damage":
      if (u) effective = damageUnit(s, u, e.amount);
      break;
    case "barrier":
      if (u) {
        effective = Math.max(0, e.amount - u.barrier);
        u.barrier = Math.max(u.barrier, e.amount);
      }
      break;
    case "buff":
      if (u) {
        u.buff += e.amount;
        effective = e.amount;
      }
      break;
    case "draw":
      draw(s, e.owner, e.amount);
      effective = e.amount;
      break;
    case "weather":
      if (e.weather) {
        effective = Number(s.weather.active !== e.weather);
        s.weather.active = e.weather;
        s.weather.override = e.weather;
        event(
          s,
          "weather",
          e.weather === "rain"
            ? "Chuva condutora chegou à arena."
            : "O céu ficou estável.",
          { owner: e.owner },
        );
      }
      break;
    case "cancel": {
      const i = s.stack.findIndex(
        (x) => x.id === e.stackId && x.owner !== e.owner && x.card,
      );
      if (i >= 0) {
        s.stack.splice(i, 1);
        effective = 1;
        event(s, "cancel", "Uma tática foi interrompida.", { owner: e.owner });
      }
      break;
    }
    case "heal-all":
      for (const unit of s.players[e.owner].board)
        effective += heal(s, unit, e.amount);
      break;
    case "evolve":
      if (u && u.companion && u.owner === e.owner && u.stage < 2) {
        u.stage = (u.stage + 1) as 1 | 2;
        const c = s.players[e.owner].companion;
        c.stage = u.stage;
        if (u.stage === 1) c.awakenedRound = s.round;
        event(
          s,
          "evolve",
          `${companionName(u.defId, u.stage)} ${u.stage === 1 ? "despertou" : "ascendeu"}!`,
          { owner: e.owner, amount: u.stage },
        );
        if (u.stage === 2) {
          if (COMPANIONS[c.defId].ascension.kind === "heal-all")
            for (const target of s.players[e.owner].board)
              heal(s, target, COMPANIONS[c.defId].ascension.amount);
          else
            for (const target of s.players[other(e.owner)].board)
              damageUnit(s, target, COMPANIONS[c.defId].ascension.amount);
        }
        effective = 1;
      }
      break;
    case "summon":
      break;
    case "ascend-damage":
      break;
  }
  if (e.response && effective > 0) scoreObjective(s, e.owner, "response");
  cleanDead(s);
  checkResult(s);
  return s;
}
export { stats };
