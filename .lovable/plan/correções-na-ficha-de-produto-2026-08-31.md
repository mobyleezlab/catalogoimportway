# Correções na ficha de produto

## Problemas confirmados (src/components/catalog/ProductSheetCard.tsx)

1. **Linha "Código de barras" com cores diferentes entre as duas tabelas**
   - Cada célula da linha chama `nextBg()` separadamente, então as duas células da mesma linha podem receber cores alternadas distintas.
   - Além disso, a linha de códigos existe só na tabela NCM e consome índices extras de cor, dessincronizando o padrão de listras em relação à tabela Master.

2. **Textos cortando nas tabelas (ex.: códigos de barras)**
   - A linha de códigos usa altura fixa calculada (`count * 2.2 + 1.4` mm) dentro de um bloco com `overflow-hidden`; com 2+ códigos o conteúdo é cortado.

## Plano

1. **Cor uniforme e padrão de listras sincronizado**
   - Calcular a cor de cada linha pelo **índice visual da linha** (mesma posição nas duas tabelas → mesma cor), em vez de contadores independentes por tabela.
   - A linha de código de barras recebe **uma única cor** aplicada às duas células, correspondente à cor da linha com a qual ela alinha na tabela Master (Peso KG).
   - Resultado: listras alternadas `#f2f1ef` / `#e6e6e4` idênticas nas duas tabelas, linha a linha.

2. **Nenhum texto cortado**
   - Linha de códigos de barras: trocar altura fixa por **altura mínima** (cresce conforme a quantidade de códigos, sem `overflow` cortando), mantendo a altura sincronizada com a linha correspondente da tabela Master.
   - Revisar células de rótulo/valor: remover `whitespace-nowrap` onde causar estouro ou reduzir tracking/tamanho para caber, garantindo padding suficiente.

3. **Verificação**
   - Build e screenshot via Playwright da ficha, conferindo: cores iguais nas duas tabelas na linha de código de barras e nenhum texto cortado em todas as 4 fichas de exemplo.

## Arquivos alterados
- `src/components/catalog/ProductSheetCard.tsx` (único arquivo)
