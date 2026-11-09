import type { PlayerView, PendingEffect } from "../../game/types";
import { CARDS } from "../../content/cards";
import { COMPANIONS, STAGES, companionName } from "../../content/companions";
export function describeUnit(v: PlayerView, id: string): string {
  const own = v.self.board.findIndex((u) => u.id === id);
  const index = own >= 0 ? own : v.opponent.board.findIndex((u) => u.id === id);
  const u = own >= 0 ? v.self.board[index] : v.opponent.board[index];
  if (!u) return "Alvo que já saiu do campo";
  return `${own >= 0 ? "Seu" : "Adversário:"} ${u.companion ? companionName(u.defId, u.stage) : CARDS[u.defId].name} · posição ${index + 1}`;
}
function choice(v: PlayerView, e: PendingEffect) {
  const target =
    e.target?.kind === "unit"
      ? describeUnit(v, e.target.id)
      : e.target?.kind === "nexus"
        ? "Nexo"
        : "";
  switch (e.kind) {
    case "damage":
      return `${e.amount} de dano → ${target}`;
    case "heal":
      return `Restaurar ${e.amount} → ${target}`;
    case "barrier":
      return `Barreira ${e.amount} → ${target}`;
    case "buff":
      return `+${e.amount}/+${e.amount} nesta rodada → ${target}`;
    case "weather":
      return e.weather === "rain"
        ? "Clima escolhido: Chuva condutora"
        : "Clima escolhido: Tempo estável";
    case "cancel": {
      const pending = v.stack.find((x) => x.id === e.stackId);
      return `Interromper: ${pending ? (CARDS[pending.source]?.name ?? "tática") : "tática que já saiu da pilha"}`;
    }
    case "evolve": {
      const c = (e.owner === v.playerId ? v.self : v.opponent).companion;
      const def = COMPANIONS[c.defId];
      const stage = Math.min(2, c.stage + 1);
      return `${target} → ${def.forms[stage]} (${STAGES[stage]}), ${def.stats[stage].join(" / ")}${stage === 2 ? ". " + def.ascension.text : ""}`;
    }
    default:
      return `${e.amount} · ${e.owner === v.playerId ? "seu campo" : "campo adversário"}`;
  }
}
export function PendingEffects({ view: v }: { view: PlayerView }) {
  return (
    <div className="stack-list" aria-label="Efeitos pendentes">
      {[...v.stack].reverse().map((e, i) => (
        <div key={e.id}>
          <span>{i === 0 ? "PRÓXIMO A RESOLVER" : "NA PILHA"}</span>
          <strong>
            {CARDS[e.source]?.name ??
              `Evolução de ${COMPANIONS[e.source]?.name}`}
          </strong>
          <p className="effect-choice">{choice(v, e)}</p>
          <small>{e.owner === v.playerId ? "Você" : "Iara"}</small>
        </div>
      ))}
    </div>
  );
}
