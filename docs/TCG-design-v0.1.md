# TCG — Design de fundação v0.1

Data: 9 de novembro de 2026. Status: proposta para revisão, sem implementação iniciada. Nome comercial ainda não definido.

## 1. Intenção e decisões confirmadas

Criar um trading card game para navegador, com campanha single player, multiplayer casual e ranqueado, duelos 2v2, coleção, moedas, compra e troca de cartas, conquistas e raridades. Usar fantasia misturada a cenários realistas: metrópoles retomadas pela natureza, cidades cyberpunk retrofuturistas, civilizações robóticas e criaturas carismáticas com identidade original.

A direção escolhida é Fábula neon, combinada a paisagens de reconquista verde e mistérios de mitologia sintética. O jogador cria vínculos com criaturas. O combate usa ações alternadas e respostas, com profundidade e aprendizado gradual. Poderosas invocações exigem progressão dentro da partida. Uma companheira central evolui durante o duelo por ressonância.

Todos os números, nomes próprios e detalhes abaixo são propostas do designer para teste, não decisões já aprovadas pelo jogador.

## 2. Universo e premissa narrativa

Uma rede planetária criada para restaurar ecossistemas sofreu um fenômeno chamado, provisoriamente, Reverberação. Sistemas artificiais, matéria orgânica e memórias passaram a interagir. Décadas depois, florestas conduzem eletricidade, máquinas conscientes constroem cidades e criaturas habitam ruínas humanas ainda ocupadas.

Os Vinculadores aprendem a registrar Ecos: manifestações consentidas de uma conexão, usadas para convocar criaturas em duelos. Uma carta representa um Eco, e pode circular entre jogadores sem transferir ou apagar a história pessoal vivida com a criatura. Afinidade, apelidos e lembranças pertencem à conta; a cópia comercializável pertence à coleção.

A campanha começa quando uma estação restaurada desperta e reproduz a voz de alguém que desapareceu antes da Reverberação. O jogador viaja com sua primeira companheira para investigar. Civilizações discordam sobre restaurar a rede, desligá-la ou permitir que continue mudando o mundo. Robôs possuem cultura e interesses próprios; não formam uma facção moralmente uniforme.

O tom mistura descoberta, afeto e perigo. Cada região precisa mostrar vida cotidiana além de ruínas. Criaturas têm ecologia, comportamento e silhueta próprios; referências de outros jogos orientam o sentimento de vínculo, sem reproduzir personagens ou desenhos.

## 3. Abordagens consideradas

Visual: Reconquista verde priorizaria exploração; Fábula neon prioriza vínculo e aventura; Mitologia sintética priorizaria escala e mistério. Foi escolhida Fábula neon como base, com elementos das outras duas.

Combate: turnos completos facilitariam sequências longas, mas aumentariam espera; posições por setores adicionariam um sistema tático e maior carga de aprendizado. Ações alternadas com respostas foram escolhidas para sustentar interação e cooperação. O primeiro protótipo não terá movimentação por setores.

Execução proposta: desenvolver primeiro um duelo local verificável, depois economia e serviços online. A visão completa permanece como destino, enquanto o primeiro marco testa se jogar e evoluir a companheira é divertido.

## 4. Regras propostas para o protótipo 1v1

