import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CloudRain,
  Sun,
  History,
  ChevronRight,
  Heart,
  Layers,
  Leaf,
  Radio,
  Shield,
  Swords,
  X,
  Sparkles,
} from "lucide-react";
import type {
  Action,
  PlayerView,
  Unit,
  LegalAction,
  PlayerId,
} from "../../game/types";
import { CARDS } from "../../content/cards";
import { COMPANIONS, STAGES } from "../../content/companions";
import { Card } from "../cards/card";
import { HoloFinish } from "../cards/holo-finish";
import { PendingEffects, describeUnit } from "./pending-effects";
import { CompanionDetails } from "../cards/companion-details";
import { stats } from "../../game/rules";
export function DuelScreen({
  view: v,
  onAction,
  onExit,
  onGuide,
  tutorial = false,
}: {
  view: PlayerView;
  onAction: (a: Action) => void;
  onExit: () => void;
  onGuide: () => void;
  tutorial?: boolean;
}) {
  const [selectedId, setSelected] = useState<string | null>(null);
  const [inspect, setInspect] = useState<string | null>(null);
  const [inspectOwner, setInspectOwner] = useState<PlayerId | null>(null);
  const [holo, setHolo] = useState(false);
  const [history, setHistory] = useState(false);
  const [swaps, setSwaps] = useState<string[]>([]);
  const selected = v.self.hand.some((c) => c.id === selectedId)
    ? selectedId
    : null;
  const comp = COMPANIONS[v.self.companion.defId],
    opp = COMPANIONS[v.opponent.companion.defId];
  const myTurn = v.priority === v.playerId;
  const selectedCard = v.self.hand.find((c) => c.id === selected);
  const choices = v.actions.filter(
    (x) => x.action.type === "play-card" && x.action.cardId === selected,
  );
  const pass = v.actions.find(
    (x) => x.action.type === "pass" || x.action.type === "decline-block",
  );
  const summon = v.actions.find((x) => x.action.type === "summon-companion");
  const evolve = v.actions.find((x) => x.action.type === "evolve-companion");
  const activeWeather = v.weather === "rain";
  const doAction = (a: Action) => {
    onAction(a);
    setSelected(null);
  };
  const actionLabel = (x: LegalAction) => {
    const a = x.action;
    if (a.type !== "play-card") return x.label;
    if (a.weather)
      return a.weather === "rain"
        ? "Trazer chuva condutora"
        : "Trazer tempo estável";
    if (a.stackId) {
      const pending = v.stack.find((p) => p.id === a.stackId);
      return `Interromper ${pending ? (CARDS[pending.source]?.name ?? "tática") : "tática"}`;
    }
    if (a.target?.kind === "unit") {
      const id = a.target.id;
      return `${x.label} → ${describeUnit(v, id)}`;
    }
    return x.label;
  };
  function UnitCard({ unit: u, enemy }: { unit: Unit; enemy: boolean }) {
    const [attack, hp] = stats(
      { weather: { active: v.weather, override: null } },
      u,
    );
    const ownActions = v.actions.filter(
      (x) =>
        (x.action.type === "attack" || x.action.type === "block") &&
        x.action.unitId === u.id,
    );
    const targetChoice = choices.find(
      (x) =>
        x.action.type === "play-card" &&
        x.action.target?.kind === "unit" &&
        x.action.target.id === u.id,
    );
    const c = u.companion ? COMPANIONS[u.defId] : null;
    const card = u.companion ? null : CARDS[u.defId];
    const action = targetChoice ?? ownActions[0];
    const Icon = u.companion
      ? Sparkles
      : card?.region === "aurora"
        ? Radio
        : Leaf;
    return (
      <div
        className={`unit-card ${enemy ? "enemy" : ""} ${u.exhausted ? "exhausted" : ""} ${action ? "actionable" : ""} ${v.combat?.attackerId === u.id ? "attacking" : ""} ${v.stack.some((e) => e.target?.kind === "unit" && e.target.id === u.id) ? "pending-target" : ""}`}
      >
        <button
          onClick={() =>
            action
              ? doAction(action.action)
              : (setInspect(u.defId), setInspectOwner(u.owner))
          }
          aria-label={`${c ? c.forms[u.stage] : card?.name}, ataque ${attack}, vida ${hp - u.damage}${action ? ", " + action.label : ""}`}
        >
          <div className="unit-portrait">
            {v.stack.some(
              (e) => e.target?.kind === "unit" && e.target.id === u.id,
            ) && <span className="target-marker">ALVO</span>}
            {c?.id === "brotoco" ? (
              <div className="brotoco-study" />
            ) : (
              <Icon size={42} strokeWidth={1} />
            )}
            <span className="unit-state">
              {u.companion ? STAGES[u.stage] : u.exhausted ? "EXAURIDA" : "ECO"}
            </span>
            {u.barrier > 0 && (
              <span className="barrier">
                <Shield size={11} />
                {u.barrier}
              </span>
            )}
          </div>
          <strong>{c ? c.forms[u.stage] : card?.name}</strong>
          <div className="unit-values">
            <span>
              <Swords size={12} />
              {attack}
            </span>
            <span className={u.damage ? "damaged" : ""}>
              <Heart size={12} />
              {hp - u.damage}
            </span>
          </div>
        </button>
        <button
          className="unit-inspect"
          aria-label={`Inspecionar ${c ? c.forms[u.stage] : card?.name}`}
          onClick={() => {
            setInspect(u.defId);
            setInspectOwner(u.owner);
          }}
        >
          ＋
        </button>
        {action && (
          <span className="unit-hint">
            {targetChoice
              ? "ESCOLHER ALVO"
              : v.phase === "block"
                ? "BLOQUEAR"
                : "ATACAR"}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={`duel ${activeWeather ? "rainy" : ""}`}>
      <div className="duel-scenery" />
      <header className="duel-top">
        <button
          className="icon-button"
          onClick={onExit}
          aria-label="Sair do duelo"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="wordmark small">
          ec<span>o</span>s<span className="wordmark-dot">✳</span>
        </div>
        <span className="top-divider" />
        <div className="location">
          <span>ESTAÇÃO-JARDIM</span>
          <small>Jardins de Concreto · Duelo local</small>
        </div>
        <div className="top-actions">
          <button onClick={onGuide}>
            <BookOpen size={16} /> Guia
          </button>
          <button onClick={() => setHistory(!history)}>
            <History size={16} /> Histórico
          </button>
        </div>
      </header>
      <aside className="duel-sidebar">
        <div className="eyebrow">SEU VÍNCULO</div>
        <div className={`companion-medallion ${comp.id}`}>
          {comp.id === "brotoco" ? (
            <div className="brotoco-study" />
          ) : (
            <Radio size={60} strokeWidth={1} />
          )}
        </div>
        <h2>{comp.forms[v.self.companion.stage]}</h2>
        <p className="companion-stage">
          {STAGES[v.self.companion.stage]} <span>·</span>{" "}
          {comp.region === "jardins"
            ? "Natureza & cerâmica"
            : "Sinal & energia"}
        </p>
        <div className="resonance-title">
          <span>Ressonância</span>
          <b>
            {v.self.companion.resonance}
            <small> / {v.self.companion.stage === 0 ? 3 : 7}</small>
          </b>
        </div>
        <div className="resonance-track">
          <i
            style={{
              width: `${Math.min(100, (v.self.companion.resonance / (v.self.companion.stage === 0 ? 3 : 7)) * 100)}%`,
            }}
          />
        </div>
        <div className="objectives">
          {comp.objectives.map((text, i) => (
            <div key={text}>
              <span
                className={
                  v.self.companion.scored.includes(
                    comp.id === "brotoco"
                      ? i === 0
                        ? "heal"
                        : "protect"
                      : i === 0
                        ? "response"
                        : "rain-combat",
                  )
                    ? "done"
                    : ""
                }
              >
                {i + 1}
              </span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="micro">
          Até 2 pontos por rodada. Afinidade e poder competitivo são
          independentes.
        </p>
        <button
          className="primary full"
          disabled={!summon && !evolve}
          onClick={() => doAction((evolve ?? summon)!.action)}
        >
          {evolve ? <Sparkles size={15} /> : <Leaf size={15} />}{" "}
          {evolve
            ? evolve.label
            : summon
              ? summon.label
              : v.self.board.some((u) => u.companion)
                ? "Vínculo em campo"
                : v.round < v.self.companion.availableRound
                  ? `Retorna na rodada ${v.self.companion.availableRound}`
                  : `Invocar · ${Math.min(10, comp.cost + 2 * v.self.companion.deaths)} energia`}
        </button>
        <div className="evolution-note">
          {v.self.companion.stage < 2
            ? `${v.self.companion.stage === 0 ? "Desperta: 3 ressonância + 2 energia." : "Ascendente: 7 ressonância + 4 energia, objetivo em duas rodadas e Desperta em rodada anterior."}`
            : "Seu vínculo alcançou o estágio Ascendente."}
        </div>
        <div className="weather-box">
          <div className="eyebrow">CLIMA DA ARENA</div>
          <div className="weather-current">
            {activeWeather ? <CloudRain size={26} /> : <Sun size={26} />}
            <div>
              <strong>
                {activeWeather ? "Chuva condutora" : "Tempo estável"}
              </strong>
              <small>
                {activeWeather
                  ? "Condutor está ativo"
                  : "Sem modificador climático"}
              </small>
            </div>
          </div>
          <div className="forecast">
            {v.forecast.map((w, i) => (
              <span
                key={i}
                aria-label={`Rodada ${v.round + i + 1}: ${w === "rain" ? "Chuva condutora" : "Tempo estável"}`}
              >
                {w === "rain" ? <CloudRain size={16} /> : <Sun size={16} />}
                <small>ROD. {v.round + i + 1}</small>
              </span>
            ))}
          </div>
        </div>
      </aside>
      <main className="battle-area">
        <div className="player-strip opponent">
          <div className="avatar">
            <Radio size={22} />
          </div>
          <div>
            <strong>
              Iara <span>· IA</span>
            </strong>
            <small>
              Vinculadora de {opp.region === "aurora" ? "Aurora" : "Jardins"}
            </small>
          </div>
          <div className="strip-resources">
            <span>
              <Layers size={14} />
              {v.opponent.handCount} cartas
            </span>
            <span className="nexus">
              <Heart size={15} />
              {Math.max(0, v.opponent.nexus)}
              <small> /25</small>
            </span>
          </div>
          <div className="energy-mini">
            {v.opponent.energy}
            <small> /{v.opponent.maxEnergy}</small>
            <i>ENERGIA</i>
          </div>
        </div>
        <div className="board-zone opponent-zone">
          <div className="board-label">
            CAMPO ADVERSÁRIO <span>{v.opponent.board.length}/5</span>
          </div>
          <div className="units">
            {v.opponent.board.map((u) => (
              <UnitCard key={u.id} unit={u} enemy />
            ))}
            {Array.from(
              { length: Math.max(0, 5 - v.opponent.board.length) },
              (_, i) => (
                <div key={i} className="empty-slot">
                  <span>◇</span>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="arena-divider">
          <span />
          <div>
            ✳<small>RODADA {String(v.round).padStart(2, "0")}</small>
          </div>
          <span />
        </div>
        <div className="board-zone own-zone">
          <div className="units">
            {v.self.board.map((u) => (
              <UnitCard key={u.id} unit={u} enemy={false} />
            ))}
            {Array.from(
              { length: Math.max(0, 5 - v.self.board.length) },
              (_, i) => (
                <div key={i} className="empty-slot">
                  <span>◇</span>
                </div>
              ),
            )}
          </div>
          <div className="board-label">
            SEU CAMPO <span>{v.self.board.length}/5</span>
          </div>
        </div>
        <div className="priority-bar" aria-live="polite">
          <div className={`priority-light ${myTurn ? "active" : ""}`} />
          <div>
            <strong>
              {v.phase === "mulligan"
                ? "Prepare sua mão"
                : v.phase === "block"
                  ? myTurn
                    ? "Proteja seu Nexo"
                    : "O adversário escolhe um bloqueador"
                  : v.phase === "response"
                    ? myTurn
                      ? "Você pode responder"
                      : "O adversário pode responder"
                    : myTurn
                      ? "Sua iniciativa"
                      : "Iara está pensando"}
            </strong>
            <small>
              {v.phase === "response"
                ? "Dois passes resolvem o próximo efeito."
                : v.phase === "block"
                  ? "Escolha uma criatura disponível ou receba o dano."
                  : "Cada ação passa a iniciativa. Dois passes encerram a rodada."}
            </small>
          </div>
          {pass && (
            <button className="primary" onClick={() => doAction(pass.action)}>
              {pass.label}
              <ChevronRight size={15} />
            </button>
          )}
        </div>
        <div className="player-strip self">
          <div className="avatar">
            <Leaf size={22} />
          </div>
          <div>
            <strong>Você</strong>
            <small>
              Vinculador de {comp.region === "jardins" ? "Jardins" : "Aurora"}
            </small>
          </div>
          <div className="strip-resources">
            <span>
              <Layers size={14} />
              {v.self.deckCount} no deck
            </span>
            <span className="nexus">
              <Heart size={15} />
              {Math.max(0, v.self.nexus)}
              <small> /25</small>
            </span>
          </div>
          <div className="energy-mini">
            {v.self.energy}
            <small> /{v.self.maxEnergy}</small>
            <i>ENERGIA</i>
          </div>
        </div>
      </main>
      <aside className="action-sidebar">
        <div className="eyebrow">
          {selectedCard
            ? "CARTA SELECIONADA"
            : v.stack.length
              ? "EM RESOLUÇÃO"
              : "O MUNDO ESCUTA"}
        </div>
        {selectedCard ? (
          <>
            {v.stack.length > 0 && <PendingEffects view={v} />}
            <Card card={CARDS[selectedCard.defId]} />
            <div className="action-choices">
              {choices.map((x, i) => (
                <button
                  key={i}
                  className="choice"
                  onClick={() => doAction(x.action)}
                >
                  {actionLabel(x)}
                  <ChevronRight size={14} />
                </button>
              ))}
              {!choices.length && (
                <p className="hint">
                  {!myTurn
                    ? "Aguarde sua iniciativa."
                    : v.self.energy < CARDS[selectedCard.defId].cost
                      ? "Energia insuficiente."
                      : "Não há alvo válido ou esta carta não pode ser usada nesta janela."}
                </p>
              )}
              <button className="text-button" onClick={() => setSelected(null)}>
                Cancelar seleção
              </button>
            </div>
          </>
        ) : v.stack.length ? (
          <PendingEffects view={v} />
        ) : (
          <div className="arena-story">
            <span>⌁</span>
            <p>
              O concreto lembra.
              <br />
              As raízes respondem.
            </p>
            <small>
              Uma estação abandonada voltou a emitir sinais. Cada Eco carrega um
              fragmento dessa história.
            </small>
          </div>
        )}
        <div className="last-event">
          <span>ÚLTIMO ACONTECIMENTO</span>
          <p>{v.events.at(-1)?.text ?? "Seu primeiro vínculo começa aqui."}</p>
        </div>
        {tutorial && (
          <div className="tutorial-note">
            <BookOpen size={18} />
            <strong>Aprenda jogando</strong>
            <p>
              {v.phase === "mulligan"
                ? "Clique nas cartas que deseja trocar e confirme."
                : v.self.energy < 2 && v.round === 1
                  ? "Invoque uma criatura de custo 1 ou passe. A energia aumenta a cada rodada."
                  : !v.self.board.some((u) => u.companion)
                    ? "Quando tiver 2 de energia, invoque sua companheira pelo painel de vínculo."
                    : v.phase === "response"
                      ? "Você pode usar cartas de Resposta ou passar para avançar a resolução."
                      : v.self.companion.resonance < 3
                        ? "Cumpra os objetivos do painel esquerdo para ganhar ressonância."
                        : "Prepare energia e evolua sua companheira. Ataques e evoluções permitem respostas."}
            </p>
          </div>
        )}
      </aside>
      <footer className="hand-area">
        <div className="hand-label">
          <span>
            SUA MÃO <b>{v.self.hand.length}/8</b>
          </span>
          <small>
            {v.phase === "mulligan"
              ? "Selecione cartas para trocar"
              : "Selecione uma carta para ver as ações"}
          </small>
        </div>
        <div className="hand-cards">
          {v.self.hand.map((c) => (
            <Card
              key={c.id}
              card={CARDS[c.defId]}
              selected={
                v.phase === "mulligan"
                  ? swaps.includes(c.id)
                  : selected === c.id
              }
              playable={v.actions.some(
                (x) =>
                  x.action.type === "play-card" && x.action.cardId === c.id,
              )}
              onSelect={() => {
                if (v.phase === "mulligan")
                  setSwaps((prev) =>
                    prev.includes(c.id)
                      ? prev.filter((id) => id !== c.id)
                      : [...prev, c.id],
                  );
                else setSelected(selected === c.id ? null : c.id);
              }}
              onInspect={() => setInspect(c.defId)}
              compact
            />
          ))}
        </div>
        {v.phase === "mulligan" && v.actions.length > 0 && (
          <div className="mulligan-confirm">
            <button
              className="primary"
              onClick={() => {
                doAction({ type: "mulligan", ids: swaps });
                setSwaps([]);
              }}
            >
              {swaps.length
                ? `Trocar ${swaps.length} carta${swaps.length > 1 ? "s" : ""}`
                : "Manter minha mão"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </footer>
      {history && (
        <div className="dialog-backdrop" onClick={() => setHistory(false)}>
          <section
            className="dialog history-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Histórico do duelo"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setHistory(false)}
              aria-label="Fechar histórico"
            >
              <X />
            </button>
            <div className="eyebrow">REGISTRO DE ECOS</div>
            <h2>Histórico do duelo</h2>
            <div className="event-list">
              {[...v.events].reverse().map((e) => (
                <p key={e.id}>
                  <span>R{e.round}</span>
                  {e.text}
                </p>
              ))}
            </div>
          </section>
        </div>
      )}
      {inspect && (
        <div className="dialog-backdrop" onClick={() => setInspect(null)}>
          <section
            className="dialog inspect-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Inspeção de carta"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setInspect(null)}
              aria-label="Fechar inspeção"
            >
              <X />
            </button>
            {CARDS[inspect] ? (
              <>
                <HoloFinish enabled={holo}>
                  <Card card={CARDS[inspect]} />
                </HoloFinish>
                <div className="finish-toggle">
                  <button aria-pressed={!holo} onClick={() => setHolo(false)}>
                    Padrão
                  </button>
                  <button aria-pressed={holo} onClick={() => setHolo(true)}>
                    ✧ Holo
                  </button>
                </div>
                <h2>{CARDS[inspect].name}</h2>
                <p>
                  {CARDS[inspect].text ||
                    "Criatura sem habilidade adicional. Ataque o Nexo ou proteja seu campo."}
                </p>
              </>
            ) : (
              <CompanionDetails
                companion={COMPANIONS[inspect]}
                progress={
                  (inspectOwner === v.playerId ? v.self : v.opponent).companion
                }
                ownerLabel={
                  inspectOwner === v.playerId
                    ? "Seu vínculo"
                    : "Vínculo adversário"
                }
              />
            )}
            <p className="micro">
              Resposta: pode ser jogada nas janelas de reação. Barreira: absorve
              dano uma vez nesta rodada. Condutor: recebe o efeito indicado
              durante chuva.
            </p>
          </section>
        </div>
      )}
      {v.phase === "error" && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h2>O duelo foi interrompido</h2>
            <p>{v.error}</p>
            <button className="primary" onClick={onExit}>
              Voltar ao início
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
