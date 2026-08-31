import type { SheetBarcode, SheetProduct, SheetRow, SheetVariant } from "@/data/sheet-products";
import { cn } from "@/lib/utils";

/** Ficha de produto no formato impresso de 177 x 65 mm. */
export function ProductSheetCard({ product }: { product: SheetProduct }) {
  const half = Math.ceil(product.bullets.length / 2);
  const columns = [product.bullets.slice(0, half), product.bullets.slice(half)];

  return (
    <article className="flex h-[65mm] w-[177mm] flex-col overflow-hidden rounded-[2mm] border border-sheet-edge bg-card">
      <header className="bg-sheet-navy px-[4mm] py-[1.4mm]">
        <h2 className="text-[3.8mm] font-bold uppercase leading-none tracking-[0.02em] text-sheet-navy-foreground">
          {product.title}
        </h2>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_58mm]">
        {/* Coluna de conteúdo técnico */}
        <div className="flex min-w-0 flex-col gap-[1.6mm] px-[4mm] py-[1.8mm]">
          <div className="grid grid-cols-2 gap-x-[4mm]">
            {columns.map((column, index) => (
              <ul key={index} className="space-y-[0.5mm]">
                {column.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-[1.2mm] text-[2.15mm] leading-[1.35] text-foreground"
                  >
                    <span aria-hidden="true" className="text-sheet-navy">
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

        {/* Coluna da imagem */}
        <div className="relative flex min-w-0 flex-col border-l border-sheet-edge bg-sheet-photo">
          {/* Etiquetas de SKU/cor: suporta de 1 a 6 variantes com quebra em grade */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(17mm,1fr))] gap-[1.2mm] px-[3mm] pt-[2.5mm]">
            {product.variants.map((variant) => (
              <VariantTag key={variant.sku} variant={variant} />
            ))}
          </div>
          <div className="min-h-0 flex-1 p-[2mm]">
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
        "min-w-[19mm] rounded-[0.8mm] px-[2mm] py-[1mm] text-center leading-none",
        accent
          ? "bg-sheet-accent text-sheet-accent-foreground"
          : "border border-sheet-edge bg-card text-foreground",
      )}
    >
      <p className="text-[2.6mm] font-bold tracking-[0.02em]">{variant.sku}</p>
      <p className="mt-[0.6mm] text-[1.9mm] font-semibold uppercase tracking-[0.06em]">
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
    <table className="w-full table-fixed border-separate border-spacing-[0.4mm] text-[2.1mm]">
      {heading ? (
        <thead>
          <tr>
            <th
              colSpan={2}
              className="rounded-[0.6mm] bg-sheet-master px-[1.5mm] py-[0.9mm] text-center text-[2.4mm] font-bold uppercase tracking-[0.08em] text-sheet-navy-foreground"
            >
              {heading}
            </th>
          </tr>
        </thead>
      ) : null}
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th className="w-1/2 rounded-[0.6mm] bg-sheet-label px-[1.5mm] py-[0.9mm] text-center font-bold uppercase tracking-[0.04em] text-foreground">
              {row.label}
              {row.unit ? (
                <span className="font-normal normal-case"> {row.unit}</span>
              ) : null}
            </th>
            <td className="rounded-[0.6mm] bg-sheet-value px-[1.5mm] py-[0.9mm] text-center text-muted-foreground">
              {row.value}
            </td>
          </tr>
        ))}
        {barcodes?.length ? (
          <tr>
            <th className="rounded-[0.6mm] bg-sheet-label px-[1.5mm] py-[0.9mm] text-center font-bold uppercase tracking-[0.04em] text-foreground">
              Código de barras
            </th>
            <td className="rounded-[0.6mm] bg-sheet-value px-[1.5mm] py-[0.9mm] text-muted-foreground">
              <ul className="space-y-[0.5mm]">
                {barcodes.map((barcode) => (
                  <li key={barcode.code} className="flex items-center gap-[1.2mm]">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-[1.6mm] w-[1.6mm] shrink-0 rounded-full",
                        barcode.tone === "accent"
                          ? "bg-sheet-accent"
                          : "border border-sheet-edge bg-card",
                      )}
                    />
                    {barcode.code}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ) : null}
        {trailingRows?.map((row) => (
          <tr key={row.label}>
            <th className="w-1/2 rounded-[0.6mm] bg-sheet-label px-[1.5mm] py-[0.9mm] text-center font-bold uppercase tracking-[0.04em] text-foreground">
              {row.label}
              {row.unit ? <span className="font-normal normal-case"> {row.unit}</span> : null}
            </th>
            <td className="rounded-[0.6mm] bg-sheet-value px-[1.5mm] py-[0.9mm] text-center text-muted-foreground">
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
