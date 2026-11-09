import { creatureFor } from "../../content/creatures";
export function CreatureArt({
  defId,
  stage = 0,
}: {
  defId: string;
  stage?: number;
}) {
  const c = creatureFor(defId, stage);
  if (!c) return null;
  const x = (c.cell % 4) * 384;
  const y = c.cell < 4 ? 50 : 520;
  return (
    <svg
      className="creature-art"
      viewBox={`${x} ${y} 384 450`}
      role="img"
      aria-label={`Estudo de ${c.name}`}
    >
      <image href="/art/ecos-roster-v1.png" width="1536" height="1024" />
    </svg>
  );
}
