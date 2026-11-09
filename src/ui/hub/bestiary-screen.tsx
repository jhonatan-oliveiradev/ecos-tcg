import { CREATURES } from "../../content/creatures";
import { CreatureArt } from "../cards/creature-art";
export function BestiaryScreen() {
  return (
    <main className="bestiary-page">
      <div className="eyebrow">CADERNO DE CAMPO · PRIMEIRO ELENCO</div>
      <h1>
        Uma cidade.
        <br />
        <em>Muitas formas de viver.</em>
      </h1>
      <p>
        Conheça as espécies por trás das cartas: onde vivem, como se comportam e
        o que acrescentam ao seu deck. Estudos de personagens em revisão; regras
        e atributos continuam nas cartas.
      </p>
      <div className="bestiary-grid">
        {CREATURES.map((c) => (
          <article key={c.id}>
            <div className="bestiary-portrait">
              <CreatureArt
                defId={
                  c.id === "terruno" || c.id === "ceroto"
                    ? "brotoco"
                    : c.id === "voltria"
                      ? "sintila"
                      : ((
                          {
                            cerviga: "cervo-concreto",
                            pipinal: "ave-sinal",
                            musguil: "vigia-musgo",
                          } as Record<string, string>
                        )[c.id] ?? c.id)
                }
                stage={
                  c.id === "terruno" || c.id === "voltria"
                    ? 1
                    : c.id === "ceroto"
                      ? 2
                      : 0
                }
              />
            </div>
            <div className="bestiary-copy">
              <span className="eyebrow">{c.role}</span>
              <h2>{c.name}</h2>
              <p>{c.personality}</p>
              <dl>
                <dt>Habitat</dt>
                <dd>{c.habitat}</dd>
                <dt>No duelo</dt>
                <dd>{c.synergy}</dd>
              </dl>
              <small>{c.line}</small>
            </div>
          </article>
        ))}
      </div>
      <p className="micro">
        O elenco é um primeiro estudo: as duas formas de Voltria compartilham
        uma ilustração. As demais criaturas do conjunto ainda aguardam arte
        própria.
      </p>
    </main>
  );
}
