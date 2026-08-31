import type { SheetBarcode, SheetProduct, SheetRow, SheetVariant } from "@/data/sheet-products";
import { cn } from "@/lib/utils";

/** Ficha de produto no formato impresso de 177 x 65 mm. */
export function ProductSheetCard({ product }: { product: SheetProduct }) {
  const half = Math.ceil(product.bullets.length / 2);
  const columns = [product.bullets.slice(0, half), product.bullets.slice(half)];

  return (
    <article className="flex h-[65mm] w-[177mm] flex-col overflow-hidden rounded-[2.5mm] border-[0.3mm] border-sheet-edge bg-sheet-page pt-[1.2mm]">
      <header className="bg-sheet-navy px-[4mm] py-[1.6mm]">
        <h2 className="text-[5mm] font-extrabold uppercase leading-none tracking-[-0.01em] text-sheet-navy-foreground">
          {product.title}
        </h2>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_62mm] gap-x-[2mm] px-[4mm] pb-[2mm] pt-[1.3mm]">
        {/* Coluna esquerda: marcadores + tabelas técnicas */}
        <div className="flex min-w-0 flex-col gap-[1.4mm]">
          <div className="grid grid-cols-2 gap-x-[3mm]">
            {columns.map((column, index) => (
              <ul key={index} className="space-y-[0.4mm]">
                {column.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-[1mm] text-[2.1mm] leading-[1.3] text-foreground"
                  >
                    <span aria-hidden="true" className="text-foreground">
                      •
                    </span>
                    <span className="min-w-0">{bullet}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 items-start gap-x-[3mm]">
            <SpecTable
              rows={[{ label: "NCM", value: product.ncm }]}
              barcodes={product.barcodes}
              trailingRows={product.product}
            />
            <SpecTable rows={product.master} heading="Master" />
          </div>
        </div>

        {/* Coluna da direita: etiquetas de variante + imagem */}
        <div className="flex min-w-0 flex-col">
          {/* Etiquetas de SKU/cor: suporta de 1 a 6 variantes com quebra em grade */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(17mm,1fr))] gap-[1mm]">
            {product.variants.map((variant) => (
              <VariantTag key={variant.sku} variant={variant} />
            ))}
          </div>
          <div className="min-h-0 flex-1 pt-[1.5mm]">
            {product.image.url ? (
              <img
                src={product.image.url}
                alt={product.image.alt}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1mm] border border-dashed border-sheet-edge">
                <span className="px-[3mm] text-center text-[2mm] uppercase tracking-[0.14em] text-muted-foreground">
                  Imagem do produto
                </span>
              </div>
            )}
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
        "min-w-[17mm] rounded-[1mm] px-[1.6mm] py-[1.1mm] text-center leading-none",
        accent
          ? "bg-sheet-navy text-sheet-navy-foreground"
          : "border-[0.25mm] border-sheet-edge bg-card text-sheet-navy",
      )}
    >
      <p className="text-[2.6mm] font-extrabold tracking-[0.01em]">{variant.sku}</p>
      <p className="mt-[0.7mm] text-[1.9mm] font-medium uppercase tracking-[0.04em]">
        {variant.color}
      </p>
    </div>
  );
}

function SpecTable({
  rows,
  heading,
  barcodes,
  trailingRows,
}: {
  rows: SheetRow[];
  heading?: string;
  barcodes?: SheetBarcode[];
  trailingRows?: SheetRow[];
}) {
  return (
    <table className="w-full table-fixed border-separate border-spacing-[0.35mm] text-[2.1mm]">
      {heading ? (
        <thead>
          <tr>
            <th
              colSpan={2}
              className="bg-sheet-master px-[1.5mm] py-[0.55mm] text-center text-[2.3mm] font-extrabold uppercase tracking-[0.04em] text-sheet-navy-foreground"
            >
              {heading}
            </th>
          </tr>
        </thead>
      ) : null}
      <tbody>
        {rows.map((row) => (
          <SpecRow key={row.label} row={row} />
        ))}
        {barcodes?.length ? (
          <tr>
            <th className="bg-sheet-label px-[1.5mm] py-[0.55mm] text-center text-[2.1mm] font-extrabold uppercase leading-[1.2] tracking-[0.02em] text-sheet-navy">
              Código
              <br />
              de barras
            </th>
            <td className="bg-sheet-value px-[1.5mm] py-[0.55mm] text-muted-foreground">
              <ul className="space-y-[0.3mm]">
                {barcodes.map((barcode) => (
                  <li key={barcode.code} className="flex items-center gap-[1.2mm]">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-[1.7mm] w-[1.7mm] shrink-0 rounded-full",
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
        ) : null}
        {trailingRows?.map((row) => <SpecRow key={row.label} row={row} />)}
      </tbody>
    </table>
  );
}

function SpecRow({ row }: { row: SheetRow }) {
  return (
    <tr>
      <th className="w-1/2 bg-sheet-label px-[1.5mm] py-[0.55mm] text-center text-[2.1mm] font-extrabold uppercase tracking-[0.02em] text-sheet-navy">
        {row.label}
        {row.unit ? <span className="text-[1.9mm] font-medium"> {row.unit}</span> : null}
      </th>
      <td className="bg-sheet-value px-[1.5mm] py-[0.55mm] text-center text-[2.1mm] text-muted-foreground">
        {row.value}
      </td>
    </tr>
  );
}
