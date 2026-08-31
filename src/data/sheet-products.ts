/**
 * Modelo da ficha impressa (card 177 x 65 mm) do Catálogo Importway.
 * Estrutura pensada para vir de banco de dados / planilha sem alterar a UI.
 */

export interface SheetVariant {
  sku: string;
  /** Nome da cor, ex.: "BRANCO". */
  color: string;
  /** "light" = etiqueta clara com borda; "accent" = etiqueta destacada. */
  tone: "light" | "accent";
}

export interface SheetBarcode {
  code: string;
  /** Vincula o código de barras a uma variante pela cor do marcador. */
  tone: "light" | "accent";
}

export interface SheetRow {
  label: string;
  /** Unidade exibida em peso normal ao lado do rótulo, ex.: "(CM)". */
  unit?: string;
  value: string;
}

export interface SheetProduct {
  id: string;
  title: string;
  /** Marcadores descritivos, distribuídos em duas colunas. */
  bullets: string[];
  variants: SheetVariant[];
  barcodes: SheetBarcode[];
  ncm: string;
  /** Tabela de dados do produto (peso, altura, largura, comprimento…). */
  product: SheetRow[];
  /** Tabela MASTER (quantidade, peso, dimensões, cubagem). */
  master: SheetRow[];
  image: { url?: string; alt: string };
}

