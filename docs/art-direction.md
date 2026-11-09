# Direção de arte — revisão 2

O autor rejeitou o atlas inicial em 9/11/2026: criaturas genéricas e aparência excessiva de imagem gerada. Sua referência destaca personagens reconhecíveis, desenho intencional e personalidade. Essa orientação substitui a direção anterior das criaturas; não muda o combate aprovado.

## Regras da nova direção

1. Uma silhueta específica e identificável a 60–100 px, inclusive sem iluminação.
2. Anatomia com proporções repetíveis antes de produzir evolução ou animação.
3. Contorno desenhado, massas de cor claras, uma sombra por cor e poucos detalhes.
4. Um gesto ou comportamento característico, derivado de habitat e função.
5. Evitar animal conhecido acrescido de folhas, galhadas, cristais ou neon como única ideia.
6. Brilho holo pertence ao acabamento da carta; não substitui a identidade do personagem.
7. Uma folha de modelo e uma carta em escala real devem ser avaliadas antes de expandir a coleção.

## Estudo Brotoco v2

Semente de terracota que se apoia em dois braços grandes, com duas patas traseiras pequenas. Rosto em meia-lua escura, olhos amarelos, folha assimétrica e cauda-raiz bifurcada. Quatro cores principais: terracota, menta, ameixa e amarelo. Expressão determinada. Esse é um estudo para avaliação, não um design final aprovado.

O estudo gerado está em `public/art/brotoco-model-v2.png`. Interface usa recorte CSS sem alterar a imagem-fonte. A folha completa aparece no Ateliê. Não produzir as evoluções antes da validação da anatomia.

## Pipeline de assets

Fontes de estudo ficam documentadas neste arquivo; assets consumidos pelo runtime ficam em `public/art/`, com estado em `manifest.json`. O atlas rejeitado foi preservado no arquivo do primeiro protótipo e não é publicado no repositório, nem usado no jogo. Cards restantes usam símbolos de função e o texto explícito “Ilustração em revisão”. Esses símbolos são placeholders, não propostas de criatura.

Para produção: uma ilustração por carta, texto fora da imagem, proporção e recorte controlados. Criaturas terão versão em silhueta e testes de leitura em 60, 100 e 200 px. Moldura, regras, VFX e arte devem permanecer separados. Exportações comprimidas e testes de memória serão feitos após aprovação do estilo.

## Acabamento holo

O registry TypeScript/CSS de React Bits Holo Card foi inspecionado. O componente original usa canvas/WebGL e recebe imagem, sem composição de regras HTML como conteúdo. Para este primeiro teste, foi criado `holo-finish.tsx` próprio em CSS, sem copiar o código upstream. Só aparece em inspeção, com alternativa estática para movimento reduzido e sem alterar os atributos. A integração exata do componente React Bits permanece uma opção para a produção.

## Briefs das imagens

Arena: metrópole real retomada por jardins, trens elevados, canais, CRTs âmbar sem textos, pôr do sol coral, névoa teal, centro discreto para sobreposição do tabuleiro. Conceito pictórico de ambiente, sem interface.

Brotoco v2: folha de modelo 2D com pose principal de três quartos e vistas secundárias. Criatura original de semente/terracota, braços anteriores grandes, patas posteriores pequenas, rosto escuro crescente, folha assimétrica, cauda bifurcada. Contorno expressivo, cores planas, sombras simples e papel claro. Sem pelo, focinho, galhadas, 3D, bloom ou partículas. O resultado ainda precisa de revisão manual da consistência entre vistas.