- Objetivo: reduzir a integridade do Nexo adversário de 25 a zero. A vida pertence ao Nexo, não à companheira.
- Deck: 30 cartas, até duas cópias de cada carta; uma companheira definida fora do deck. Formas evoluídas da companheira não ocupam cartas adicionais.
- Mão inicial: quatro cartas, uma troca inicial das indesejadas; compra de uma carta por rodada. Limite de oito cartas na mão.
- Campo: até cinco criaturas por jogador. A companheira ocupa uma dessas vagas.
- Recursos: energia máxima começa em um e cresce um por rodada, até dez. No início da rodada, a energia é restaurada ao máximo. Não há cartas de recurso obrigatórias no deck nem reserva de energia entre rodadas no primeiro protótipo.
- Cada ação principal passa a iniciativa ao adversário. Dois passes consecutivos, sem efeitos pendentes, encerram a rodada. A prioridade inicial alterna a cada rodada; a primeira é sorteada.
- Ações principais: invocar criatura, jogar tática, ativar habilidade ou declarar um ataque com uma criatura disponível. Táticas e habilidades indicam expressamente se admitem resposta.
- Ataque: o atacante se compromete e fica exaurido até a próxima rodada. O defensor pode escolher uma criatura disponível para bloquear, que também fica exaurida. Sem bloqueio, o dano atinge o Nexo. Criaturas em combate causam dano simultâneo entre si.
- Criaturas invocadas na rodada não atacam imediatamente, exceto por habilidade explícita. Podem bloquear. Dano permanece nas criaturas entre rodadas até cura ou saída do campo.
- Respostas: cartas com marcador de resposta podem ser usadas em janelas indicadas. Custos são pagos ao anunciar a ação; a prioridade alterna até ambos passarem. Efeitos resolvem do último anunciado ao primeiro, com nova janela após cada resolução. Alvos inválidos anulam apenas as partes que dependem deles, sem devolver custos.
- Gatilhos simultâneos entram em ordem estável: jogador com iniciativa inicial da rodada, depois o outro; dentro de cada lado, ordem de entrada no campo. Novos gatilhos aguardam a conclusão do efeito atual.
- Ao atingir zero de integridade, verificar derrota ao fim do efeito atual; ambos em zero resultam em empate. Sem carta para comprar, sofrer fadiga crescente de um, dois, três pontos por tentativa, evitando bloqueios por deck vazio.

Ataques sempre admitem resposta. Sua sequência é declaração do atacante e alvo, respostas, escolha de bloqueador, respostas e dano. Se o bloqueador sair após ser declarado, o ataque permanece bloqueado e não atinge o Nexo, salvo habilidade explícita. Se o atacante sair, o ataque termina sem dano. Na resolução, usar atributos atuais e respeitar efeitos já resolvidos. Uma criatura com vida igual ou inferior a zero sai do campo após cada efeito e antes da próxima janela de resposta.

O texto final das cartas deve permitir identificar custo, velocidade, alvo e momento de resolução. Não haverá condições secretas de evolução nem resposta fora de uma janela anunciada.

## 5. Companheira e evolução

A companheira começa disponível em uma zona de vínculo visível, precisa ser invocada pagando energia e não depende da compra de cartas. Não é uma unidade invulnerável. Sua evolução mantém a identidade visual e acrescenta comportamento e capacidades coerentes com o deck.

Três estágios propostos: Inicial, Desperta e Ascendente. Desperta exige três pontos de ressonância; Ascendente exige sete pontos, uma rodada anterior já em Desperta e uma condição temática explícita. Evoluir custa energia, é uma ação respondível e só pode acontecer uma vez por rodada.

Ressonância é individual, pública e reinicia a cada duelo. Cada companheira oferece dois objetivos temáticos; cada objetivo pontua no máximo uma vez por rodada, totalizando no máximo dois pontos por rodada. Nenhum objetivo depende apenas de causar dano ao Nexo: decks defensivos também precisam progredir. Não ganhar ressonância por repetir cura sem dano ou gerar ciclos de valor nulo.

Ao ser derrotada, a companheira retorna à zona de vínculo e fica indisponível pelo restante da rodada e pela rodada seguinte. Sua próxima invocação custa mais dois de energia, sem ultrapassar dez, e ela retorna no estágio Inicial. Ressonância não é perdida, mas os estágios precisam ser conquistados novamente, pagando e respeitando a evolução única por rodada. Isso preserva acesso sem permitir retornos imediatos em ciclo.

Exemplo provisório: uma criatura de cerâmica e raízes ganha ressonância ao restaurar a vida de um aliado ferido e ao terminar uma rodada tendo protegido outra criatura. Ao despertar, desenvolve jardins luminosos; na forma ascendente, restaura o campo e ameaça um ataque decisivo. Seus valores ainda serão calibrados.

Ressonância é um requisito acumulado, não consumido ao evoluir. Evolução conserva dano recebido, exaustão e efeitos temporários; troca os atributos-base e as habilidades pelos do novo estágio. Seu custo proposto é dois de energia para Desperta e quatro para Ascendente. O acréscimo de reinvocação é cumulativo: custo-base mais dois por derrota, limitado a dez. Usar vida máxima menos dano acumulado para verificar sobrevivência após mudança de estágio.

Afinidade permanente desbloqueia histórias, gestos, expressões e cosméticos. Ela não aumenta os atributos competitivos. A forma Ascendente oferece vantagem forte e oportunidades de finalização, mas não reduz automaticamente a vida rival a zero.

## 6. Arenas e clima

