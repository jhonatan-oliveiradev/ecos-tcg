import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Leaf,
  Radio,
  Layers,
  Sparkles,
  Check,
  Swords,
  Trophy,
  Clock3,
  Shield,
  Compass,
} from "lucide-react";
import { CARDS } from "../../content/cards";
import { COMPANIONS } from "../../content/companions";
import { DECKS, deckCards } from "../../content/decks";
import type { DeckId } from "../../game/types";
import type { GuestProfile } from "../../app/guest-profile";
import { updateProfile } from "../../app/use-guest-profile";
import { Card } from "../cards/card";
import { HoloFinish } from "../cards/holo-finish";
export function StationScreen({
  profile,
  onGuide,
}: {
  profile: GuestProfile;
  onGuide: () => void;
}) {
  const wins = profile.matches.filter((m) => m.outcome === "win").length;
  return (
    <main className="station-page">
      <section className="station-hero">
        <div className="station-hero-shade" />
        <div className="station-hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> SEU PRÓXIMO CAPÍTULO
          </span>
          <h1>
            O futuro
            <br />
            tem <em>raízes.</em>
          </h1>
          <p>
            A cidade voltou a respirar.
            <br />
            Sua história começa com um vínculo.
          </p>
          <Link className="primary large" href="/jogar">
            Entrar em um duelo <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="station-coordinates">
          <span>01 — ESTAÇÃO-JARDIM</span>
          <span>23° S · 46° O</span>
        </div>
      </section>
      <section className="station-lower">
        <div className="hub-panel welcome-panel">
          <span className="eyebrow">BOM TER VOCÊ POR AQUI</span>
          <h2>Bem-vindo, {profile.name}.</h2>
          <p>
            Escolha um deck, conheça seus Ecos e descubra o ritmo das ações
            alternadas.
          </p>
          <button className="text-button" onClick={onGuide}>
            <BookOpen size={16} /> Conheça as regras <ArrowRight size={15} />
          </button>
          <div className="station-record">
            <span>
              <b>{profile.matches.length}</b> duelos registrados
            </span>
            <span>
              <b>{wins}</b> vitórias locais
            </span>
          </div>
        </div>
        <Link href="/decks" className="hub-panel shortcut-panel">
          <Layers size={24} />
          <span className="eyebrow">PREPARE SEU VÍNCULO</span>
          <h2>
            Estratégias que
            <br />
            criam raízes.
          </h2>
          <p>Dois decks iniciais. Duas formas de transformar o campo.</p>
          <span className="text-button">
            Explorar decks <ArrowUpRight size={16} />
          </span>
        </Link>
        <Link
          href="/loja"
          className="hub-panel shortcut-panel cosmetic-shortcut"
        >
          <Sparkles size={24} />
          <span className="eyebrow">SUA ASSINATURA</span>
          <h2>
            Um brilho
            <br />
            só seu.
          </h2>
          <p>Experimente os acabamentos gratuitos do conjunto inicial.</p>
          <span className="text-button">
            Visitar a loja <ArrowUpRight size={16} />
          </span>
        </Link>
      </section>
      <div className="hub-notice">
        <Compass size={17} />
        <p>
          <strong>O primeiro capítulo já pode ser jogado.</strong> Duelos contra
          IA, clima e companheiras evolutivas. As ilustrações continuam em
          desenvolvimento.
        </p>
        <span>V0.2</span>
      </div>
    </main>
  );
}
export function DecksScreen({
  deck,
  onDeck,
  onInspect,
}: {
  deck: DeckId;
  onDeck: (id: DeckId) => void;
  onInspect: (id: string) => void;
}) {
  const ids = [...new Set(deckCards(deck))];
  const cards = ids.map((id) => CARDS[id]);
  const costs = Array.from({ length: 6 }, (_, cost) => ({
    cost,
    count: cards.filter((c) => Math.min(c.cost, 5) === cost).length * 2,
  }));
  const companion = COMPANIONS[DECKS[deck].companion];
  return (
    <main className="hub-page">
      <div className="hub-page-heading">
        <span className="eyebrow">CADA CARTA TEM UM PAPEL</span>
        <h1>
          Seu próximo <em>plano.</em>
        </h1>
        <p>
          Conheça os dois decks iniciais antes de entrar na arena. Cada um reúne
          30 cartas e uma companheira.
        </p>
      </div>
      <div className="deck-overview">
        {(["jardins", "aurora"] as const).map((id) => (
          <button
            key={id}
            className={`hub-panel deck-summary ${deck === id ? "active" : ""}`}
            onClick={() => onDeck(id)}
            aria-pressed={deck === id}
          >
            {id === "jardins" ? <Leaf /> : <Radio />}
            <div>
              <h2>{DECKS[id].name}</h2>
              <p>{DECKS[id].subtitle}</p>
              <small>
                30 CARTAS · {COMPANIONS[DECKS[id].companion].name.toUpperCase()}
              </small>
            </div>
            {deck === id && <Check size={18} />}
          </button>
        ))}
      </div>
      <div className="deck-detail">
        <section className="hub-panel">
          <span className="eyebrow">VÍNCULO & ESTRATÉGIA</span>
          <h2>{companion.name}</h2>
          <p>
            {deck === "jardins"
              ? "Sustente suas criaturas com cura e Barreira. Proteja o campo enquanto Brotoco acumula ressonância e evolui."
              : "Combine respostas e dano com a previsão de chuva. Controle o ritmo do adversário enquanto Sintila acumula ressonância."}
          </p>
          <div className="evolution-line">
            {companion.forms.map((name, i) => (
              <span key={name}>
                <small>0{i + 1}</small>
                {name}
              </span>
            ))}
          </div>
          <Link href="/jogar" className="primary">
            Jogar com este deck <ArrowUpRight size={16} />
          </Link>
        </section>
        <section className="hub-panel">
          <span className="eyebrow">DISTRIBUIÇÃO DE ENERGIA</span>
          <div
            className="cost-chart"
            aria-label="Quantidade de cartas por custo de energia"
          >
            {costs.map((x) => (
              <div key={x.cost}>
                <b>{x.count}</b>
                <span style={{ height: `${Math.max(4, x.count * 7)}px` }} />
                <small>{x.cost === 5 ? "5+" : x.cost}</small>
              </div>
            ))}
          </div>
          <p className="micro">
            {cards.filter((c) => c.kind === "creature").length * 2} criaturas ·{" "}
            {cards.filter((c) => c.kind !== "creature").length * 2} táticas e
            respostas · 2 cópias de cada carta.
          </p>
        </section>
      </div>
      <div className="section-title">
        <h2>As cartas do deck</h2>
        <span>15 IDENTIDADES · 30 CARTAS</span>
      </div>
      <div className="collection-grid">
        {cards.map((card) => (
          <div key={card.id}>
            <Card card={card} onSelect={() => onInspect(card.id)} />
            <span className="copy-count">2 CÓPIAS</span>
          </div>
        ))}
      </div>
    </main>
  );
}
export function StoreScreen({ profile }: { profile: GuestProfile }) {
  const sample = CARDS[deckCards(profile.deck)[0]];
  return (
    <main className="hub-page">
      <div className="hub-page-heading">
        <span className="eyebrow">EXPRESSE SEU VÍNCULO</span>
        <h1>
          Detalhes que <em>ficam.</em>
        </h1>
        <p>
          Acabamentos iniciais gratuitos. Escolha como suas cartas aparecem na
          inspeção, sem alterar suas habilidades.
        </p>
      </div>
      <div className="store-banner">
        <Sparkles />
        <div>
          <strong>O conjunto de boas-vindas é seu.</strong>
          <p>
            Os dois acabamentos estão incluídos. Sua escolha fica neste
            navegador.
          </p>
        </div>
        <span>GRATUITO</span>
      </div>
      <div className="finish-grid">
        {(["standard", "holo"] as const).map((finish) => (
          <article
            className={`hub-panel finish-product ${profile.finish === finish ? "active" : ""}`}
            key={finish}
          >
            <div className={`finish-preview ${finish}`}>
              <HoloFinish enabled={finish === "holo"}>
                <Card card={sample} />
              </HoloFinish>
            </div>
            <div className="finish-product-copy">
              <span className="eyebrow">ACABAMENTO · INCLUÍDO</span>
              <h2>
                {finish === "holo" ? "Ressonância Holo" : "Papel da Estação"}
              </h2>
              <p>
                {finish === "holo"
                  ? "Um reflexo que acompanha o movimento. A mesma carta, uma nova presença."
                  : "Textura serena, contornos nítidos. Um clássico do primeiro vínculo."}
              </p>
              <button
                className={profile.finish === finish ? "secondary" : "primary"}
                aria-pressed={profile.finish === finish}
                onClick={() => updateProfile({ finish })}
              >
                {profile.finish === finish ? (
                  <>
                    <Check size={16} /> Em uso
                  </>
                ) : (
                  "Aplicar acabamento"
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="hub-notice">
        <Shield size={18} />
        <p>
          Acabamentos são cosméticos. Esta versão não tem moedas, pagamentos ou
          pacotes aleatórios.
        </p>
      </div>
    </main>
  );
}
export function ProfileScreen({ profile }: { profile: GuestProfile }) {
  const wins = profile.matches.filter((m) => m.outcome === "win").length;
  const milestones = [
    {
      name: "Primeiro vínculo",
      text: "Conclua seu primeiro duelo.",
      done: profile.matches.length > 0,
    },
    {
      name: "Raízes firmes",
      text: "Vença um duelo contra a IA.",
      done: wins > 0,
    },
    {
      name: "Dois caminhos",
      text: "Conclua duelos com os dois decks.",
      done: new Set(profile.matches.map((m) => m.deck)).size === 2,
    },
  ];
  return (
    <main className="hub-page">
      <div className="profile-intro">
        <div className="profile-avatar">
          {profile.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <span className="eyebrow">SEU REGISTRO DE VÍNCULOS</span>
          <h1>{profile.name}</h1>
          <p>Perfil convidado · progresso neste navegador</p>
        </div>
        <Link href="/ajustes" className="secondary">
          Editar perfil
        </Link>
      </div>
      <div className="profile-stats">
        {[
          { label: "Duelos registrados", value: profile.matches.length },
          { label: "Vitórias", value: wins },
          {
            label: "Empates",
            value: profile.matches.filter((m) => m.outcome === "draw").length,
          },
          { label: "Deck preferido", value: DECKS[profile.deck].name },
        ].map((stat) => (
          <div className="hub-panel" key={stat.label}>
            <span className="eyebrow">{stat.label}</span>
            <b>{stat.value}</b>
          </div>
        ))}
      </div>
      <div className="section-title">
        <h2>Pequenos grandes passos</h2>
        <span>MARCOS LOCAIS</span>
      </div>
      <div className="milestone-grid">
        {milestones.map((m) => (
          <article
            key={m.name}
            className={`hub-panel milestone ${m.done ? "earned" : ""}`}
          >
            <Trophy size={23} />
            <h3>{m.name}</h3>
            <p>{m.text}</p>
            <small>{m.done ? "ALCANÇADO" : "A DESCOBRIR"}</small>
          </article>
        ))}
      </div>
      <div className="section-title">
        <h2>Seus últimos encontros</h2>
        <span>ATÉ 50 REGISTROS LOCAIS</span>
      </div>
      {profile.matches.length ? (
        <div className="match-list">
          {profile.matches.map((m) => (
            <article key={m.id}>
              <Swords size={18} />
              <strong>
                {m.outcome === "win"
                  ? "Vitória"
                  : m.outcome === "draw"
                    ? "Empate"
                    : "Derrota"}
              </strong>
              <span>{DECKS[m.deck].name}</span>
              <span>{m.rounds} rodadas</span>
              <time dateTime={m.date}>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeZone: "America/Sao_Paulo",
                }).format(new Date(m.date))}
              </time>
            </article>
          ))}
        </div>
      ) : (
        <div className="hub-panel empty-state">
          <Clock3 size={28} />
          <h3>Toda história tem um primeiro encontro.</h3>
          <p>Conclua um duelo para começar seu histórico.</p>
          <Link href="/jogar" className="primary">
            Encontrar um duelo <ArrowRight size={16} />
          </Link>
        </div>
      )}
      <p className="local-data-note">
        Estatísticas e marcos consideram os últimos 50 duelos concluídos neste
        navegador. Partidas interrompidas não contam. Os dados não são
        sincronizados com uma conta.
      </p>
    </main>
  );
}
export function SettingsScreen({ profile }: { profile: GuestProfile }) {
  return (
    <main className="hub-page">
      <div className="hub-page-heading">
        <span className="eyebrow">SEU ESPAÇO NA ESTAÇÃO</span>
        <h1>
          Do seu <em>jeito.</em>
        </h1>
        <p>Personalize seu perfil convidado e a experiência neste navegador.</p>
      </div>
      <section className="hub-panel settings-panel">
        <h2>Como quer ser chamado?</h2>
        <form
          key={profile.name}
          onSubmit={(e) => {
            e.preventDefault();
            const name = String(new FormData(e.currentTarget).get("name") ?? "")
              .trim()
              .slice(0, 24);
            if (name) updateProfile({ name });
          }}
        >
          <label htmlFor="guest-name">Nome do vinculador</label>
          <div className="name-input-row">
            <input
              id="guest-name"
              name="name"
              maxLength={24}
              required
              defaultValue={profile.name}
              pattern={".*\\S.*"}
            />
            <button className="primary" type="submit">
              Salvar nome
            </button>
          </div>
        </form>
        <div className="setting-row">
          <div>
            <h3>Reduzir animações</h3>
            <p>
              Movimentos mais discretos no menu e no duelo. A preferência de
              acessibilidade do sistema também é respeitada.
            </p>
          </div>
          <button
            type="button"
            className="motion-toggle"
            role="switch"
            aria-checked={profile.reducedMotion}
            onClick={() =>
              updateProfile({ reducedMotion: !profile.reducedMotion })
            }
            aria-label="Reduzir animações"
          >
            <span />
            {profile.reducedMotion ? "Ativado" : "Desativado"}
          </button>
        </div>
        <div className="hub-notice">
          <Shield size={18} />
          <p>
            Este é um perfil local. Limpar os dados do navegador remove
            preferências e histórico. Se o armazenamento estiver indisponível,
            as mudanças valem apenas nesta sessão.
          </p>
        </div>
      </section>
      <p className="settings-feedback" role="status">
        Preferências atuais: {profile.name} · animações{" "}
        {profile.reducedMotion ? "reduzidas" : "padrão"}.
      </p>
    </main>
  );
}
