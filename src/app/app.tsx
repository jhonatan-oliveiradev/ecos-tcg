"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BestiaryScreen } from "../ui/hub/bestiary-screen";
import { HubShell } from "../ui/hub/hub-shell";
import type { HubScreen } from "../ui/hub/navigation";
import {
  StationScreen,
  DecksScreen,
  StoreScreen,
  ProfileScreen,
  SettingsScreen,
} from "../ui/hub/hub-screens";
import {
  useGuestProfile,
  updateProfile,
  recordLocalMatch,
} from "./use-guest-profile";
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
  deck,
  recordId,
  defaultHolo,
}: {
  controller: MatchController;
  onExit: () => void;
  onGuide: () => void;
  tutorial: boolean;
  deck: DeckId;
  recordId: string;
  defaultHolo: boolean;
}) {
  const view = useMatch(controller);
  const [exitConfirm, setExitConfirm] = useState(false);
  useEffect(() => {
    if (!view.result) return;
    recordLocalMatch({
      id: recordId,
      deck,
      outcome:
        view.result === "draw"
          ? "draw"
          : view.result === view.playerId
            ? "win"
            : "loss",
      rounds: view.round,
      date: new Date().toISOString(),
    });
  }, [view.result, view.playerId, view.round, deck, recordId]);
  if (view.result) return <ResultScreen view={view} onExit={onExit} />;
  return (
    <>
      <DuelScreen
        view={view}
        onAction={controller.dispatch}
        onExit={() => setExitConfirm(true)}
        onGuide={onGuide}
        tutorial={tutorial}
        defaultHolo={defaultHolo}
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
                className="secondary dialog-close-action"
                data-dialog-dismiss
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
export default function App({ screen = "station" }: { screen?: HubScreen }) {
  useDialogFocus();
  const router = useRouter();
  const profile = useGuestProfile();
  const deck = profile.deck;
  const setDeck = (deck: DeckId) => updateProfile({ deck });
  const [recordId, setRecordId] = useState("");
  const [guide, setGuide] = useState(false);
  const [controller, setController] = useState<MatchController | null>(null);
  const [tutorial, setTutorial] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "jardins" | "aurora" | "neutral"
  >("all");
  const [holoOverride, setHolo] = useState<boolean | null>(null);
  const holo = holoOverride ?? profile.finish === "holo";
  const [query, setQuery] = useState("");
  const [inspected, setInspected] = useState<string | null>(null);
  const normalizeSearch = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  const visibleCards = Object.values(CARDS).filter(
    (card) =>
      (filter === "all" || card.region === filter) &&
      normalizeSearch(`${card.name} ${card.text}`).includes(
        normalizeSearch(query),
      ),
  );
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
    setRecordId(crypto.randomUUID());
    const seed = withTutorial ? 42 : Math.floor(Math.random() * 1e8) + 1;
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
    router.push("/");
  }
  return (
    <div
      className="ecos-app"
      data-motion={profile.reducedMotion ? "reduced" : "full"}
    >
      {controller ? (
        <Session
          controller={controller}
          onExit={leave}
          onGuide={() => setGuide(true)}
          tutorial={tutorial}
          deck={deck}
          recordId={recordId}
          defaultHolo={profile.finish === "holo"}
        />
      ) : (
        <HubShell
          screen={screen}
          profile={profile}
          onGuide={() => setGuide(true)}
        >
          <div
            className={`home ${screen === "play" ? "play-page" : "inner-page"}`}
          >
            <div className="home-scenery" />
            <div className="home-shade" />
            {screen === "station" ? (
              <StationScreen profile={profile} onGuide={() => setGuide(true)} />
            ) : screen === "play" ? (
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
                    <button
                      className="tutorial-link"
                      onClick={() => start(true)}
                    >
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
                <Link className="text-button" href="/">
                  <ArrowLeft size={15} /> Voltar à estação
                </Link>
                <div className="eyebrow">FRAGMENTOS DE UM MUNDO VIVO</div>
                <h1>
                  Conheça os <em>Ecos.</em>
                </h1>
                <p>
                  O conjunto inicial de teste. As ilustrações das cartas estão
                  em revisão de direção de arte.
                </p>
                <label className="catalog-search">
                  Buscar Ecos
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nome ou habilidade da carta"
                  />
                </label>
                <div className="filter-tabs">
                  {(["all", "neutral", "jardins", "aurora"] as const).map(
                    (f) => (
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
                    ),
                  )}
                </div>
                <p className="micro" role="status">
                  {visibleCards.length} Ecos encontrados
                </p>
                {visibleCards.length === 0 && (
                  <div className="hub-panel empty-state">
                    <h2>Nenhum Eco por aqui.</h2>
                    <p>Tente outro nome ou habilidade, ou remova os filtros.</p>
                    <button
                      className="secondary"
                      onClick={() => {
                        setQuery("");
                        setFilter("all");
                      }}
                    >
                      Limpar busca e filtros
                    </button>
                  </div>
                )}
                <div className="collection-grid">
                  {visibleCards.map((c) => (
                    <Card
                      key={c.id}
                      card={c}
                      onSelect={() => setInspected(c.id)}
                    />
                  ))}
                </div>
              </main>
            ) : screen === "bestiary" ? (
              <BestiaryScreen />
            ) : screen === "decks" ? (
              <DecksScreen
                deck={deck}
                onDeck={setDeck}
                onInspect={setInspected}
              />
            ) : screen === "store" ? (
              <StoreScreen profile={profile} />
            ) : screen === "profile" ? (
              <ProfileScreen profile={profile} />
            ) : screen === "settings" ? (
              <SettingsScreen profile={profile} />
            ) : (
              <main className="atelier-page">
                <Link className="text-button" href="/">
                  <ArrowLeft size={15} /> Voltar à estação
                </Link>
                <div className="eyebrow">
                  DIREÇÃO DE PERSONAGENS · ESTUDO 02
                </div>
                <h1>
                  Menos textura.
                  <br />
                  <em>Mais personalidade.</em>
                </h1>
                <p>
                  Uma nova proposta para Brotoco: cerâmica, semente e gesto.
                  Silhueta assimétrica, formas simples e quatro cores
                  principais. Estudo para avaliação; ainda não é arte final.
                </p>
                <Image
                  width={1536}
                  height={1024}
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
        </HubShell>
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
              Reduza o Nexo adversário de 25 a zero. No seu turno, prepare o
              campo, entre na batalha e encerre o turno. Uma rodada contém um
              turno de cada jogador; depois, ambos compram uma carta e restauram
              a energia, que cresce até 10.
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
                  Entre na batalha e use Atacar no painel ou clique em uma
                  criatura pronta. Ataques não custam energia. O adversário pode
                  responder e escolher um bloqueador. Depois, ambos podem
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
    </div>
  );
}
