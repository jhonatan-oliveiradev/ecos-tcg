# ECOS — protótipo local v0.1

TCG original para navegador: fantasia em uma metrópole retomada pela natureza, companheiras evolutivas e clima com efeitos nas cartas. Nome provisório. Interface em português brasileiro.

## Rodar

Requer Node compatível com `package.json`/Vite instalado (usado no desenvolvimento: Node 24.22.1).

```bash
npm ci
npm run dev
```

Abra a URL exibida pelo Vite. Escolha Jardins de Concreto ou Distrito Aurora e inicie um duelo contra IA. O botão “Aprenda jogando” ativa dicas contextuais. O guia explica ataques, respostas, bloqueios e evolução.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Build estático em `dist/`; sirva a pasta via HTTP, não abra por `file://`. `npm run test:e2e` requer os navegadores do Playwright instalados (`npx playwright install chromium`) em ambiente local suportado. Veja `docs/playtest.md` para distinguir os testes executados dos cenários apenas preparados.

## O que funciona

- 20 identidades de cartas e dois decks fixos de 30.
- IA com a mesma informação visível permitida ao jogador.
- Ações alternadas, respostas, bloqueio, custos, dano, cura e Barreira.
- Duas companheiras com três estágios e ressonância por objetivos.
- Uma arena, dois climas e previsão de duas rodadas.
- Mão inicial com troca, descarte por overflow, fadiga e resultado.
- Catálogo, inspeção com acabamento holo e estudo de arte no Ateliê.

## Estado visual

O autor rejeitou a primeira coleção de criaturas. O novo estudo de Brotoco está pendente de avaliação. As demais cartas indicam “Ilustração em revisão”; não são artes finais. Estágios evolutivos ainda compartilham o mesmo estudo visual. A arena é arte conceitual gerada. Veja `docs/art-direction.md`.

## Arquitetura e limites

`src/game` é um motor TypeScript puro, com comandos imutáveis e projeção por jogador. A interface e a IA recebem `PlayerView`, sem mão ou ordem do deck adversário. Isso prepara o limite para um futuro servidor autoritativo, mas um jogo inteiramente local não protege segredos de quem inspeciona o próprio navegador.

Nenhum serviço online foi provisionado. Não há campanha completa, carteira de moedas, trocas, ranqueado nem 2v2 nesta versão. Esses sistemas permanecem no design e nos marcos seguintes. Não há recompensas persistentes simuladas como reais.

Design, plano e decisões de execução ficam em `docs/`. As fontes usadas pela interface têm fallback de sistema; as imagens necessárias ao protótipo estão incluídas.

## Linha evolutiva

Brotoco → Terruno → Ceroto. Os nomes aparecem nos estágios Inicial, Desperta e Ascendente. As ilustrações finais de Terruno e Ceroto ainda estão pendentes.

## Deploy na Vercel

Importe `jhonatan-oliveiradev/ecos-tcg` com a raiz do repositório, framework Vite, Node 24.x, instalação `npm ci`, build `npm run build` e saída `dist`. Não há variáveis de ambiente obrigatórias para este protótipo local.
