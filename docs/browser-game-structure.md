# Central do jogador — ECOS v0.2

Referência indicada pelo autor: Pokébonk, somente na organização de browser game completo. Preservar a direção Fábula Neon do ECOS; não copiar identidade, personagens, layout ou assets. A página de referência depende de WebGL 2 e seus menus não puderam ser validados interativamente neste ambiente. A estrutura abaixo é uma adaptação aos fluxos reais do ECOS.

| Rota       | Função disponível                                                                   |
| ---------- | ----------------------------------------------------------------------------------- |
| `/`        | Estação, atalhos e resumo do perfil convidado                                       |
| `/jogar`   | Escolher entre dois decks e iniciar duelo local ou orientação contextual            |
| `/ecos`    | Catálogo das 20 cartas, busca por nome/habilidade, filtros e inspeção               |
| `/decks`   | Consultar listas, curva de energia, estratégia e companheira; escolher deck padrão  |
| `/loja`    | Experimentar e aplicar dois acabamentos iniciais gratuitos                          |
| `/perfil`  | Últimos 50 duelos concluídos, estatísticas e três marcos derivados desses registros |
| `/atelie`  | Estudo da direção de personagens                                                    |
| `/ajustes` | Nome do convidado e redução de animações                                            |

A navegação usa URLs reais, com estado ativo e versão compacta em telas pequenas. Durante o duelo, o menu sai de cena; saída exige confirmação e retorna à estação. Escape cancela a confirmação.

## Progresso local

Nome, deck escolhido, acabamento, movimento e histórico são armazenados em `ecos.guest.v1`, neste navegador. O snapshot de servidor é estável para evitar divergências de hidratação. Dados inválidos são normalizados; falha de armazenamento mantém a sessão utilizável. Resultados são gravados uma vez por sessão concluída, com identificador independente da semente. Desistir pelo menu interrompe a sessão e não registra partida. Vitórias e marcos são informativos e não são autoridade para recompensas futuras.

O acabamento escolhido é usado como padrão na inspeção do catálogo, decks e arena, sem modificar regras ou raridade. Não existem moedas, pacotes aleatórios, pagamento, inventário comercializável ou compras simuladas. Os dois itens são gratuitos e já estão incluídos.

## Próximas etapas

1. Tutorial com sequência de objetivos e feedback de conclusão.
2. Conta autenticada, perfil persistente e coleção com propriedade real das cartas.
3. Construtor de decks validado pelo mesmo domínio de regras.
4. Servidor autoritativo de partidas, matchmaking, reconexão e resultados confiáveis.
5. Economia e loja completa, com transações e recompensas validadas no servidor.

O motor, conteúdo e IA continuam independentes da plataforma. O catálogo público não deve ser confundido com uma coleção de cartas possuídas. Progresso de convidado não poderá ser importado como saldo ou vitória competitiva confiável.
