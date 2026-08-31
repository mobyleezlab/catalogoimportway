import type { CSSProperties } from "react";
import type { SheetBarcode, SheetProduct, SheetRow, SheetVariant } from "@/data/sheet-products";
import { cn } from "@/lib/utils";

/** Altura fixa das células para que NCM e MASTER fiquem na mesma direção. */
const CELL =
  "h-[3.6mm] border-b-[0.25mm] border-sheet-page px-[1mm] py-[0.5mm] align-middle last:border-b-0";

/** Cores alternadas das linhas das tabelas. */
const ROW_COLORS = ["bg-[#f2f1ef]", "bg-[#e6e6e4]"];

/** Ficha de produto no formato impresso de 177 x 65 mm. */
export function ProductSheetCard({ product }: { product: SheetProduct }) {
  const half = Math.ceil(product.bullets.length / 2);
  const columns = [product.bullets.slice(0, half), product.bullets.slice(half)];
  const variantRows: SheetVariant[][] = [];
  for (let i = 0; i < product.variants.length; i += 4) {
    variantRows.push(product.variants.slice(i, i + 4));
  }

  // Alturas e cores compartilhadas: linha a linha, NCM alinha com QUANTIDADE,
  // CÓDIGO DE BARRAS alinha com PESO (KG), e assim por diante.
  const barcodeCount = product.barcodes?.length ?? 0;
  const barcodeHeight = Math.max(3.6, barcodeCount * 2.6 + 1.6);
  const rowCount = 1 + Math.max(product.product.length, product.master.length - 1);
  const rowHeights = Array.from({ length: rowCount + 1 }, (_, index) =>
    index === 1 && barcodeCount ? `${barcodeHeight}mm` : "3.6mm",
  );
  const rowColors = Array.from(
    { length: rowCount + 1 },
    (_, index) => ROW_COLORS[index % ROW_COLORS.length] as string,
  );
  const flexRowIndex = barcodeCount ? 1 : undefined;

  return (
    <article className="flex h-[65mm] w-[177mm] flex-col overflow-hidden rounded-[2.5mm] border-[0.3mm] border-sheet-edge bg-sheet-page pt-[1.2mm] font-sheet">
      <header className="mt-[13px] bg-sheet-navy px-[4mm] py-[1.6mm]">
        <h2 className="text-[5mm] font-extrabold uppercase leading-none tracking-[-0.01em] text-sheet-navy-foreground">
          {product.title}
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-[1.2mm] px-[4mm] pb-[1.6mm] pt-[1.3mm]">
        {/* Faixa superior: marcadores à esquerda, etiquetas de SKU/cor à direita */}
        <div className="flex items-start gap-x-[3mm]">
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-[3mm]">
            {columns.map((column, index) => (
              <ul key={index} className="space-y-[0.4mm]">
                {column.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-[1mm] text-[2.1mm] leading-[1.3] text-sheet-text"
                  >
                    <span aria-hidden="true">•</span>
                    <span className="min-w-0">{bullet}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Etiquetas de SKU/cor: máx. 4 por linha; sobras alinhadas à direita */}
          <div className="flex shrink-0 flex-col items-end gap-[1mm]">
            {variantRows.map((row, index) => (
              <div key={index} className="flex justify-end gap-[1mm]">
                {row.map((variant) => (
                  <VariantTag key={variant.sku} variant={variant} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Faixa inferior: tabelas técnicas + imagem + selo Inmetro */}
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_78mm] gap-x-[2.5mm] pt-[1.5mm]">
          <div className="grid min-h-0 grid-cols-2 items-start gap-x-[2.5mm]">
            <SpecTable
              headingLabel="NCM"
              headingValue={product.ncm}
              barcodes={product.barcodes}
              rows={product.product}
              rowHeights={rowHeights}
              rowColors={rowColors}
              flexRowIndex={flexRowIndex}
            />
            <SpecTable
              heading="Master"
              rows={product.master}
              rowHeights={rowHeights}
              rowColors={rowColors}
              flexRowIndex={flexRowIndex}
            />
          </div>

          <div className="relative min-h-0">
            <div className="h-full w-full">
              {product.image.url ? (
                <img
                  src={product.image.url}
                  alt={product.image.alt}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[1.2mm] border border-dashed border-sheet-edge">
                  <span className="px-[3mm] text-center text-[2mm] uppercase tracking-[0.14em] text-sheet-text">
                    Imagem do produto
                  </span>
                </div>
              )}
            </div>

            {/* Espaço reservado ao selo do Inmetro no canto da ficha */}
            <div className="absolute bottom-0 right-0 flex h-[13mm] w-[13mm] flex-col items-center justify-center rounded-[1.2mm] border-[0.25mm] border-dashed border-sheet-edge bg-sheet-value text-center">
              <span className="text-[1.8mm] font-extrabold uppercase leading-[1.15] tracking-[0.06em] text-sheet-navy">
                Inmetro
              </span>
              <span className="mt-[0.5mm] text-[1.4mm] uppercase leading-[1.1] tracking-[0.04em] text-sheet-text">
                Selo
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function VariantTag({ variant }: { variant: SheetVariant }) {
  const accent = variant.tone === "accent";
  return (
    <div
      className={cn(
        "min-w-[13mm] rounded-[1mm] px-[1mm] py-[0.7mm] text-center leading-none",
        accent
          ? "bg-sheet-navy text-sheet-navy-foreground"
          : "border-[0.25mm] border-sheet-edge bg-card text-sheet-navy",
      )}
    >
      <p className="whitespace-nowrap text-[2.1mm] font-extrabold tracking-[0.01em]">
        {variant.sku}
      </p>
      <p className="mt-[0.4mm] whitespace-nowrap text-[1.7mm] font-medium uppercase tracking-[0.04em]">
        {variant.color}
      </p>
    </div>
  );
}

function SpecTable({
  rows,
  heading,
  headingLabel,
  headingValue,
  barcodes,
  rowHeights = [],
  rowColors = [],
  flexRowIndex,
}: {
  rows: SheetRow[];
  heading?: string;
  headingLabel?: string;
  headingValue?: string;
  barcodes?: SheetBarcode[];
  rowHeights?: string[];
  rowColors?: string[];
  flexRowIndex?: number | undefined;
}) {
  let rowIndex = 0;
  const nextRow = () => {
    const index = rowIndex++;
    const height = rowHeights[index];
    return {
      bg: (rowColors[index] ?? ROW_COLORS[0]) as string,
      style: height
        ? index === flexRowIndex
          ? { minHeight: height }
          : { height }
        : undefined,
    };
  };

  return (
    <div>
      <div
        className={cn(
          "flex h-[2.6mm] w-[54%] items-center justify-center rounded-t-[2mm] px-[1.4mm]",
          heading ? "bg-sheet-master" : "invisible",
        )}
      >
        <span className="text-[2mm] font-extrabold uppercase leading-none tracking-[0.04em] text-sheet-navy-foreground">
          {heading ?? "."}
        </span>
      </div>

      <div className="overflow-hidden rounded-[2mm]">
        <table className="w-full table-fixed border-collapse text-[2.1mm]">
          <tbody>
            {headingLabel
              ? (() => {
                  const { bg, style } = nextRow();
                  return (
                    <SpecRow
                      row={{ label: headingLabel, value: headingValue ?? "" }}
                      emphasis
                      bgClass={bg}
                      style={style}
                    />
                  );
                })()
              : null}
            {barcodes?.length
              ? (() => {
                  const { bg, style } = nextRow();
                  return (
                    <tr style={style}>
                      <th
                        className={cn(
                          CELL,
                          "w-[54%] text-center font-extrabold uppercase leading-[1.2] tracking-[0.02em] text-sheet-text",
                          bg,
                        )}
                      >
                        Código
                        <br />
                        de barras
                      </th>
                      <td className={cn(CELL, "text-[1.8mm] text-sheet-text", bg)}>
                        <ul className="space-y-[0.3mm]">
                          {barcodes.map((barcode) => (
                            <li
                              key={barcode.code}
                              className="flex items-center gap-[1.2mm] whitespace-nowrap"
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "h-[1.5mm] w-[1.5mm] shrink-0 rounded-full",
                                  barcode.tone === "accent"
                                    ? "bg-sheet-navy"
                                    : "border-[0.25mm] border-sheet-edge bg-card",
                                )}
                              />
                              {barcode.code}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })()
              : null}
            {rows.map((row) => {
              const { bg, style } = nextRow();
              return <SpecRow key={row.label} row={row} bgClass={bg} style={style} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpecRow({
  row,
  emphasis,
  bgClass,
  style,
}: {
  row: SheetRow;
  emphasis?: boolean;
  bgClass: string;
  style?: CSSProperties | undefined;
}) {
  return (
    <tr style={style}>
      <th
        className={cn(
          CELL,
          "w-[54%] whitespace-nowrap text-center font-extrabold uppercase tracking-[0.01em] text-sheet-text",
          bgClass,
          emphasis ? "text-[2.3mm] tracking-[0.04em]" : "text-[2mm]",
        )}
      >
        {row.label}
        {row.unit ? <span className="text-[1.75mm] font-medium"> {row.unit}</span> : null}
      </th>
      <td className={cn(CELL, "text-center text-[2.1mm] text-sheet-text", bgClass)}>
        {row.value}
      </td>
    </tr>
  );
}
