# Catálogo Importway — Base estrutural (Etapa 1)

Catálogo digital de consulta (sem carrinho, checkout ou pagamento), com estética editorial corporativa, componentes reutilizáveis e arquitetura pronta para centenas de produtos vindos de banco de dados.

## O que será entregue

1. **Página do catálogo (`/`)**
   - Cabeçalho com logo Importway, título do catálogo e identificação editorial.
   - Barra de busca em tempo real (nome, SKU, código de barras, categoria).
   - Filtro de categorias/subcategorias, atualizando a lista sem recarregar a página.
   - Grade de produtos: 1 coluna no mobile, 2 no tablet, blocos largos em formato editorial no desktop (proporção inspirada nos cards de 177 × 65 mm, sem coordenadas fixas).
   - Contador de resultados e estado vazio ("nenhum produto encontrado").

2. **ProductCard (bloco editorial)**
   - Imagem em destaque à esquerda, com proporção preservada e fallback quando não houver arquivo.
   - Código/SKU e nome com forte hierarquia visual.
   - Descrição curta + linha compacta de dados técnicos (cores, NCM, dimensões, embalagem).
   - Um único componente renderiza qualquer produto.

3. **Página de detalhe (`/produto/$slug`)**
   - Imagem grande + galeria de miniaturas.
   - Nome, código, categoria, descrição, características, cores.
   - Blocos de especificações: identificação (NCM, código de barras), dimensões e peso, embalagem/quantidade por caixa, pallet master, e uma seção genérica de especificações extras que aceita novos campos sem alterar o componente.
   - Botão claro de retorno ao catálogo.

4. **Dados mockados centralizados**
   - Um único módulo de dados com o tipo `Product` (id, slug, sku, name, category, subcategory, brand, description, features, image, gallery, colors, ncm, barcode, dimensions, weight, packaging, masterPallet, specifications) e o tipo `Category`.
   - 8 a 12 produtos fictícios, claramente marcados como demonstração, com placeholders de imagem identificados (sem fotos aleatórias da internet).

5. **Responsividade e acessibilidade**
   - Layout mobile próprio (coluna única, filtros compactos), não uma redução do desktop.
   - Foco visível, textos alternativos, marcação semântica, campos de busca rotulados.

## Detalhes técnicos

- React + TypeScript + Tailwind, dentro do stack do projeto (TanStack Start, rotas em `src/routes`).
- Componentes: `Header`, `CatalogHeader`, `SearchBar`, `CategoryFilter`, `ProductGrid`, `ProductCard`, `ProductImage`, `ProductInfo`, `TechnicalSpecifications`, `ProductDetail`, `Footer`.
- Camada de acesso a dados isolada (`getProducts`, `getProductBySlug`, `getCategories`) para que a troca por Lovable Cloud (tabelas `products`, `categories`, `product_images`, `product_specifications`) e importação de XLSX/CSV não exija mudar componentes.
- Busca e filtros em memória com `useMemo`, prontos para migrar para consultas no banco.
- Rota dinâmica por slug, sem páginas manuais por produto; paginação/carregamento progressivo fica preparado mas só entra quando o volume exigir.
- Tokens de cor/tipografia definidos em `src/styles.css`; sem gradientes ou sombras exageradas.
- SEO por rota: títulos e descrições próprios no catálogo e na página de produto.

## Fora do escopo desta etapa

Carrinho, checkout, pagamentos, login, painel administrativo, integração com Supabase e importação real de planilha.

## Próximo passo após aprovação

Antes de escrever o código, vou apresentar 3 direções visuais editoriais renderizadas para você escolher a identidade do catálogo.
