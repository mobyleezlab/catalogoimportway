import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SheetProduct, SheetRow } from "@/data/sheet-products";

/** Campos da primeira tabela (produto), na ordem exibida na ficha. */
const PRODUCT_FIELDS: { label: string; unit?: string }[] = [
  { label: "Peso", unit: "(KG)" },
  { label: "Altura", unit: "(CM)" },
  { label: "Largura", unit: "(CM)" },
  { label: "Comprimento", unit: "(CM)" },
];

/** Campos da segunda tabela (master). */
const MASTER_FIELDS: { label: string; unit?: string }[] = [
  { label: "Quantidade" },
  { label: "Peso", unit: "(KG)" },
  { label: "Altura", unit: "(CM)" },
  { label: "Largura", unit: "(CM)" },
  { label: "Comprimento", unit: "(CM)" },
  { label: "Cubagem", unit: "(M³)" },
];

function fieldLabel(field: { label: string; unit?: string }) {
  return field.unit ? `${field.label} ${field.unit.toLowerCase()}` : field.label;
}

function setRowValue(
  rows: SheetRow[],
  fields: { label: string; unit?: string }[],
  label: string,
  value: string,
): SheetRow[] {
  return fields.map((field) => {
    const current = rows.find((row) => row.label === field.label);
    return {
      label: field.label,
      ...(field.unit ? { unit: field.unit } : {}),
      value: field.label === label ? value : (current?.value ?? ""),
    };
  });
}

function valueOf(rows: SheetRow[], label: string) {
  return rows.find((row) => row.label === label)?.value ?? "";
}

export function SheetEditorPanel({
  products,
  selectedId,
  onSelect,
  onChange,
  onReset,
}: {
  products: SheetProduct[];
  selectedId: string;
  onSelect: (id: string) => void;
  onChange: (id: string, next: SheetProduct) => void;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const product = products.find((item) => item.id === selectedId) ?? products[0];
  if (!product) return null;

  const update = (patch: Partial<SheetProduct>) =>
    onChange(product.id, { ...product, ...patch });

  function handleFile(file: File | undefined) {
    if (!file || !product) return;
    const reader = new FileReader();
    reader.onload = () =>
      onChange(product.id, {
        ...product,
        image: { ...product.image, url: String(reader.result) },
      });
    reader.readAsDataURL(file);
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[24rem] shrink-0 flex-col border-r bg-card print:hidden">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Editar fichas</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Escolha uma ficha e preencha os dados. As alterações são salvas neste navegador.
        </p>
      </div>

      <nav className="flex flex-col gap-1 border-b p-2">
        {products.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "truncate rounded-md px-3 py-2 text-left text-sm transition-colors",
              item.id === product.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {item.title}
          </button>
        ))}
      </nav>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tabela do produto
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="edit-ncm">NCM</Label>
            <Input
              id="edit-ncm"
              value={product.ncm}
              onChange={(event) => update({ ncm: event.target.value })}
              placeholder="95030010"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-barcodes">Códigos de barras (um por linha)</Label>
            <Textarea
              id="edit-barcodes"
              rows={3}
              value={product.barcodes.map((barcode) => barcode.code).join("\n")}
              onChange={(event) =>
                update({
                  barcodes: event.target.value.split("\n").map((line, index) => ({
                    code: line.trim(),
                    tone: (product.barcodes[index]?.tone ??
                      (index % 2 === 0 ? "accent" : "light")) as "accent" | "light",
                  })),
                })
              }
              placeholder={"7908449968895\n7908449968901"}
            />
          </div>
          {PRODUCT_FIELDS.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <Label htmlFor={`edit-p-${field.label}`}>{fieldLabel(field)}</Label>
              <Input
                id={`edit-p-${field.label}`}
                value={valueOf(product.product, field.label)}
                onChange={(event) =>
                  update({
                    product: setRowValue(
                      product.product,
                      PRODUCT_FIELDS,
                      field.label,
                      event.target.value,
                    ),
                  })
                }
              />
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tabela master
          </h3>
          {MASTER_FIELDS.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <Label htmlFor={`edit-m-${field.label}`}>{fieldLabel(field)}</Label>
              <Input
                id={`edit-m-${field.label}`}
                value={valueOf(product.master, field.label)}
                onChange={(event) =>
                  update({
                    master: setRowValue(
                      product.master,
                      MASTER_FIELDS,
                      field.label,
                      event.target.value,
                    ),
                  })
                }
              />
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Imagem do produto
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="edit-alt">Descrição da imagem</Label>
            <Input
              id="edit-alt"
              value={product.image.alt}
              onChange={(event) =>
                update({ image: { ...product.image, alt: event.target.value } })
              }
            />
          </div>
          {product.image.url ? (
            <img
              src={product.image.url}
              alt={product.image.alt}
              className="h-28 w-auto rounded-md border bg-muted object-contain p-2"
            />
          ) : null}
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
              Enviar imagem
            </Button>
            {product.image.url ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => update({ image: { alt: product.image.alt } })}
              >
                Remover
              </Button>
            ) : null}
          </div>
        </section>
      </div>

      <div className="border-t p-3">
        <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
          Restaurar padrão
        </Button>
      </div>
    </aside>
  );
}
