import { CARDS } from "./cards";
import type { DeckId } from "../game/types";
export const DECKS = {
  jardins: {
    name: "Jardins de Concreto",
    subtitle: "Restaure. Proteja. Floresça.",
    companion: "brotoco",
  },
  aurora: {
    name: "Distrito Aurora",
    subtitle: "Responda. Conduza. Surpreenda.",
    companion: "sintila",
  },
};
export const deckCards = (id: DeckId) =>
  Object.values(CARDS)
    .filter((c) => c.region === "neutral" || c.region === id)
    .flatMap((c) => [c.id, c.id]);
export function validateDeck(id: DeckId): string[] {
  const d = deckCards(id);
  return d.length === 30 && new Set(d).size === 15 ? [] : ["Deck inválido"];
}
