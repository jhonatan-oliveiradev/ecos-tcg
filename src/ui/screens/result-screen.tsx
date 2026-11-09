import { Sparkles, Leaf, ArrowRight } from "lucide-react";
import { companionName } from "../../content/companions";
import type { PlayerView } from "../../game/types";
export function ResultScreen({
  view,
  onExit,
}: {
  view: PlayerView;
  onExit: () => void;
}) {
  return (
    <div className="result-overlay">
      <div
        className="result-content"
        role="dialog"
        aria-modal="true"
        aria-label="Resultado do duelo"
      >
        <div className="result-mark">
          {view.result === "p1" ? <Sparkles size={44} /> : <Leaf size={44} />}
        </div>
        <div className="eyebrow">
          {view.result === "p1"
            ? "UM VÍNCULO MAIS FORTE"
            : view.result === "draw"
              ? "DOIS CAMINHOS SE ENCONTRAM"
              : "CADA ENCONTRO ENSINA"}
        </div>
        <h1>
          {view.result === "p1"
            ? "Seu Eco prevaleceu."
            : view.result === "draw"
              ? "Em equilíbrio."
              : "O mundo ainda tem segredos."}
        </h1>
        <p>
          {view.result === "p1"
            ? "Um novo fragmento dessa história agora faz parte de você."
            : "Reorganize sua estratégia. Sua companheira espera pela próxima jornada."}
        </p>
        <div className="result-stats">
          <div>
            <b>{view.round}</b>
            <span>RODADAS</span>
          </div>
          <div>
            <b>{view.self.companion.resonance}</b>
            <span>RESSONÂNCIA</span>
          </div>
          <div>
            <b>
              {companionName(
                view.self.companion.defId,
                view.self.companion.stage,
              )}
            </b>
            <span>ESTÁGIO FINAL</span>
          </div>
        </div>
        <button className="primary large" onClick={onExit}>
          Voltar à estação <ArrowRight size={17} />
        </button>
        <small>
          Protótipo local · Sem recompensas persistentes nesta versão
        </small>
      </div>
    </div>
  );
}
