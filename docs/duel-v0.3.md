# ECOS — duelo legível e primeiro elenco

Esta revisão atende ao relato de partida sem ataques compreensíveis. Substitui as ações principais alternadas do protótipo e as instruções correspondentes do plano Marco 1. Respostas, vínculo, decks e clima preservam suas regras, salvo indicação abaixo.

## Fluxo do duelo

- Uma rodada contém um turno de cada jogador. A iniciativa de começo da rodada alterna.
- Preparação: jogar criaturas, usar táticas e respostas, invocar/evoluir companheira. A ação não entrega o turno ao adversário.
- Batalha: atacar ou usar cartas de Resposta. Não permite novas invocações nem evoluções; não há retorno à preparação nesse turno.
- Ataques custam zero energia. Cada criatura disponível ataca uma vez por rodada; criaturas recém-invocadas aguardam a próxima rodada, salvo Veloz. Bloquear também exaure a criatura.
- Primeiro selecione o atacante, depois o alvo. Contra uma criatura, ambos causam dano simultâneo. Contra o Nexo, o defensor pode escolher um bloqueador disponível. Não há dano excedente ao Nexo. Alvo removido por Resposta não converte ataque em dano direto.
- Encerrar turno entrega a vez; após dois turnos completos, ambos compram e restauram energia, clima avança, bônus e barreiras expiram e criaturas ficam disponíveis novamente. A reserva de energia pode ser usada para respostas no turno adversário.
- Respostas mantêm prioridade alternada. Dois passes avançam a resolução; jamais encerram o turno. Uma janela humana sem nenhuma resposta legal avança automaticamente; com escolhas reais, aguarda decisão.
- Vitória: reduzir o Nexo adversário de 25 a zero. Energia paga cartas/evoluções, não ataques.

A primeira vez garante uma criatura de custo 1 na mão e início com o jogador. O mulligan ainda pode trocar essa carta. O tutorial continua sendo um duelo real com dicas contextuais, não uma partida roteirizada com vitória garantida.

## Elenco e arte

`src/content/creatures.ts` é o catálogo de espécies, habitat, comportamento e sinergia. O conjunto mantém IDs e regras das cartas existentes para preservar decks e preferências locais.

| Personagem                 | Uso no jogo                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| Brotoco / Terruno / Ceroto | Três estágios da companheira Jardins                                  |
| Sintila / Voltria          | Companheira Aurora; Voltria Desperta e Ascendente compartilham estudo |
| Cerviga                    | Espécie representada por Cervo de Concreto                            |
| Pipinal                    | Espécie representada por Ave de Sinal                                 |
| Musguil                    | Espécie representada por Vigia de Musgo                               |

O atlas `public/art/ecos-roster-v1.png` é um estudo gerado, integrado para avaliação no jogo, não arte final aprovada. A fonte é preservada; SVG viewBox recorta as oito células sem alterar o arquivo. As demais criaturas e táticas mantêm placeholders identificados. Não se reutiliza a mesma espécie para cartas com identidades diferentes. O bestiário está em `/bestiario`.

Prompt final: folha de personagens amigáveis, 4 colunas × 2 linhas, sem texto; desenho de animação plano com contorno ameixa, sombra simples e paleta terracota/menta/teal/âmbar; referência do modelo Brotoco v2; linha cerâmica evolutiva, aves de sinal, guardião de ponte e sentinela de telha/musgo. Gerado com a ferramenta de imagens integrada; recortes feitos no runtime.

## Próximas validações humanas

Avaliar clareza de preparar/atacar/encerrar, custo de oportunidade de bloquear, duração do duelo e frequência de evolução. Os números atuais não representam balanceamento competitivo validado. Aprovar anatomia e silhuetas antes de produzir animações, novas famílias ou ilustrações finais individuais.
