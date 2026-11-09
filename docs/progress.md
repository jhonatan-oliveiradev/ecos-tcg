# SDD ledger — plan: 2026-11-09-tcg-marco-1.md

Design e plano aprovados. Execução direta autorizada.
Pre-flight: Tasks 1→2→3→4 compartilham GameState/Action; 2→6→7 compartilham PlayerView; 6→8 compartilham MatchController. Sem conflitos.
Ruling: projeto novo isolado em tcg/ na branch feat/local-duel, sem worktree adicional — nenhum repositório anterior — sem impacto em código existente.
Ruling: arte inicial usa atlas de 16 ilustrações e arena gerados; táticas reutilizam recortes temáticos — mantém consistência — artes exclusivas ficam para refinamento.
Task 1: catálogo, configuração e partida determinística implementados; setup.test.ts 2/2 passou. Primeira tentativa de teste encontrou runner ainda não instalado; prova RED funcional desta tarefa não foi obtida antes do código.
Tasks 2–4: testes escritos e executados com falha por módulos ausentes; motor, respostas, combate, companheiras e clima implementados; suíte inicial 13 testes únicos passou após extrair fixtures.
Ruling: nova direção de criaturas pedida em 09/11 — atlas realista anterior rejeitado; Lúmen v2 é estudo gráfico de terracota, pendente de validação. Não expandir personagens com o estilo rejeitado.
Ruling: objetivos de ressonância resolvem por eventos efetivos imediatamente (não ao fim da rodada) — permite feedback claro mantendo limite por rodada — pode exigir rebalanceamento.
Ruling: jardineiro cura automaticamente o aliado mais ferido ao entrar — texto não fixa escolha e reduz uma janela inicial — escolha de alvo poderá ser adicionada depois.
Task 5: 50 partidas com sementes 1–50 terminaram, sem recursos negativos ou IDs duplicados, em menos de 2.000 comandos cada.
Task 6: IA recebe PlayerView; decisões legais e equivalência com mão adversária diferente verificadas. Reinício cancela timers de sessão antiga. Suite 17/17 passou.
Ruling: a orientação inicial usa o duelo padrão com dicas contextuais, sem deck reduzido — preserva as mesmas regras e evita um segundo formato precoce — aprendizagem gradual ainda exige ampliar encontros.
Ruling: combate não implementa gatilhos arbitrários definidos por usuário; catálogo fechado resolve efeitos em laços limitados a 10 criaturas por efeito — não existe cadeia automática recursiva neste marco — novos gatilhos deverão introduzir o limite de 128 antes de serem suportados.
Task 7: interface conectada, guia, catálogo, inspeção, acabamento holo CSS e ateliê. QA no Chrome validou mulligan, rodada dois, invocação e resposta da IA; foco do guia corrigido e verificado RED (foco fora) → GREEN (fechar guia, Shift+Tab e Escape).
Ruling: acabamento holo próprio em CSS após inspeção do registry React Bits, evitando WebGL e mantendo regras HTML — efeito visual mais simples, sem dependência externa.
Task 8: início, dicas contextuais, resultado e reinício implementados; README e limitações registrados. 26 testes passaram; typecheck, lint e build passaram.
Ruling: QA de navegador usa CUA no preview gerenciado — runner Playwright preparado e listado (6 cenários em 2 viewports), não executado — cobertura automática de múltiplos viewports pendente.
Final review: revisão independente executada sobre o projeto completo. Nenhum crítico; três importantes corrigidos em uma passagem com regressões RED→GREEN.
Final: fixed alvo invisível — duel-screen.test.ts reproduziu render idêntico; agora distingue alvo/posição e marca campo.
Final: fixed inspeção incompleta — companion-details.test.ts e inspeção independente mostram estágios/efeitos/progressão.
Final: fixed resultado sem foco — result-screen.test.ts valida diálogo; Session substitui arena por resultado.
Final suite: npm test → 30/30; typecheck, lint e build → sucesso.
Final: minor (deferred): matchId inclui semente; usar ID opaco antes de backend competitivo, sem sigilo prometido no protótipo local.
Final: minor (deferred): Escape não fecha confirmação de saída; botão Continuar disponível.
Final: Ruling: itens explicitamente fora do marco e não julgados pelo revisor estão discriminados em review.md — não afirmar conclusão de arte final, online, equilíbrio ou auditoria integral de acessibilidade — exigem validação futura.
Final: Ruling: manter branch local e entregar código/arte/documentação em arquivo, conforme escopo sem publicação ou remoto — não há PR nem URL pública nesta etapa.

## Publicação inicial — 9/11/2026

Destino autorizado pelo autor: jhonatan-oliveiradev/ecos-tcg. Repositório inicialmente vazio, branch padrão main.
Linha evolutiva adotada: Brotoco → Terruno → Ceroto. IDs e nomes públicos atualizados; atributos e custos mantidos. Ilustrações das evoluções continuam provisórias.
31 testes, typecheck, lint, build e diff check passaram após a alteração. Configuração Vercel preparada com Vite, Node 24.x, npm ci e saída dist; sem env obrigatória.
