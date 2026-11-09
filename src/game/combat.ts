import type { GameState } from "./types";
import { findUnit, stats, event, cleanDead, checkResult, other } from "./rules";
import { damageUnit } from "./effects";
import { scoreObjective } from "./companions";
export function advanceCombat(s: GameState): GameState {
  const c = s.combat;
  if (!c) return s;
  const attacker = findUnit(s, c.attackerId);
  if (!attacker) {
    s.combat = null;
    s.phase = "main";
    s.priority = s.returnPriority;
    return s;
  }
  if (c.step === "before-block") {
    c.step = "choose-block";
    s.phase = "block";
    s.priority = other(c.attacker);
    return s;
  }
  if (c.step === "before-damage") {
    const blocker = c.blockerId ? findUnit(s, c.blockerId) : undefined;
    let actual = 0;
    if (blocker) {
      const a = stats(s, attacker)[0],
        b = stats(s, blocker)[0];
      actual = damageUnit(s, blocker, a);
      const defended = damageUnit(s, attacker, b);
      if (s.weather.active === "rain" && defended > 0)
        scoreObjective(s, blocker.owner, "rain-combat");
    } else if (!c.blocked) {
      actual = stats(s, attacker)[0];
      s.players[other(c.attacker)].nexus -= actual;
      event(s, "nexus-damage", `Ataque ao Nexo: ${actual} de dano.`, {
        owner: c.attacker,
        amount: actual,
      });
    }
    if (actual > 0 && s.weather.active === "rain")
      scoreObjective(s, c.attacker, "rain-combat");
    cleanDead(s);
    checkResult(s);
    s.combat = null;
    if (!s.result) {
      s.phase = "main";
      s.priority = s.returnPriority;
    }
  }
  return s;
}
