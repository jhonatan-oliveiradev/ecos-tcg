import type {
  GameState,
  CommandEnvelope,
  ApplyResult,
  PlayerId,
  PendingEffect,
} from "./types";
import { CARDS } from "../content/cards";
import { COMPANIONS } from "../content/companions";
import { listLegalActions } from "./legal-actions";
import { event, other, findUnit, checkResult } from "./rules";
import { endTurn } from "./rounds";
import { shuffle } from "./random";
import { summon, resolveEffect } from "./effects";
import { advanceCombat } from "./combat";
import { naturalWeather } from "./weather";
export { listLegalActions } from "./legal-actions";
function finishAction(s: GameState, pid: PlayerId) {
  s.priority = pid;
  s.passes = 0;
  s.phase = "main";
}
function openResponse(s: GameState, pid: PlayerId) {
  s.phase = "response";
  s.priority = other(pid);
  s.passes = 0;
}
export function applyCommand(
  input: GameState,
  c: CommandEnvelope,
): ApplyResult {
  const reject = (reason: string): ApplyResult => ({
    ok: false,
    state: input,
    reason,
  });
  if (c.matchId !== input.matchId) return reject("wrong-match");
  if (input.processed.includes(c.commandId)) return reject("duplicate-command");
  if (c.expectedRevision !== input.revision) return reject("stale-revision");
  if (input.phase === "ended" || input.phase === "error")
    return reject("match-ended");
  if (c.playerId !== "p1" && c.playerId !== "p2")
    return reject("invalid-player");
  const a = c.action,
    pid = c.playerId,
    p = input.players[pid];
  if (a.type === "mulligan") {
    if (
      input.phase !== "mulligan" ||
      p.mulliganDone ||
      new Set(a.ids).size !== a.ids.length ||
      a.ids.some((id) => !p.hand.some((x) => x.id === id))
    )
      return reject("invalid-mulligan");
  } else if (
    a.type !== "concede" &&
    !listLegalActions(input, pid).some(
      (x) => JSON.stringify(x.action) === JSON.stringify(a),
    )
  )
    return reject("illegal-action");
  const s = structuredClone(input);
  const player = s.players[pid];
  const start = s.events.length;
  s.processed.push(c.commandId);
  s.revision++;
  s.passes = a.type === "pass" ? s.passes : 0;
  if (a.type === "mulligan") {
    const back = player.hand.filter((x) => a.ids.includes(x.id));
    player.hand = player.hand.filter((x) => !a.ids.includes(x.id));
    player.hand.push(...player.deck.splice(0, back.length));
    const shuffled = shuffle([...player.deck, ...back], s.rng);
    player.deck = shuffled.items;
    s.rng = shuffled.rng;
    player.mulliganDone = true;
    if (s.players.p1.mulliganDone && s.players.p2.mulliganDone) {
      s.phase = "main";
      s.weather.active = naturalWeather(s.seed, 1);
      event(s, "start", "O vínculo desperta. O duelo começou.");
    }
  } else if (a.type === "concede") {
    s.result = other(pid);
    s.phase = "ended";
    s.stack = [];
    s.combat = null;
    event(s, "concede", "Um Vinculador deixou o duelo.", { owner: pid });
  } else if (a.type === "start-battle") {
    s.turnStep = "battle";
    event(
      s,
      "battle",
      "Batalha: escolha uma criatura pronta para atacar. Atacar não custa energia.",
      { owner: pid },
    );
  } else if (a.type === "end-turn") {
    endTurn(s);
  } else if (a.type === "pass") {
    s.passes++;
    if (s.passes < 2) s.priority = other(pid);
    else {
      s.passes = 0;
      if (s.stack.length) {
        const effect = s.stack.pop()!;
        resolveEffect(s, effect);
        if (!s.result) {
          s.phase = "response";
          s.priority = other(effect.owner);
        }
      } else if (s.combat) advanceCombat(s);
      else {
        s.phase = "main";
        s.priority = s.returnPriority;
      }
    }
  } else if (a.type === "play-card") {
    const card = player.hand.find((x) => x.id === a.cardId)!;
    const d = CARDS[card.defId];
    player.hand = player.hand.filter((x) => x.id !== card.id);
    player.energy -= d.cost;
    event(s, "play", `${d.name} foi jogada.`, { owner: pid, source: d.id });
    if (d.kind === "creature") {
      summon(s, pid, card.id, d.id);
      finishAction(s, pid);
    } else {
      player.discard.push(card);
      if (s.phase === "main") s.returnPriority = s.turnOwner;
      const e: PendingEffect = {
        id: `effect-${s.nextId++}`,
        owner: pid,
        kind: d.effect!,
        source: d.id,
        target: a.target,
        amount: d.amount ?? 0,
        weather: a.weather,
        stackId: a.stackId,
        card,
        response: !!d.response,
      };
      if (d.response) {
        s.stack.push(e);
        openResponse(s, pid);
      } else {
        resolveEffect(s, e);
        if (!s.result) finishAction(s, pid);
      }
    }
  } else if (a.type === "summon-companion") {
    const def = COMPANIONS[player.companion.defId];
    player.energy -= Math.min(10, def.cost + 2 * player.companion.deaths);
    summon(s, pid, `companion-${pid}-${player.companion.deaths}`, def.id, true);
    finishAction(s, pid);
  } else if (a.type === "evolve-companion") {
    const comp = player.companion;
    const u = player.board.find((x) => x.companion)!;
    player.energy -= comp.stage === 0 ? 2 : 4;
    comp.evolvedRound = s.round;
    s.returnPriority = s.turnOwner;
    s.stack.push({
      id: `effect-${s.nextId++}`,
      owner: pid,
      kind: "evolve",
      source: comp.defId,
      target: { kind: "unit", id: u.id },
      amount: 0,
      response: false,
    });
    event(
      s,
      "evolution-start",
      "O vínculo está evoluindo. O adversário pode responder.",
      { owner: pid },
    );
    openResponse(s, pid);
  } else if (a.type === "attack") {
    findUnit(s, a.unitId)!.exhausted = true;
    s.combat = {
      attackerId: a.unitId,
      attacker: pid,
      targetId: a.targetId,
      blockerId: a.targetId,
      blocked: !!a.targetId,
      step: a.targetId ? "before-damage" : "before-block",
    };
    s.returnPriority = s.turnOwner;
    event(
      s,
      "attack",
      a.targetId
        ? "Ataque declarado contra uma criatura: haverá troca de dano."
        : "Ataque declarado contra o Nexo: o defensor pode bloquear.",
      {
        owner: pid,
        targetId: a.unitId,
      },
    );
    openResponse(s, pid);
  } else if (a.type === "block" || a.type === "decline-block") {
    if (a.type === "block") {
      findUnit(s, a.unitId)!.exhausted = true;
      s.combat!.blockerId = a.unitId;
      s.combat!.blocked = true;
      event(s, "block", "Uma criatura protege o Nexo.", {
        owner: pid,
        targetId: a.unitId,
      });
    }
    s.combat!.step = "before-damage";
    openResponse(s, pid);
  }
  checkResult(s);
  return { ok: true, state: s, events: s.events.slice(start) };
}
