/**
 * Dimensões fixas da página e das fichas. Todas as medidas em milímetros.
 */
export const PAGE = { width: 220, height: 307 } as const;

export const MARGINS = {
  top: 22,
  bottom: 10,
  left: 21.5,
  right: 21.5,
} as const;

/** Margem adicional no topo reservada ao título fixo do catálogo. */
export const HEADER_MARGIN = 10;

const CARD_GAP = 4;
const CARDS_PER_PAGE = 4;

const contentTop = MARGINS.top + HEADER_MARGIN;
const contentBottom = MARGINS.bottom;

export const CARD_HEIGHT =
  (PAGE.height - contentTop - contentBottom - (CARDS_PER_PAGE - 1) * CARD_GAP) /
  CARDS_PER_PAGE;

export const CARD_GAP_MM = `${CARD_GAP}mm`;
