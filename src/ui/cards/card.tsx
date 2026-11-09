import { CreatureArt } from "./creature-art";
import { creatureFor } from "../../content/creatures";
import {
  Leaf,
  Radio,
  Shield,
  Compass,
  Zap,
  CloudRain,
  Heart,
  Sparkles,
} from "lucide-react";
import type { CardDef } from "../../game/types";
export function CardArt({ card }: { card: CardDef }) {
  if (creatureFor(card.id))
    return (
      <div className="card-art illustrated-art">
        <CreatureArt defId={card.id} />
      </div>
    );
  const Icon =
    card.kind === "creature"
      ? card.region === "aurora"
        ? Radio
        : card.region === "jardins"
          ? Leaf
          : Compass
      : card.effect === "heal" || card.effect === "heal-all"
        ? Heart
        : card.effect === "barrier"
          ? Shield
          : card.effect === "weather"
            ? CloudRain
            : card.effect === "damage"
              ? Zap
              : Sparkles;
  return (
    <div className={`card-art concept-art ${card.region}`}>
      <div className="art-orbit" />
      <Icon size={48} strokeWidth={1} />
      <span>Ilustração em revisão</span>
    </div>
  );
}
export function Card({
  card,
  onSelect,
  onInspect,
  selected = false,
  playable = false,
  compact = false,
}: {
  card: CardDef;
  onSelect?: () => void;
  onInspect?: () => void;
  selected?: boolean;
  playable?: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={`game-card ${selected ? "selected" : ""} ${playable ? "playable" : ""} ${compact ? "compact" : ""} ${card.region}`}
    >
      <button
        className="card-main"
        onClick={onSelect ?? onInspect}
        aria-label={`${card.name}, custo ${card.cost}${card.attack !== undefined ? `, ataque ${card.attack}, vida ${card.health}` : ""}`}
      >
        <div className="card-heading">
          <span className="energy-cost">{card.cost}</span>
          <span>{card.name}</span>
        </div>
        <CardArt card={card} />
        <div className="card-kind">
          {card.kind === "creature"
            ? "CRIATURA"
            : card.response
              ? "RESPOSTA"
              : "TÁTICA"}
          <span>{card.rarity === "Rara" ? "◆" : "◇"}</span>
        </div>
        <div className="card-rule">
          {card.text || "Um Eco de um mundo que aprendeu a renascer."}
        </div>
        <div className="card-bottom">
          {card.kind === "creature" ? (
            <>
              <b>⚔ {card.attack}</b>
              <b>♥ {card.health}</b>
            </>
          ) : (
            <span>
              VÍNCULO ·{" "}
              {card.region === "neutral" ? "NEUTRO" : card.region.toUpperCase()}
            </span>
          )}
        </div>
      </button>
      {onInspect && (
        <button
          className="inspect-trigger"
          onClick={onInspect}
          aria-label={`Inspecionar ${card.name}`}
        >
          ＋
        </button>
      )}
    </article>
  );
}