O terreno define a identidade visual; um clima público altera interações marcadas nas cartas. No primeiro protótipo, sem bônus ocultos do terreno. Apenas um clima ativo por vez, com duração expressa e indicador de previsão das duas próximas rodadas.

A sequência de clima usa uma semente registrada e é igual para os dois lados; não depende de dados locais do cliente. Mudanças naturais acontecem antes da compra e da restauração de recursos. Cartas de alteração climática podem ser respondidas, substituem o clima atual por duração limitada e não reiniciam a sequência natural.

Para a primeira arena: tempo estável e chuva condutora. Exemplo de interação explícita: uma criatura com Condutor ganha uma habilidade durante chuva. Evitar uma regra global de dano que inutilize uma família inteira. O calendário precisa dar a cada deck oportunidades de adaptação.

Ranqueadas futuras usam arena e calendário conhecidos antes da escolha final do deck, com opção de ajustar ou cancelar a busca antes de entrar na fila. O calendário do duelo é mostrado no início. O jogador não paga para escolher um clima favorável.

## 7. Regiões e direção visual propostas

| Região provisória   | Paisagem e sociedade                                           | Estratégia possível            |
| ------------------- | -------------------------------------------------------------- | ------------------------------ |
| Jardins de Concreto | Metrópole ocupada, raízes em viadutos, cerâmica e fauna urbana | Restauração e crescimento      |
| Distrito Aurora     | Comércio noturno, CRTs, chuva e transporte suspenso            | Velocidade e respostas         |
| Arquivo de Ferrugem | Sociedade robótica, oficinas e templos de memória              | Reciclagem e preparação        |
| Maré de Vidro       | Cidade costeira, recifes luminosos e prédios submersos         | Adaptação e controle climático |

Não implementar quatro facções no primeiro marco. Começar com duas estratégias contrastantes e sem misturar regiões até validar as regras de deck.

Arte: ambientes com perspectiva e materiais realistas, criaturas estilizadas e expressivas, iluminação pictórica. Paleta base de azul profundo e pedra quente, com verde bioluminescente, coral e âmbar como acentos. Neon usado como sinalização e energia, preservando contraste e legibilidade.

Cartas usam arte separada da moldura e texto real na interface. Custos, atributos e condições permanecem legíveis sem brilho. Holo é acabamento independente de raridade; efeito de inclinação inspirado no componente React Bits indicado pelo usuário, com alternativa para toque e movimento reduzido. A integração e o desempenho ainda precisam ser verificados.

Assets iniciais: uma arena em camadas, duas companheiras em três estágios cada, ilustrações das demais cartas, moldura modular, verso, ícones de recursos, estados climáticos e retratos de dois personagens. Mockups e assets finais serão produzidos após revisão desta fundação.

## 8. Campanha e aprendizado

Introduzir as regras reais em capítulos progressivos, sem regras falsas que precisem ser desaprendidas. Primeiro combate guiado ensina ataque e defesa com poucas cartas; depois entram respostas, evolução, clima e combos. Decks de aprendizado podem ser menores e são identificados como formato de tutorial.

Progressão: encontros narrativos, exploração por pontos de interesse, desafios opcionais e chefes. Chefes podem quebrar limites convencionais, desde que suas exceções estejam declaradas e restritas ao PvE. Falhar permite repetir sem consumir ingresso ou moedas. Conquistas não exigem perder de propósito nem prejudicar o parceiro.

Primeiro capítulo proposto: uma estação-jardim com cinco encontros e um chefe, introduzindo a investigação da Reverberação. O primeiro protótipo testa só um encontro, não o capítulo inteiro.

## 9. Coleção, economia e trocas

Raridades propostas: Comum, Incomum, Rara e Lendária. Raridade não adiciona atributos automaticamente. Acabamentos: padrão, holo e arte alternativa; efeitos idênticos entre versões da mesma carta.

Moedas são ganhas por campanha, partidas elegíveis, missões e conquistas. Comprar cartas específicas deve ser possível; fragmentos de duplicatas permitem fabricar cartas. Preços, ritmo de ganho e eventual monetização dependem de testes e não estão aprovados. Evitar pagamento por poder exclusivo. O protótipo usa coleção fixa, sem transações reais.

Trocas futuras usam propostas com cópias específicas, validade, confirmação dos dois lados e cancelamento se qualquer item mudar. A operação é atômica e registrada: nenhuma carta pode ser negociada simultaneamente em duas ofertas. Cartas iniciais gratuitas podem ser vinculadas à conta; cartas obtidas para coleção negociável terão indicação explícita. Sem dinheiro real ou leilão no primeiro produto.