export const sheetProducts: SheetProduct[] = [
  {
    id: "bw548",
    title: "Mini Carro Elétrico 6V",
    bullets: [
      "Mini carro elétrico 6V rosa",
      "Indicado para crianças a partir de 3 anos",
      "Bateria recarregável de 6V",
      "Tempo de carregamento: 8 a 12 horas",
      "Peso máximo suportado: 30kg",
      "Possui som e luz",
      "Vem com controle remoto",
      "Tamanho do produto: 89 x 47 x 43cm",
      "Produto certificado pelo Inmetro e Anatel",
    ],
    variants: [
      { sku: "BW548BR", color: "Branco", tone: "light" },
      { sku: "BW548RS", color: "Rosa", tone: "accent" },
    ],
    barcodes: [
      { code: "7908449968895", tone: "accent" },
      { code: "7908449968901", tone: "light" },
    ],
    ncm: "95030010",
    product: [
      { label: "Peso", unit: "(KG)", value: "9,69" },
      { label: "Altura", unit: "(CM)", value: "25" },
      { label: "Largura", unit: "(CM)", value: "48" },
      { label: "Comprimento", unit: "(CM)", value: "87" },
    ],
    master: [
      { label: "Quantidade", value: "1" },
      { label: "Peso", unit: "(KG)", value: "9,69" },
      { label: "Altura", unit: "(CM)", value: "25" },
      { label: "Largura", unit: "(CM)", value: "48" },
      { label: "Comprimento", unit: "(CM)", value: "87" },
      { label: "Cubagem", unit: "(M³)", value: "0,104" },
    ],
    image: { alt: "Mini carro elétrico 6V branco com controle remoto" },
  },
  {
    id: "bw112",
    title: "Moto Elétrica Infantil 6V",
    bullets: [
      "Moto elétrica infantil 6V",
      "Indicada para crianças a partir de 3 anos",
      "Bateria recarregável de 6V",
      "Tempo de carregamento: 8 a 12 horas",
      "Peso máximo suportado: 25kg",
      "Rodas de apoio removíveis",
      "Faróis com luz de LED",
      "Tamanho do produto: 66 x 38 x 45cm",
      "Produto certificado pelo Inmetro",
    ],
    variants: [
      { sku: "BW112VM", color: "Vermelho", tone: "light" },
      { sku: "BW112AZ", color: "Azul", tone: "accent" },
    ],
    barcodes: [
      { code: "7908449961124", tone: "accent" },
      { code: "7908449961131", tone: "light" },
    ],
    ncm: "95030010",
    product: [
      { label: "Peso", unit: "(KG)", value: "6,42" },
      { label: "Altura", unit: "(CM)", value: "31" },
      { label: "Largura", unit: "(CM)", value: "40" },
      { label: "Comprimento", unit: "(CM)", value: "69" },
    ],
    master: [
      { label: "Quantidade", value: "1" },
      { label: "Peso", unit: "(KG)", value: "6,42" },
      { label: "Altura", unit: "(CM)", value: "31" },
      { label: "Largura", unit: "(CM)", value: "40" },
      { label: "Comprimento", unit: "(CM)", value: "69" },
      { label: "Cubagem", unit: "(M³)", value: "0,086" },
    ],
    image: { alt: "Moto elétrica infantil 6V" },
  },
  {
    id: "bw264",
    title: "Triciclo Infantil 3 em 1",
    bullets: [
      "Triciclo infantil 3 em 1 com haste de empurrar",
      "Indicado para crianças a partir de 1 ano",
      "Estrutura em aço com acabamento em polipropileno",
      "Cinto de segurança de 3 pontos",
      "Peso máximo suportado: 25kg",
      "Capota removível e retrátil",
      "Cesto traseiro para transporte",
      "Tamanho do produto: 78 x 48 x 98cm",
      "Produto certificado pelo Inmetro",
    ],
    variants: [
      { sku: "BW264CZ", color: "Cinza", tone: "light" },
      { sku: "BW264RS", color: "Rosa", tone: "accent" },
    ],
    barcodes: [
      { code: "7908449962640", tone: "accent" },
      { code: "7908449962657", tone: "light" },
    ],
    ncm: "87150000",
    product: [
      { label: "Peso", unit: "(KG)", value: "8,15" },
      { label: "Altura", unit: "(CM)", value: "34" },
      { label: "Largura", unit: "(CM)", value: "45" },
      { label: "Comprimento", unit: "(CM)", value: "72" },
    ],
    master: [
      { label: "Quantidade", value: "1" },
      { label: "Peso", unit: "(KG)", value: "8,15" },
      { label: "Altura", unit: "(CM)", value: "34" },
      { label: "Largura", unit: "(CM)", value: "45" },
      { label: "Comprimento", unit: "(CM)", value: "72" },
      { label: "Cubagem", unit: "(M³)", value: "0,110" },
    ],
    image: { alt: "Triciclo infantil 3 em 1 com capota" },
  },
  {
    id: "bw733",
    title: "Quadriciclo Elétrico 12V",
    bullets: [
      "Quadriciclo elétrico infantil 12V",
      "Indicado para crianças a partir de 3 anos",
      "Bateria recarregável de 12V",
      "Tempo de carregamento: 8 a 12 horas",
      "Peso máximo suportado: 35kg",
      "Duas velocidades e marcha a ré",
      "Entrada USB e cartão SD",
      "Tamanho do produto: 105 x 62 x 68cm",
      "Produto certificado pelo Inmetro e Anatel",
    ],
    variants: [
      { sku: "BW733PT", color: "Preto", tone: "light" },
      { sku: "BW733VD", color: "Verde", tone: "accent" },
    ],
    barcodes: [
      { code: "7908449967331", tone: "accent" },
      { code: "7908449967348", tone: "light" },
    ],
    ncm: "95030010",
    product: [
      { label: "Peso", unit: "(KG)", value: "14,80" },
      { label: "Altura", unit: "(CM)", value: "40" },
      { label: "Largura", unit: "(CM)", value: "58" },
      { label: "Comprimento", unit: "(CM)", value: "102" },
    ],
    master: [
      { label: "Quantidade", value: "1" },
      { label: "Peso", unit: "(KG)", value: "14,80" },
      { label: "Altura", unit: "(CM)", value: "40" },
      { label: "Largura", unit: "(CM)", value: "58" },
      { label: "Comprimento", unit: "(CM)", value: "102" },
      { label: "Cubagem", unit: "(M³)", value: "0,237" },
    ],
    image: { alt: "Quadriciclo elétrico infantil 12V" },
  },
];
