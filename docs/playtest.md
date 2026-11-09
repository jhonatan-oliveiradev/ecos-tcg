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