## 10. Multiplayer e ranqueado

Casual, partidas com amigos e reconexão antecedem o ranqueado. Servidor determina ações válidas, compra, aleatoriedade e resultados. Clientes recebem apenas informações permitidas; a mão adversária não é enviada ao navegador. Replays públicos devem preservar informação oculta durante partidas ativas.

Ranqueado futuro usa classificação de habilidade separada das conquistas, temporadas e recompensas predominantemente cosméticas. Desconexão concede janela de reconexão, seguida de regra de abandono declarada. Valores e duração das temporadas ficam para uma fase posterior.

2v2 proposto: cada equipe compartilha um Nexo de 40; cada jogador mantém deck, mão, energia, campo de até cinco criaturas, companheira e ressonância individuais. Iniciativa alterna A1, B1, A2, B2, com rotação de quem começa a cada rodada. Ações e bloqueios podem proteger o Nexo compartilhado; só cartas explicitamente aliadas transferem benefícios ou permitem cooperação. Recursos não são doados livremente. A equipe só perde pelo Nexo ou desistência coletiva conforme regra futura, não pela derrota de uma companheira. Duas companheiras iguais são permitidas inicialmente, sujeitas a teste. 2v2 é marco posterior ao 1v1, preservado como requisito de arquitetura.

## 11. Telas previstas

Menu com companheira, jornada, coleção e editor de decks, duelo, resultado/recompensas, perfil/conquistas, loja e trocas. Durante o duelo, destacar iniciativa, janelas de resposta, custo, previsão climática, objetivos da companheira e histórico das ações. Inspeção de carta explica palavras-chave e condições sem depender exclusivamente de hover.

Primeiro marco prioriza desktop com mouse e teclado. Layout de toque será considerado na estrutura, mas suporte completo a celular e PWA não são promessas do primeiro protótipo. Não usar somente cor para distinguir facções ou estados.

## 12. Escopo e abordagem técnica proposta

Marco 1: motor de regras separado da apresentação, duelo 1v1 local contra uma IA simples, duas listas fixas de 30 cartas construídas de 20 identidades: dez neutras compartilhadas e cinco exclusivas por região. Cada lista usa duas cópias de suas 15 identidades. Além delas, duas companheiras com três estágios, uma arena, dois climas, tutorial curto e resultado. IA respeita informações ocultas. Sem contas, pagamentos, rede ou inventário persistente neste marco.

Marco 2: campanha inicial, coleção salva e construção de deck. Marco 3: servidor autoritativo, conta, partidas privadas e reconexão. Marco 4: casual público, economia, conquistas e ranqueado. Marco 5: 2v2 e trocas. Cada marco exige validação antes de ampliar escopo.

Proposta técnica, não escolha confirmada: TypeScript no motor e React na interface para aproveitar a experiência do autor e o componente holo. Hospedagem, framework de aplicação, banco, autenticação e infraestrutura realtime ficam para o plano técnico, depois da aprovação do design. Arte de cartas e arena não exigem física ou um mundo 3D explorável.

## 13. Verificação e critérios do primeiro marco

É possível começar, jogar e concluir uma partida válida, evoluir as duas companheiras, responder a uma ação e observar um clima previsto afetar uma carta. Uma criatura inicial pode contribuir mesmo após uma evolução avançada. Não é possível invocar a forma final na primeira rodada.

Testar motor com foco em custos, prioridade, alvos invalidados, bloqueio, gatilhos, derrota simultânea, ressonância limitada, companheira derrotada e mudança de clima. Simulações devem detectar ciclos sem avanço e estados ilegais. Testes manuais validam compreensão das janelas e leitura das cartas. Alvo inicial de duração: 10–18 minutos, ainda sem evidência de balanceamento.

## 14. Limites e decisões restantes

Este documento não afirma que o balanceamento funciona antes de um teste jogável. Não serão criados todos os modos ao mesmo tempo. O primeiro marco valida o combate; persistência e serviços vêm depois. Não haverá implementação antes da revisão desta proposta.

Nome comercial, nomes das criaturas, orçamento de arte e hospedagem, idioma além de português, monetização e produção mobile permanecem abertos. O designer pode ajustar números em testes registrando o motivo. Mudanças no modelo de vínculo, estrutura de evolução ou regras de propriedade devem voltar ao autor para decisão.
