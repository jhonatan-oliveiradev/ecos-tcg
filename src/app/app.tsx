import { useState, useEffect } from "react";
import { useDialogFocus } from "../ui/use-dialog-focus";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Radio,
  BookOpen,
  X,
  Sparkles,
  ArrowLeft,
  Layers,
  Check,
  CloudRain,
  Shield,
  Swords,
} from "lucide-react";
import {
  createMatchController,
  type MatchController,
} from "./match-controller";
import { useMatch } from "./use-match";
import { DuelScreen } from "../ui/duel/duel-screen";
import { ResultScreen } from "../ui/screens/result-screen";
import { Card } from "../ui/cards/card";
import { HoloFinish } from "../ui/cards/holo-finish";
import { CARDS } from "../content/cards";
import { DECKS } from "../content/decks";
import type { DeckId } from "../game/types";
import { COMPANIONS } from "../content/companions";
function Session({
  controller,
  onExit,
  onGuide,
  tutorial,
}: {
  controller: MatchController;
  onExit: () => void;
  onGuide: () => void;
  tutorial: boolean;
}) {
  const view = useMatch(controller);
  const [exitConfirm, setExitConfirm] = useState(false);
  if (view.result) return <ResultScreen view={view} onExit={onExit} />;
  return (
    <>
      <DuelScreen
        view={view}
        onAction={controller.dispatch}
        onExit={() => setExitConfirm(true)}
        onGuide={onGuide}
        tutorial={tutorial}
      />
      {exitConfirm && !view.result && (
        <div className="dialog-backdrop">
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Sair do duelo"
          >
            <div className="eyebrow">INTERROMPER VÍNCULO</div>
            <h2>Sair desta partida?</h2>
            <p>
              Esta partida local será encerrada. Você pode começar outra a
              qualquer momento.
            </p>
            <div className="dialog-buttons">
              <button
                className="secondary"
                onClick={() => setExitConfirm(false)}
              >
                Continuar duelo
              </button>
              <button className="primary" onClick={onExit}>
                Sair do duelo
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
export default function App() {
  useDialogFocus();
  const [deck, setDeck] = useState<DeckId>("jardins");
  const [screen, setScreen] = useState<"home" | "collection" | "atelier">(
    "home",
  );
  const [guide, setGuide] = useState(false);
  const [controller, setController] = useState<MatchController | null>(null);
  const [tutorial, setTutorial] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "jardins" | "aurora" | "neutral"
  >("all");
  const [holo, setHolo] = useState(false);
  const [inspected, setInspected] = useState<string | null>(null);
  useEffect(() => () => controller?.dispose(), [controller]);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGuide(false);
        setInspected(null);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  function start(withTutorial = false) {
    setTutorial(withTutorial);
    const seed = Math.floor(Math.random() * 1e8) + 1;
    setController(
      createMatchController({
        seed,
        deckIds: [deck, deck === "jardins" ? "aurora" : "jardins"],
        mode: withTutorial ? "tutorial" : "standard",
      }),
    );
  }
  function leave() {
    controller?.dispose();
    setController(null);
    setScreen("home");
  }
  return (
    <>
      {controller ? (
        <Session
          controller={controller}
          onExit={leave}
          onGuide={() => setGuide(true)}
          tutorial={tutorial}
        />
      ) : (
        <div className={`home ${screen === "home" ? "" : "inner-page"}`}>
          <div className="home-scenery" />
          <div className="home-shade" />
          <header className="home-top">
            <button
              className="brand-button"
              onClick={() => setScreen("home")}
              aria-label="Ecos início"
            >
              <span className="brand-symbol">✳</span>
              <span className="brand-caption">
                ECOS<small>FÁBULA NEON</small>
              </span>
            </button>
            <nav aria-label="Menu principal">
              <button
                className={screen === "home" ? "current" : ""}
                onClick={() => setScreen("home")}
              >
                A ESTAÇÃO
              </button>
              <button
                className={screen === "collection" ? "current" : ""}
                onClick={() => setScreen("collection")}
              >
                OS ECOS <span>20</span>
              </button>
              <button
                className={screen === "atelier" ? "current" : ""}
                onClick={() => setScreen("atelier")}
              >
                ATELIÊ
              </button>
            </nav>
            <button className="guide-button" onClick={() => setGuide(true)}>
              <BookOpen size={17} /> Como jogar
            </button>
          </header>
          {screen === "home" ? (
            <>
              <main className="home-main">
                <div className="home-hero">
                  <div className="eyebrow">
                    <span className="status-dot" /> UM NOVO MUNDO CRIA RAÍZES
                  </div>
                  <h1>
                    O futuro
                    <br />
                    tem <em>raízes.</em>
                  </h1>
                  <p>
                    Entre o concreto e o impossível,
                    <br />
                    um vínculo pode mudar tudo.
                  </p>
                  <div className="hero-line">
                    <span>01 — ESTAÇÃO-JARDIM</span>
                    <span>23° S · 46° O</span>
                  </div>
                </div>
                <div className="journey-panel">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">SEU PRIMEIRO VÍNCULO</span>
                      <h2>Escolha com quem começar.</h2>
                    </div>
                    <span className="chapter-number">01</span>
                  </div>
                  <div className="deck-options">
                    {(["jardins", "aurora"] as const).map((id) => (
                      <button
                        key={id}
                        className={`deck-option ${id} ${deck === id ? "chosen" : ""}`}
                        onClick={() => setDeck(id)}
                        aria-pressed={deck === id}
                      >
                        <div className="deck-icon">
                          {id === "jardins" ? (
                            <Leaf size={23} />
                          ) : (
                            <Radio size={23} />
                          )}
                        </div>
                        <div>
                          <strong>{DECKS[id].name}</strong>
                          <small>{DECKS[id].subtitle}</small>
                        </div>
                        <span className="selection-dot">
                          {deck === id && <Check size={12} />}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="companion-preview">
                    <div className="preview-portrait">
                      {deck === "jardins" ? (
                        <div className="brotoco-study" />
                      ) : (
                        <Radio size={46} strokeWidth={1} />
                      )}
                    </div>
                    <div>
                      <span className="eyebrow">SUA COMPANHEIRA</span>
                      <h3>
                        {COMPANIONS[DECKS[deck].companion].name}
                        <span>◇ INICIAL</span>
                      </h3>
                      <p>
                        {deck === "jardins"
                          ? "Cada rachadura guarda a chance de florescer."
                          : "Toda cidade tem uma frequência. Encontre a sua."}
                      </p>
                    </div>
                  </div>
                  <button
                    className="primary large full"
                    onClick={() => start(false)}
                  >
                    Iniciar duelo <ArrowUpRight size={20} />
                  </button>
                  <button className="tutorial-link" onClick={() => start(true)}>
                    <BookOpen size={14} /> Primeira vez? Aprenda jogando{" "}
                    <ArrowRight size={14} />
                  </button>
                  <div className="panel-foot">
                    <span className="status-dot" /> PROTÓTIPO LOCAL{" "}
                    <span>1V1 CONTRA IA</span>
                  </div>
                </div>
              </main>
              <footer className="home-footer">
                <div className="world-note">
                  <span>⌁</span>
                  <p>
                    As cidades não desapareceram.
                    <br />
                    <strong>Aprenderam a respirar de novo.</strong>
                  </p>
                </div>
                <div className="build-note">
                  EM DESENVOLVIMENTO · V0.1
                  <br />
                  <span>Um universo original em construção.</span>
                </div>
              </footer>
            </>
          ) : screen === "collection" ? (
            <main className="collection-page">
              <button className="text-button" onClick={() => setScreen("home")}>
                <ArrowLeft size={15} /> Voltar à estação
              </button>
              <div className="eyebrow">FRAGMENTOS DE UM MUNDO VIVO</div>
              <h1>
                Conheça os <em>Ecos.</em>
              </h1>
              <p>
                O conjunto inicial de teste. As ilustrações das cartas estão em
                revisão de direção de arte.
              </p>
              <div className="filter-tabs">
                {(["all", "neutral", "jardins", "aurora"] as const).map((f) => (
                  <button
                    key={f}
                    className={filter === f ? "active" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all"
                      ? "Todos"
                      : f === "neutral"
                        ? "Neutros"
                        : DECKS[f].name}
                  </button>
                ))}
              </div>
              <div className="collection-grid">
                {Object.values(CARDS)
                  .filter((c) => filter === "all" || c.region === filter)
                  .map((c) => (
                    <Card
                      key={c.id}
                      card={c}
                      onSelect={() => setInspected(c.id)}
                    />
                  ))}
              </div>
            </main>
          ) : (
            <main className="atelier-page">
              <button className="text-button" onClick={() => setScreen("home")}>
                <ArrowLeft size={15} /> Voltar à estação
              </button>
              <div className="eyebrow">DIREÇÃO DE PERSONAGENS · ESTUDO 02</div>
              <h1>
                Menos textura.
                <br />
                <em>Mais personalidade.</em>
              </h1>
              <p>
                Uma nova proposta para Brotoco: cerâmica, semente e gesto.
                Silhueta assimétrica, formas simples e quatro cores principais.
                Estudo para avaliação; ainda não é arte final.
              </p>
              <img
                src="/art/brotoco-model-v2.png"
                alt="Estudo de Brotoco: criatura de terracota com braços grandes, máscara escura e folha assimétrica, em diferentes vistas"
              />
              <div className="atelier-criteria">
                <span>01 · SILHUETA RECONHECÍVEL</span>
                <span>02 · ANATOMIA CONSISTENTE</span>
                <span>03 · EXPRESSÃO ANTES DE BRILHO</span>
              </div>
            </main>
          )}
        </div>
      )}
      {guide && (
        <div className="dialog-backdrop" onClick={() => setGuide(false)}>
          <section
            className="dialog guide-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Como jogar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setGuide(false)}
              aria-label="Fechar guia"
            >
              <X />
            </button>
            <div className="eyebrow">MANUAL DO VINCULADOR</div>
            <h2>Faça seu vínculo crescer.</h2>
            <p>
              Reduza o Nexo adversário de 25 a zero. Cada ação passa a
              iniciativa; dois passes encerram a rodada e restauram a energia,
              que cresce até 10.
            </p>
            <div className="guide-grid">
              <div>
                <Layers />
                <h3>Invoque seus Ecos</h3>
                <p>
                  Selecione uma carta da mão e confirme a ação. Criaturas podem
                  bloquear ao entrar, mas só atacam na rodada seguinte, salvo
                  Veloz.
                </p>
              </div>
              <div>
                <Swords />
                <h3>Ataque e responda</h3>
                <p>
                  Clique em uma criatura disponível para atacar. O adversário
                  pode responder e escolher um bloqueador. Depois, ambos podem
                  responder antes do dano.
                </p>
              </div>
              <div>
                <Sparkles />
                <h3>Desperte a companheira</h3>
                <p>
                  Invoque-a com 2 de energia. Cumpra seus objetivos: Desperta
                  exige 3 ressonância e 2 energia; Ascendente, 7 e 4, além de
                  preparação em rodadas anteriores.
                </p>
              </div>
              <div>
                <CloudRain />
                <h3>Leia o clima</h3>
                <p>
                  A previsão mostra duas rodadas futuras. Condutor recebe o
                  efeito indicado sob chuva. Alterações por carta duram até o
                  começo da próxima rodada.
                </p>
              </div>
              <div>
                <Shield />
                <h3>Proteja seu campo</h3>
                <p>
                  Barreira absorve o dano de uma ocorrência e expira na rodada.
                  Dano nas criaturas permanece até cura. Cartas de Resposta são
                  usadas nas janelas de reação.
                </p>
              </div>
              <div>
                <Leaf />
                <h3>Todo duelo recomeça</h3>
                <p>
                  A companheira derrotada retorna após uma rodada completa de
                  espera, no estágio Inicial e com custo crescente. Ressonância
                  fica, mas a evolução precisa ser refeita.
                </p>
              </div>
            </div>
            <button className="primary full" onClick={() => setGuide(false)}>
              Entendi, vamos jogar <ArrowRight size={16} />
            </button>
          </section>
        </div>
      )}
      {inspected && (
        <div className="dialog-backdrop" onClick={() => setInspected(null)}>
          <section
            className="dialog inspect-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Inspeção de Eco"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dialog-close"
              onClick={() => setInspected(null)}
              aria-label="Fechar inspeção"
            >
              <X />
            </button>
            <HoloFinish enabled={holo}>
              <Card card={CARDS[inspected]} />
            </HoloFinish>
            <div className="finish-toggle">
              <button aria-pressed={!holo} onClick={() => setHolo(false)}>
                Padrão
              </button>
              <button aria-pressed={holo} onClick={() => setHolo(true)}>
                ✧ Holo
              </button>
            </div>
            <h2>{CARDS[inspected].name}</h2>
            <p>
              {CARDS[inspected].text || "Criatura sem habilidade adicional."}
            </p>
            <p className="micro">
              Raridade: {CARDS[inspected].rarity} · Arte em revisão.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
