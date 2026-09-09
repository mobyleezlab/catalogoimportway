# Importway Product Showcase Final

Crie o projeto web do Catálogo Importway, reproduzindo fielmente a estrutura, organização e identidade visual do catálogo físico/digital que estamos desenvolvendo.

1. OBJETIVO DO PROJETO

O sistema será um catálogo digital responsivo da Importway, funcionando principalmente como uma experiência de consulta de produtos.

A prioridade neste primeiro momento é construir a base estrutural, visual e técnica do catálogo.

Não crie um e-commerce.
Não implemente carrinho, checkout ou pagamento.
O foco é apresentar os produtos de forma organizada, profissional e fiel ao catálogo original.

A arquitetura deve ser preparada para posteriormente receber centenas de produtos através de banco de dados/importação de planilha.

2. ESTRUTURA DO CATÁLOGO

O catálogo possui uma estrutura baseada em cards independentes de produtos.

No material original, o layout foi pensado em uma página vertical de:

220 mm de largura

310 mm de altura

orientação retrato

Margens:

10 mm em todos os lados

Cada produto funciona como um bloco independente.

No layout original:

4 produtos por página

Cards com aproximadamente 177 mm de largura

Cards com aproximadamente 65 mm de altura

Espaçamento vertical aproximado de 5 mm entre os cards

As posições utilizadas no layout original são aproximadamente:

Card 1: Y = 22 mm

Card 2: Y = 92 mm

Card 3: Y = 162 mm

Card 4: Y = 232 mm

Essas medidas são referências do layout editorial original.

IMPORTANTE:

No ambiente web, NÃO fixe os produtos nessas coordenadas.

A implementação deve ser responsiva e baseada em componentes reutilizáveis.

Cada produto deve ser um componente independente, permitindo que a quantidade de produtos aumente ou diminua sem quebrar o layout.

3. PÁGINA PRINCIPAL

Crie uma página inicial do catálogo com:

Logo Importway

Nome/título do catálogo

Campo de busca

Filtros

Categorias

Grade/listagem de produtos

A experiência deve parecer um catálogo profissional de fabricante/importadora, e não uma loja virtual.

O usuário deve conseguir encontrar rapidamente um produto.

4. CARD DE PRODUTO

Crie um componente reutilizável chamado:

ProductCard

O card deve ser preparado para apresentar informações como:

imagem principal do produto

código/referência

nome do produto

descrição

características

cores

NCM

código de barras

dimensões

informações de embalagem

informações de pallet

demais informações técnicas disponíveis

Nem todos os campos precisam necessariamente aparecer no card resumido.

O card deve ter uma hierarquia visual clara.

A imagem do produto deve ter bastante destaque.

O código e o nome do produto devem ser facilmente identificáveis.

As informações técnicas devem possuir uma apresentação compacta e organizada.

5. PÁGINA/DETALHE DO PRODUTO

Ao clicar em um produto, abrir uma página ou visualização detalhada.

Essa área deve apresentar:

imagem grande do produto

nome

código

descrição

características

cores disponíveis

NCM

código de barras

dimensões

peso, quando disponível

informações de embalagem

quantidade por caixa

informações de pallet

outras especificações técnicas

A estrutura deve ser preparada para que novos campos possam ser adicionados futuramente sem precisar reconstruir o componente.

6. DADOS DOS PRODUTOS

Crie uma estrutura de dados centralizada.

NÃO coloque os produtos diretamente espalhados pelos componentes.

Inicialmente utilize dados mockados, mas crie uma estrutura semelhante a:

Product:

id

sku

name

category

description

image

gallery

colors

ncm

barcode

dimensions

weight

packaging

masterPallet

specifications

Os nomes dos campos podem ser ajustados conforme a estrutura real da planilha Importway.

A arquitetura deve permitir posteriormente substituir os dados mockados por:

Supabase

importação de XLSX/CSV

armazenamento de imagens

painel administrativo

7. CATEGORIAS

Crie uma estrutura preparada para categorias e subcategorias.

O usuário deve conseguir filtrar produtos por categoria.

A estrutura deve permitir futuramente:

categoria

subcategoria

marca

código

nome

características

cores

O sistema deve atualizar a listagem sem recarregar a página.

8. BUSCA

Implemente uma busca rápida.

O usuário poderá pesquisar por:

nome do produto

código/SKU

código de barras

categoria

A busca deve funcionar em tempo real.

Exemplo:

Se o usuário digitar:

BW093

o catálogo deve localizar o produto correspondente.

9. DESIGN RESPONSIVO

O catálogo deve funcionar perfeitamente em:

