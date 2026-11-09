import type { Action, PlayerView, LegalAction } from "../game/types";
import { CARDS } from "../content/cards";
import { stats } from "../game/rules";
export function chooseAction(view: PlayerView, seed: number): Action {
  const score = ({ action: a }: LegalAction): number => {
    const own = view.self;
    const enemy = view.opponent;
    const context = { weather: { active: view.weather, override: null } };
    switch (a.type) {
      case "mulligan":
        return 100;
      case "pass":
        return 0;
      case "evolve-companion":
        return 90;
      case "summon-companion":
        return 80;
      case "attack": {
        const u = own.board.find((x) => x.id === a.unitId)!;
        const atk = stats(context, u)[0];
        return atk >= enemy.nexus ? 150 : 40 + atk;
      }
      case "decline-block":
        return own.nexus > 12 ? 2 : -10;
      case "block": {
        const u = own.board.find((x) => x.id === a.unitId)!;
        const attacker = enemy.board.find(
          (x) => x.id === view.combat?.attackerId,
        );
        if (!attacker) return 0;
        const attack = stats(context, attacker)[0];
        const hp = stats(context, u)[1] - u.damage;
        return (
          (attack >= own.nexus ? 140 : 20) +
          (hp > attack ? 10 : 0) -
          Number(u.companion) * 5
        );
      }
      case "play-card": {
        const card = own.hand.find((x) => x.id === a.cardId)!;
        const d = CARDS[card.defId];
        if (d.kind === "creature") return 35 + d.cost;
        switch (d.effect) {
          case "heal": {
            const u = own.board.find(
              (x) => x.id === (a.target?.kind === "unit" ? a.target.id : ""),
            );
            return 25 + Math.min(2, u?.damage ?? 0) * 2;
          }
          case "barrier":
            return view.combat &&
              a.target?.kind === "unit" &&
              (view.combat.attackerId === a.target.id ||
                view.combat.blockerId === a.target.id)
              ? 70
              : -2;
          case "damage": {
            const u = enemy.board.find(
              (x) => x.id === (a.target?.kind === "unit" ? a.target.id : ""),
            );
            return u
              ? 30 +
                  Number(stats(context, u)[1] - u.damage <= (d.amount ?? 0)) *
                    25
              : 0;
          }
          case "cancel":
            return 75;
          case "buff":
            return view.combat ? 60 : 10;
          case "weather":
            return view.weather !== a.weather &&
              a.weather === "rain" &&
              own.companion.defId === "sintila"
              ? 12
              : -1;
          case "draw":
            return 30 - own.hand.length;
          case "heal-all":
            return 30;
          default:
            return 1;
        }
      }
      default:
        return -100;
    }
  };
  const choices = view.actions
    .map((a, i) => ({
      a,
      score: score(a),
      tie: ((seed * 13 + i * 17) % 97) / 1000,
    }))
    .sort((a, b) => b.score + b.tie - (a.score + a.tie));
  return choices[0]?.a.action ?? { type: "pass" };
}
