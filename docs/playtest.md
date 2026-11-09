# Validação do protótipo

Validação final: 30 testes em 13 arquivos; typecheck, lint e build passaram.

## Automatizado

- Motor: criação determinística, decks, mulligan, custos, prioridade, recusa de comandos repetidos/atrasados e projeção de mão oculta.
- Combate: dano persistente simultâneo, bloqueador removido, criatura recém-invocada, Veloz e alvo invalidado.
- Progressão: ressonância limitada, despertar e ascensão das duas companheiras, persistência do dano e espera após derrota.
- Outros: overflow, fadiga, Barreira, clima determinístico, Condutor e empate.
- Simulação: 50 sementes, ações legais, até 2.000 comandos por partida. Todas terminaram sem recurso negativo nem duplicação de IDs.
- IA: decisão legal e independente da identidade oculta da mão adversária.
- Sessão: reinício/descarte cancela ações de IA pendentes.
- Componentes: regras reais no HTML e foil decorativo.

## Navegador

QA interativo no Chrome do ambiente: início, mulligan, avanço de rodada, invocação de Brotoco, retorno da IA, guia, foco inicial no diálogo, ciclo Shift+Tab, Escape/restauração de foco, catálogo, inspeção e toggle Holo preservando regras. Imagens das criaturas rejeitadas não aparecem.

Foram escritos cenários Playwright para 1440×900 e 1280×720, mas a execução desse runner não foi feita no ambiente gerenciado, que usa o navegador integrado para QA. Não afirmar cobertura E2E automática, todos os viewports, duração de 10–18 minutos, balanceamento competitivo ou avaliação por jogadores reais.

## Limitações conscientes

- Arte das criaturas em revisão; apenas Brotoco possui estudo v2, ainda não aprovado. Estágios mudam atributos e rótulo, sem novas ilustrações finais.
- Tutorial é orientação contextual numa partida padrão. Sequência pedagógica de encontros ainda não foi implementada.
- Protótipo local sem persistência, contas, campanhas extensas, recompensas permanentes ou multiplayer.
- IA heurística simples; não representa dificuldade competitiva final.
- Efeitos e gatilhos suportam o catálogo fechado deste marco; não há linguagem genérica de efeitos arbitrários.

As correções da revisão final adicionaram identificação de alvos de resposta, detalhes públicos das companheiras e tela de resultado acessível. Veja review.md para evidências e limites.

## Migração Next.js — 9/11/2026

- Next.js 16.4.5 App Router: build de produção, tipos, lint e formatação passaram.
- Os 31 testes em 14 arquivos passaram após a migração, incluindo as simulações de 50 partidas.
- Playwright atualizado para iniciar o build de produção com `next start`; quatro cenários em dois viewports (oito casos). O novo cenário verifica metadados, hidratação sem erros de console e carregamento da imagem do Ateliê.
- Tentativa de execução E2E bloqueada antes de abrir as páginas: Chromium aborta com `socket() failed: Operation not permitted`. Os oito casos não foram validados. O navegador integrado também não alcançou o servidor local (`ERR_CONNECTION_REFUSED`).
- Validação interativa do preview Next.js continua pendente; o QA descrito acima corresponde à versão anterior em Vite.

## Revisão v0.3 — 09/11/2026

- Motor/UI estática: 39 testes passaram, incluindo 50 partidas completas com sementes distintas, turnos, troca de dano com alvo explícito, alvo removido, custo zero de ataque e retorno ao dono do turno após respostas.
- Onboarding: simulação da primeira partida de tutorial contra a IA confirma invocação de custo 1, chegada à rodada 2, ataque disponível e dano real sem gasto de energia.
- Typecheck, ESLint e build de produção passaram. As rotas foram geradas pelo build; a checagem HTTP local ficou indisponível porque o servidor não permaneceu acessível entre chamadas neste ambiente.
- E2E no navegador: não validado neste ambiente. Chromium local encerra ao abrir socket do perfil (`Operation not permitted`); navegador externo não acessa localhost. Os 14 casos de navegador não chegaram à aplicação. Não confundir esse bloqueio de infraestrutura com testes funcionais aprovados.
- Validação visual e publicação de prévia pendentes: o envio da branch foi bloqueado pela revisão automática, solicitando autorização explícita para publicar código e imagens no repositório público `jhonatan-oliveiradev/ecos-tcg`.
- Arte: oito estudos integrados para revisão, não aprovação final. Outras criaturas ainda usam placeholders; Voltria compartilha estudo entre os estágios Desperta/Ascendente.
