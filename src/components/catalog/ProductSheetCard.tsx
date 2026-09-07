import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
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

  // Orçamento vertical da faixa das tabelas: cabeçalho da aba + todas as linhas.
  const tablesHeight = rowHeights.reduce(
    (total, height) => total + Number.parseFloat(height),
    2.6,
  );

  return (
    <article className="flex h-[65.75mm] w-[177mm] flex-col overflow-hidden border-[0.3mm] border-sheet-edge bg-sheet-page font-sheet">
      <header className="bg-sheet-navy px-[4mm] py-[1.8mm]">
        <SheetTitle title={product.title} />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_78mm] gap-x-[2.5mm] px-[4mm] pb-[1.8mm] pt-[1.3mm]">
        {/* Coluna esquerda: marcadores em duas colunas + tabelas técnicas */}
        <div className="flex min-h-0 min-w-0 flex-col gap-[1.2mm]">
          <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 gap-x-[3mm]">
            {columns.map((column, index) => (
              <ul key={index} className="min-w-0 space-y-[0.2mm]">
                {column.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-[0.8mm] text-[2mm] leading-[1.15] text-sheet-text"
                  >
                    <span aria-hidden="true">•</span>
                    <span className="min-w-0">{bullet}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <div
            className="grid shrink-0 grid-cols-2 items-start gap-x-[2.5mm]"
            style={{ minHeight: `${tablesHeight}mm` }}
          >
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
        </div>

        {/* Coluna direita: etiquetas de SKU/cor no topo e a imagem ocupando todo o resto */}
        <div className="flex min-h-0 flex-col gap-[1mm]">
          <div className="flex shrink-0 flex-nowrap items-start justify-end gap-[0.6mm]">
            {product.variants.map((variant) => (
              <VariantTag key={variant.sku} variant={variant} />
            ))}
          </div>



          <div className="relative min-h-0 flex-1">
            {product.image.url ? (
              <img
                src={product.image.url}
                alt={product.image.alt}
                className="h-full w-full object-contain object-center"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center border border-dashed border-sheet-edge">
                <span className="px-[3mm] text-center text-[2mm] uppercase tracking-[0.14em] text-sheet-text">
                  Imagem do produto
                </span>
              </div>
            )}

            {/* Espaço reservado ao selo do Inmetro no canto da ficha */}
            <div className="absolute bottom-0 right-0 flex h-[13mm] w-[13mm] flex-col items-center justify-center border-[0.25mm] border-dashed border-sheet-edge bg-sheet-value text-center">
              <span className="text-[1.8mm] font-bold uppercase leading-[1.15] tracking-[0.06em] text-sheet-navy">
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

/** Título em Futura PT Bold 10pt, reduzido só o necessário para nunca cortar/quebrar. */
function SheetTitle({ title }: { title: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState(10);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let current = 10;
    el.style.fontSize = `${current}pt`;
    while (el.scrollWidth > el.clientWidth && current > 5) {
      current -= 0.25;
      el.style.fontSize = `${current}pt`;
    }
    setSize(current);
  }, [title]);

  return (
    <h2
      ref={ref}
      style={{ fontSize: `${size}pt` }}
      className="w-full overflow-hidden whitespace-nowrap font-sheet font-bold uppercase leading-none tracking-[-0.01em] text-sheet-navy-foreground"
    >
      {title}
    </h2>
  );
}

function VariantTag({ variant }: { variant: SheetVariant }) {
  const accent = variant.tone === "accent";
  return (
    <div
      className={cn(
        "box-border flex h-[7mm] w-[12.5mm] flex-col items-center justify-center px-[1.2mm] py-[1mm] text-center leading-none",
        accent
          ? "bg-sheet-navy text-sheet-navy-foreground"
          : "border-[0.25mm] border-sheet-edge bg-card text-sheet-navy",
      )}
    >
      <p className="w-full truncate whitespace-nowrap text-[1.5mm] font-bold tracking-[0.01em]">
        {variant.sku}
      </p>
      <p className="mt-[0.4mm] w-full truncate whitespace-nowrap text-[1.3mm] font-medium uppercase tracking-[0.04em]">
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
          "flex h-[3.2mm] w-[54%] items-center justify-center px-[1.4mm]",
          heading ? "bg-sheet-master" : "invisible",
        )}
      >
        <span className="text-[2mm] font-bold uppercase leading-none tracking-[0.04em] text-sheet-navy-foreground">
          {heading ?? "."}
        </span>
      </div>

      <div className="overflow-hidden">
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
                          "w-[54%] text-center font-bold uppercase leading-[1.2] tracking-[0.02em] text-sheet-text",
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
                                  "h-[1.5mm] w-[1.5mm] shrink-0",
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
          "w-[54%] whitespace-nowrap text-center font-bold uppercase tracking-[0.01em] text-sheet-text",
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
