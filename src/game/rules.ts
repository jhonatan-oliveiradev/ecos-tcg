import type { GameState, PlayerId, Unit, GameEvent } from "./types";
import { CARDS } from "../content/cards";
import { COMPANIONS } from "../content/companions";
export const other = (p: PlayerId): PlayerId => (p === "p1" ? "p2" : "p1");
export function event(
  s: GameState,
  type: string,
  text: string,
  extra: Partial<GameEvent> = {},
) {
  s.events.push({ id: s.nextId++, round: s.round, type, text, ...extra });
}
export function findUnit(s: GameState, id: string) {
  return [...s.players.p1.board, ...s.players.p2.board].find(
    (u) => u.id === id,
  );
}
export function stats(
  s: Pick<GameState, "weather">,
  u: Unit,
): [number, number] {
  const base = u.companion
    ? COMPANIONS[u.defId].stats[u.stage]
    : [CARDS[u.defId].attack!, CARDS[u.defId].health!];
  return [
    base[0] +
      u.buff +
      (!u.companion && CARDS[u.defId].conductor && s.weather.active === "rain"
        ? 1
        : 0),
    base[1] + u.buff,
  ];
}
export function cleanDead(s: GameState) {
  for (const pid of ["p1", "p2"] as const) {
    const p = s.players[pid];
    for (const u of [...p.board])
      if (u.damage >= stats(s, u)[1]) {
        p.board = p.board.filter((x) => x.id !== u.id);
        if (u.companion) {
          p.companion.deaths++;
          p.companion.availableRound = s.round + 2;
          p.companion.stage = 0;
          p.companion.awakenedRound = 0;
          event(
            s,
            "companion-defeated",
            `${COMPANIONS[u.defId].name} retorna ao vínculo.`,
            { owner: pid },
          );
        } else p.discard.push({ id: u.id, defId: u.defId });
        event(s, "defeat", "Uma criatura deixou o campo.", {
          owner: pid,
          targetId: u.id,
        });
      }
  }
}
export function checkResult(s: GameState) {
  const a = s.players.p1.nexus <= 0,
    b = s.players.p2.nexus <= 0;
  if (a || b) {
    s.result = a && b ? "draw" : a ? "p2" : "p1";
    s.phase = "ended";
    s.stack = [];
    s.combat = null;
    event(
      s,
      "result",
      s.result === "draw" ? "O duelo terminou em empate." : `O duelo terminou.`,
      { owner: s.result === "draw" ? undefined : s.result },
    );
  }
}
export function draw(s: GameState, pid: PlayerId, count = 1) {
  const p = s.players[pid];
  for (let i = 0; i < count; i++) {
    const c = p.deck.shift();
    if (!c) {
      p.fatigue++;
      p.nexus -= p.fatigue;
      event(s, "fatigue", `Fadiga: ${p.fatigue} de dano ao Nexo.`, {
        owner: pid,
        amount: p.fatigue,
      });
    } else if (p.hand.length >= 8) {
      p.discard.push(c);
      event(
        s,
        "overflow",
        `${CARDS[c.defId].name} foi descartada: mão cheia.`,
        { owner: pid },
      );
    } else {
      p.hand.push(c);
      event(s, "draw", "Uma carta foi comprada.", { owner: pid });
    }
  }
}
