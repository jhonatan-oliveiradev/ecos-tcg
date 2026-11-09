import { it, expect } from "vitest";
import { ready, send } from "./fixtures";
import { getEvolutionBlockers, scoreObjective } from "../companions";
import { getForecast, naturalWeather } from "../weather";
it("resonance is capped by objective and round", () => {
  const s = ready();
  s.players.p1.board.push({
    id: "pet",
    defId: "brotoco",
    owner: "p1",
    damage: 0,
    exhausted: false,
    enteredRound: 1,
    barrier: 0,
    buff: 0,
    companion: true,
    stage: 0,
  });
  scoreObjective(s, "p1", "heal");
  scoreObjective(s, "p1", "heal");
  scoreObjective(s, "p1", "protect");
  expect(s.players.p1.companion.resonance).toBe(2);
});
it("evolution needs preparation and preserves damage", () => {
  let s = ready();
  s.priority = "p1";
  s.round = 3;
  s.players.p1.energy = 10;
  s = send(s, "p1", { type: "summon-companion" });
  s.priority = "p1";
  s.players.p1.companion.resonance = 3;
  s.players.p1.board[0].damage = 1;
  s = send(s, "p1", { type: "evolve-companion" });
  for (let i = 0; i < 4 && s.phase === "response"; i++)
    s = send(s, s.priority, { type: "pass" });
  expect(s.players.p1.companion.stage).toBe(1);
  expect(s.players.p1.companion.resonance).toBe(3);
  expect(s.players.p1.board[0].damage).toBe(1);
  expect(getEvolutionBlockers(s, "p1").length).toBeGreaterThan(0);
});
it("weather forecast is reproducible with one rainy round per block", () => {
  const s = ready();
  expect(getForecast(s, 2)).toHaveLength(2);
  expect(getForecast(s, 2)).toEqual(getForecast(s, 2));
  for (let start = 1; start < 20; start += 3)
    expect(
      [0, 1, 2].filter((i) => naturalWeather(s.seed, start + i) === "rain"),
    ).toHaveLength(1);
});
