export interface CreatureEntry {
  id: string;
  name: string;
  cell: number;
  habitat: string;
  personality: string;
  role: string;
  synergy: string;
  line: string;
  playable: boolean;
}
export const CREATURES: CreatureEntry[] = [
  {
    id: "brotoco",
    name: "Brotoco",
    cell: 0,
    habitat: "Vasos esquecidos nas plataformas da estação.",
    personality: "Teimoso, pequeno e sempre disposto a proteger alguém maior.",
    role: "Companheira · resistência e cura",
    synergy:
      "Abrigo previne dano e Reparo recupera aliados. Com Brotoco em campo, esses objetivos alimentam a evolução.",
    line: "Brotoco → Terruno → Ceroto",
    playable: true,
  },
  {
    id: "terruno",
    name: "Terruno",
    cell: 1,
    habitat: "Oficinas de cerâmica retomadas pelos jardins.",
    personality: "Paciente: testa o chão antes de deixar os menores passar.",
    role: "Evolução · sustentação",
    synergy:
      "Despertar: 3 de ressonância e 2 de energia. Mantém o dano acumulado e amplia os atributos para 2/6.",
    line: "Brotoco → Terruno → Ceroto",
    playable: true,
  },
  {
    id: "ceroto",
    name: "Ceroto",
    cell: 2,
    habitat: "Arcos e pátios que abrigam novos jardins.",
    personality:
      "Seu corpo vira abrigo quando a cidade enfrenta uma tempestade.",
    role: "Evolução · recuperação coletiva",
    synergy:
      "Ao ascender, restaura 3 de vida de cada aliado. Exige ressonância e objetivos em rodadas distintas.",
    line: "Brotoco → Terruno → Ceroto",
    playable: true,
  },
  {
    id: "sintila",
    name: "Sintila",
    cell: 3,
    habitat: "Antenas desativadas sobre os telhados de Aurora.",
    personality: "Curiosa: responde a cada assobio como se fosse uma conversa.",
    role: "Companheira · respostas e clima",
    synergy:
      "Respostas com efeito e dano de combate sob chuva concedem ressonância enquanto Sintila estiver em campo.",
    line: "Sintila → Voltria → Voltria Ascendente",
    playable: true,
  },
  {
    id: "voltria",
    name: "Voltria",
    cell: 4,
    habitat: "Torres de transmissão que anunciam as chuvas.",
    personality: "Vigilante: abre as asas para escutar sinais distantes.",
    role: "Evolução · pressão de combate",
    synergy:
      "A forma Desperta tem 3/5. Ao ascender, chega a 6/6 e causa 1 de dano a cada criatura adversária.",
    line: "Sintila → Voltria → Voltria Ascendente",
    playable: true,
  },
  {
    id: "cerviga",
    name: "Cerviga",
    cell: 5,
    habitat: "Passarelas e canais de concreto.",
    personality: "Tranquila: só atravessa depois que todos passaram.",
    role: "Cervo de Concreto · criatura 4/6",
    synergy:
      "Vida alta para sobreviver ao combate; Reparo e Restauração permitem recuperar o mesmo corpo em vez de substituí-lo.",
    line: "Espécie sem evolução jogável neste conjunto",
    playable: true,
  },
  {
    id: "pipinal",
    name: "Pipinal",
    cell: 6,
    habitat: "Cabos entre os mercados de Aurora.",
    personality:
      "Falante e apressado: vive entregando recados no lugar errado.",
    role: "Ave de Sinal · criatura 2/1",
    synergy:
      "Custa 1: cria pressão cedo. Abrigo pode preservar sua única vida, mas não concede Veloz.",
    line: "Espécie sem evolução jogável neste conjunto",
    playable: true,
  },
  {
    id: "musguil",
    name: "Musguil",
    cell: 7,
    habitat: "Telhas úmidas e jardins suspensos.",
    personality: "Tímido: parece uma telha até alguém precisar de companhia.",
    role: "Vigia de Musgo · criatura 1/2",
    synergy:
      "Custa 1: ocupa o campo cedo e pode proteger o Nexo. Curá-lo depois de sobreviver ajuda o vínculo de Brotoco.",
    line: "Espécie sem evolução jogável neste conjunto",
    playable: true,
  },
];
export function creatureFor(defId: string, stage = 0) {
  const id =
    defId === "brotoco"
      ? ["brotoco", "terruno", "ceroto"][stage]
      : defId === "sintila"
        ? stage === 0
          ? "sintila"
          : "voltria"
        : (
            {
              "cervo-concreto": "cerviga",
              "ave-sinal": "pipinal",
              "vigia-musgo": "musguil",
            } as Record<string, string>
          )[defId];
  return CREATURES.find((c) => c.id === id);
}
