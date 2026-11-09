import type { CompanionDef } from "../game/types";
export const COMPANIONS: Record<string, CompanionDef> = {
  brotoco: {
    id: "brotoco",
    ascension: {
      kind: "heal-all",
      amount: 3,
      text: "Restaure 3 de vida de cada criatura aliada, incluindo Ceroto.",
    },
    name: "Brotoco",
    forms: ["Brotoco", "Terruno", "Ceroto"],
    region: "jardins",
    cost: 2,
    stats: [
      [1, 4],
      [2, 6],
      [5, 8],
    ],
    art: 0,
    objectives: [
      "Restaure a vida de um aliado ferido.",
      "Previna dano a um aliado com Barreira.",
    ],
    description: "Entre rachaduras de cerâmica, um jardim aprendeu a sentir.",
  },
  sintila: {
    id: "sintila",
    ascension: {
      kind: "damage-enemies",
      amount: 1,
      text: "Cause 1 de dano a cada criatura inimiga como um único efeito.",
    },
    name: "Sintila",
    forms: ["Sintila", "Voltria", "Voltria Ascendente"],
    region: "aurora",
    cost: 2,
    stats: [
      [2, 3],
      [3, 5],
      [6, 6],
    ],
    art: 4,
    objectives: [
      "Resolva uma carta de Resposta com efeito.",
      "Cause dano de combate durante a chuva.",
    ],
    description:
      "Ela coleciona sinais de um mundo que ainda tem muito a dizer.",
  },
};
export const STAGES = ["Inicial", "Desperta", "Ascendente"] as const;

export function companionName(id: string, stage: number = 0): string {
  return COMPANIONS[id].forms[stage] ?? COMPANIONS[id].name;
}
