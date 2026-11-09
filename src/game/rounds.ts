import type { GameState } from "./types";
import { event, cleanDead, checkResult, draw, other } from "./rules";
import { naturalWeather } from "./weather";
export function nextRound(s: GameState) {
  for (const pid of ["p1", "p2"] as const)
    for (const u of s.players[pid].board) {
      u.buff = 0;
      u.barrier = 0;
    }
  cleanDead(s);
  s.round++;
  s.weather = { active: naturalWeather(s.seed, s.round), override: null };
  s.starter = other(s.starter);
  s.priority = s.starter;
  s.turnOwner = s.starter;
  s.turnStep = "preparation";
  s.turnsEnded = 0;
  s.returnPriority = s.starter;
  s.passes = 0;
  s.phase = "main";
  for (const pid of ["p1", "p2"] as const) {
    const p = s.players[pid];
    p.maxEnergy = Math.min(10, s.round);
    p.energy = p.maxEnergy;
    p.companion.scored = [];
    for (const u of p.board) u.exhausted = false;
    draw(s, pid);
  }
  event(s, "round", `Rodada ${s.round}: energia restaurada.`);
  checkResult(s);
}

export function endTurn(s: GameState) {
  s.turnsEnded++;
  if (s.turnsEnded === 2) return nextRound(s);
  s.turnOwner = other(s.turnOwner);
  s.priority = s.turnOwner;
  s.returnPriority = s.turnOwner;
  s.turnStep = "preparation";
  s.passes = 0;
  event(s, "turn", "Novo turno: prepare suas cartas e entre na batalha.", {
    owner: s.turnOwner,
  });
}