desktop

notebook

tablet

celular

No desktop, priorize uma experiência semelhante a um catálogo profissional.

No mobile, reorganize os cards para uma coluna ou estrutura adequada à largura disponível.

Não simplesmente diminua o layout desktop.

Crie uma experiência mobile própria, mantendo a identidade visual.

10. IDENTIDADE VISUAL

A interface deve transmitir:

profissionalismo

organização

catálogo corporativo

clareza

qualidade

simplicidade

Não utilize estética de marketplace.

Evite:

excesso de sombras

excesso de gradientes

botões exagerados

visual de loja virtual

elementos desnecessários

Priorize:

tipografia limpa

boa hierarquia

espaçamento consistente

imagens dos produtos

informações técnicas bem organizadas

aparência editorial

11. COMPONENTIZAÇÃO

Crie componentes reutilizáveis.

Estrutura sugerida:

Header

CatalogHeader

SearchBar

CategoryFilter

ProductGrid

ProductCard

ProductImage

ProductInfo

TechnicalSpecifications

ProductDetail

Footer

Não duplicar código entre produtos.

Um único ProductCard deve conseguir renderizar qualquer produto.

12. ARQUITETURA PARA ESCALA

Mesmo que inicialmente existam poucos produtos, o sistema deve ser construído pensando em um catálogo com centenas de itens.

Não criar uma página individual manualmente para cada produto.

Utilizar:

arrays/objetos estruturados inicialmente

componentes reutilizáveis

rotas dinâmicas

IDs/Slugs de produtos

filtros

busca

paginação ou carregamento progressivo quando necessário

13. PREPARAÇÃO PARA SUPABASE

Estruture o projeto para posteriormente utilizar Supabase.

Não é necessário implementar toda a integração agora.

Mas deixe a arquitetura preparada para:

products

categories

product_images

product_specifications

Posteriormente poderemos criar um painel administrativo para cadastrar/importar produtos.

14. IMAGENS

As imagens dos produtos são extremamente importantes.

Crie o sistema pensando que cada produto poderá possuir:

imagem principal

imagens adicionais

imagens em diferentes ângulos

As imagens devem:

manter proporção

não ficar distorcidas

possuir boa resolução

ter carregamento otimizado

possuir fallback caso não exista imagem

Não utilize imagens aleatórias da internet para representar produtos reais da Importway.

Enquanto os arquivos reais não estiverem disponíveis, utilize placeholders claramente identificados ou uma estrutura mockada.

15. EXPERIÊNCIA DE NAVEGAÇÃO

O usuário deve conseguir:

Entrar no catálogo

Visualizar categorias

Pesquisar produto

Filtrar produtos

Abrir um produto

Visualizar todas as informações

Voltar facilmente para o catálogo

A navegação deve ser simples e intuitiva.

16. IMPORTANTE SOBRE O LAYOUT ORIGINAL

O catálogo que estamos desenvolvendo possui uma lógica editorial específica.

Os produtos são apresentados como blocos independentes, e não como uma simples tabela.

Cada bloco possui sua própria estrutura de:

imagem + identificação + informações técnicas.

Essa lógica deve ser preservada na versão web.

Não transformar o catálogo em uma tabela de produtos.

Não transformar o catálogo em cards genéricos de e-commerce.

A referência visual principal deve ser o catálogo editorial da Importway que estamos desenvolvendo.

17. TECNOLOGIA

Utilize:

React

TypeScript

Tailwind CSS

componentes reutilizáveis

arquitetura limpa

responsividade

boas práticas de acessibilidade

Evite criar código desnecessariamente complexo.

Priorize uma base simples, organizada e fácil de evoluir.

18. PRIMEIRA ENTREGA

Nesta primeira etapa, NÃO tente implementar tudo de uma vez.

Quero que você primeiro construa:

estrutura do projeto

layout principal

header

área de catálogo

filtros

busca

ProductCard

página de detalhe

dados mockados

responsividade

arquitetura preparada para Supabase

Use alguns produtos fictícios apenas para demonstrar o funcionamento da interface.

Depois que essa primeira estrutura estiver pronta, vamos inserir os produtos reais da Importway e ajustar o visual comparando diretamente com o catálogo original.

REGRA PRINCIPAL

A partir deste ponto, trate o catálogo como um produto digital real, e não como uma landing page.

Priorize arquitetura, componentização, consistência visual e escalabilidade.

Não avance para funcionalidades desnecessárias antes de termos a estrutura visual principal correta.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://catalogoimportway.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4fbeb171-9c89-4d15-9d4c-84c41a1f2279).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
