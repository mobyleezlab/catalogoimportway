# Corrigir corte e desalinhamento das fichas

## O que está errado hoje (medido no preview)

- A ficha tem altura fixa de 65 mm com `overflow-hidden`. O conteúdo interno precisa de ~69 mm, então **~16 mm são cortados na base**: as tabelas mostram apenas 3 das 6 linhas (Peso, Altura… somem) e a tabela NCM perde Largura/Comprimento.
- A lista de marcadores está presa dentro da coluna interna direita da metade esquerda, ficando com ~2 cm por coluna. O texto quebra em 4-6 linhas e o bloco de marcadores ocupa ~34 mm de altura — é ele que empurra as tabelas para fora da ficha.
- O cabeçalho usa um deslocamento fixo em pixels (`mt-[13px]`) somado ao padding do topo, o que desalinha o título do restante e consome altura.
- A faixa de marcadores e a faixa das tabelas usam grades independentes, então as colunas não coincidem visualmente com a tabela Master.

## Correções

1. **Altura garantida para as tabelas**: reorganizar a ficha em três faixas com orçamento vertical explícito (cabeçalho / marcadores + etiquetas / tabelas + foto), com a faixa das tabelas com altura mínima suficiente para as 6 linhas. Nada de conteúdo cortado dentro dos 65 mm.
2. **Marcadores mais largos e compactos**: as duas colunas de marcadores passam a ocupar toda a metade esquerda da ficha (como na referência), com entrelinha e espaçamento reduzidos, para que cada item caiba em 1-2 linhas.
3. **Alinhamento de colunas**: usar a mesma definição de grade (`minmax(0,1fr)_78mm` e as duas colunas internas) nas duas faixas, para que os marcadores e as tabelas NCM/Master compartilhem exatamente as mesmas guias verticais.
4. **Cabeçalho**: remover o deslocamento em pixels e usar apenas padding em mm, mantendo o título Futura ajustado automaticamente.
5. **Linhas sincronizadas**: manter o pareamento já existente (NCM↔Quantidade, Código de barras↔Peso, e assim por diante), agora com todas as linhas visíveis nas duas tabelas.

## Verificação

Screenshot via Playwright das 4 fichas, conferindo: todas as 6 linhas visíveis nas duas tabelas, nenhum texto cortado, marcadores em 1-2 linhas e colunas alinhadas com a tabela Master.

## Arquivo alterado

- `src/components/catalog/ProductSheetCard.tsx`
