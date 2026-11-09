# ECOS — protótipo local v0.1

TCG original para navegador: fantasia em uma metrópole retomada pela natureza, companheiras evolutivas e clima com efeitos nas cartas. Nome provisório. Interface em português brasileiro.

## Rodar

Requer Node 24.x instalado (usado no desenvolvimento: Node 24.22.1).

```bash
npm ci
npm run dev
```

Abra http://localhost:3000. Escolha Jardins de Concreto ou Distrito Aurora e inicie um duelo contra IA. O botão “Aprenda jogando” ativa dicas contextuais. O guia explica ataques, respostas, bloqueios e evolução.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

A aplicação usa Next.js App Router. Para servir o build de produção, execute `npm run build` e `npm start`. `npm run test:e2e` requer os navegadores do Playwright instalados (`npx playwright install chromium` ou `ECOS_CHROMIUM_PATH=/caminho/do/chromium`) em ambiente local suportado. Veja `docs/playtest.md` para distinguir os testes executados dos cenários apenas preparados.

## O que funciona

- 20 identidades de cartas e dois decks fixos de 30.
- IA com a mesma informação visível permitida ao jogador.
- Ações alternadas, respostas, bloqueio, custos, dano, cura e Barreira.
- Duas companheiras com três estágios e ressonância por objetivos.
- Uma arena, dois climas e previsão de duas rodadas.
- Mão inicial com troca, descarte por overflow, fadiga e resultado.
- Catálogo, inspeção com acabamento holo e estudo de arte no Ateliê.

## Estado visual

O primeiro elenco tem oito estudos integrados: Brotoco, Terruno, Ceroto, Sintila, Voltria, Cerviga, Pipinal e Musguil. O bestiário em `/bestiario` apresenta habitat, personalidade e função. As formas Desperta/Ascendente de Voltria compartilham arte; demais cartas continuam em revisão. Arte conceitual gerada, sujeita a aprovação. Veja `docs/art-direction.md` e `docs/duel-v0.3.md`.

## Arquitetura e limites

`src/game` é um motor TypeScript puro, com comandos imutáveis e projeção por jogador. A interface e a IA recebem `PlayerView`, sem mão ou ordem do deck adversário. Isso prepara o limite para um futuro servidor autoritativo, mas um jogo inteiramente local não protege segredos de quem inspeciona o próprio navegador.

Nenhum serviço online foi provisionado. Não há campanha completa, carteira de moedas, trocas, ranqueado nem 2v2 nesta versão. Esses sistemas permanecem no design e nos marcos seguintes. Não há recompensas persistentes simuladas como reais.

Design, plano e decisões de execução ficam em `docs/`. As fontes usadas pela interface têm fallback de sistema; as imagens necessárias ao protótipo estão incluídas.

## Linha evolutiva

Brotoco → Terruno → Ceroto. Os nomes aparecem nos estágios Inicial, Desperta e Ascendente. As ilustrações finais de Terruno e Ceroto ainda estão pendentes.

## Deploy na Vercel

Importe `jhonatan-oliveiradev/ecos-tcg` com a raiz do repositório, framework Next.js, Node 24.x, instalação `npm ci` e build `npm run build`. Use a saída padrão do Next.js, sem override para `dist`. Não há variáveis de ambiente obrigatórias para este protótipo local.

## Base para os próximos marcos

O layout e a página inicial usam Server Components. `src/app/app.tsx` delimita o cliente interativo do jogo; o motor em `src/game`, conteúdo em `src/content` e IA em `src/ai` continuam independentes do Next.js. Vitest mantém sua configuração própria; Vite é apenas dependência transitiva do runner de testes.

A migração não adiciona contas, banco ou multiplayer. A plataforma poderá usar APIs do Next.js para conta, coleção e decks. Partidas online deverão validar comandos no servidor, manter informação oculta e permitir reconexão; o estado no navegador permanece restrito ao modo local até esse marco.

## Central do jogador (v0.2)

A estação agora organiza o jogo em rotas: `/jogar`, `/ecos`, `/decks`, `/loja`, `/perfil`, `/atelie` e `/ajustes`. O catálogo permite busca e filtros; os decks mostram lista, curva e estratégia; a loja aplica dois acabamentos gratuitos. Nome, deck padrão, acabamento, movimento e os últimos 50 resultados reais ficam neste navegador, sem conta ou sincronização. Vitórias e marcos locais não concedem moeda ou recompensas comerciais.

Consulte `docs/browser-game-structure.md` para responsabilidades e próximos marcos. O catálogo continua público, e ainda não representa uma coleção com propriedade individual das cartas. O construtor de decks e a loja com transações pertencem às próximas fases.

## Duelo v0.3

Turnos explícitos: preparação → batalha → encerrar. Ataques não custam energia; escolha atacante e alvo (criatura ou Nexo). A interface mostra disponibilidade, previsão de dano, sinergias e instruções contextuais. Duas ações de encerrar turno completam a rodada. Respostas sem escolhas avançam automaticamente. Regras completas e limitações em `docs/duel-v0.3.md`.
