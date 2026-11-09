import type { CompanionDef, CompanionState } from "../../game/types";
import { STAGES } from "../../content/companions";
export function CompanionDetails({
  companion: c,
  progress,
  ownerLabel,
}: {
  companion: CompanionDef;
  progress?: CompanionState;
  ownerLabel: string;
}) {
  return (
    <div className="companion-details">
      <div className="eyebrow">{ownerLabel}</div>
      <h2>{c.forms[progress?.stage ?? 0]}</h2>
      <p>{c.description}</p>
      {progress && (
        <p className="public-progression">
          {STAGES[progress.stage]} · {progress.resonance} de ressonância ·
          Objetivo temático em {progress.history.length} rodada(s)
        </p>
      )}
      <div className="stage-preview">
        {c.stats.map((stat, i) => (
          <div key={i} className={progress?.stage === i ? "current-stage" : ""}>
            <span>{c.forms[i]}</span>
            <small>{STAGES[i]}</small>
            <strong>{stat.join(" / ")}</strong>
            <small>ATAQUE / VIDA</small>
          </div>
        ))}
      </div>
      <p>
        <strong>Ao ascender:</strong> {c.ascension.text}
      </p>
      <h3>Objetivos de ressonância</h3>
      <ul>
        {c.objectives.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <p className="micro">
        Até um ponto por objetivo em cada rodada, máximo de dois. Exige a
        companheira em campo.
      </p>
      <h3>Preparação</h3>
      <p>
        Invocação: {c.cost} de energia. Desperta: 3 de ressonância e 2 de
        energia. Ascendente: 7 de ressonância e 4 de energia, com Desperta em
        rodada anterior e objetivo temático cumprido em duas rodadas distintas.
        Apenas uma evolução por rodada.
      </p>
      {progress && (
        <p className="micro">
          Derrotas: {progress.deaths}. Retorno permitido a partir da rodada{" "}
          {progress.availableRound}, pagando até{" "}
          {Math.min(10, c.cost + 2 * progress.deaths)} de energia no estágio
          Inicial.
        </p>
      )}
    </div>
  );
}
