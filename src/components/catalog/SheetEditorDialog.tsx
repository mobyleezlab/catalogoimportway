import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

function valueOf(rows: SheetRow[], label: string) {
  return rows.find((row) => row.label === label)?.value ?? "";
}

function buildRows(
  fields: { label: string; unit?: string }[],
  values: Record<string, string>,
): SheetRow[] {
  return fields.map((field) => ({
    label: field.label,
    ...(field.unit ? { unit: field.unit } : {}),
    value: values[field.label] ?? "",
  }));
}

export function SheetEditorDialog({
  product,
  onSave,
}: {
  product: SheetProduct;
  onSave: (next: SheetProduct) => void;
}) {
  const [open, setOpen] = useState(false);
  const [ncm, setNcm] = useState(product.ncm);
  const [barcodes, setBarcodes] = useState(
    product.barcodes.map((barcode) => barcode.code).join("\n"),
  );
  const [productValues, setProductValues] = useState<Record<string, string>>({});
  const [masterValues, setMasterValues] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState(product.image.url ?? "");
  const [imageAlt, setImageAlt] = useState(product.image.alt);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setNcm(product.ncm);
    setBarcodes(product.barcodes.map((barcode) => barcode.code).join("\n"));
    setProductValues(
      Object.fromEntries(PRODUCT_FIELDS.map((f) => [f.label, valueOf(product.product, f.label)])),
    );
    setMasterValues(
      Object.fromEntries(MASTER_FIELDS.map((f) => [f.label, valueOf(product.master, f.label)])),
    );
    setImageUrl(product.image.url ?? "");
    setImageAlt(product.image.alt);
  }, [open, product]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const codes = barcodes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onSave({
      ...product,
      ncm: ncm.trim(),
      barcodes: codes.map((code, index) => ({
        code,
        tone: (product.barcodes[index]?.tone ?? (index % 2 === 0 ? "accent" : "light")) as
          | "accent"
          | "light",
      })),
      product: buildRows(PRODUCT_FIELDS, productValues),
      master: buildRows(MASTER_FIELDS, masterValues),
      image: { alt: imageAlt, ...(imageUrl ? { url: imageUrl } : {}) },
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="print:hidden">
          Editar ficha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>
            Preencha os dados técnicos e a imagem que aparecem nesta ficha.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Tabela do produto</h3>
            <div className="space-y-1.5">
              <Label htmlFor={`${product.id}-ncm`}>NCM</Label>
              <Input
                id={`${product.id}-ncm`}
                value={ncm}
                onChange={(event) => setNcm(event.target.value)}
                placeholder="95030010"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${product.id}-barcodes`}>Códigos de barras (um por linha)</Label>
              <Textarea
                id={`${product.id}-barcodes`}
                value={barcodes}
                onChange={(event) => setBarcodes(event.target.value)}
                rows={4}
                placeholder={"7908449968895\n7908449968901"}
              />
            </div>
            {PRODUCT_FIELDS.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label htmlFor={`${product.id}-p-${field.label}`}>{fieldLabel(field)}</Label>
                <Input
                  id={`${product.id}-p-${field.label}`}
                  value={productValues[field.label] ?? ""}
                  onChange={(event) =>
                    setProductValues((current) => ({
                      ...current,
                      [field.label]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Tabela master</h3>
            {MASTER_FIELDS.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <Label htmlFor={`${product.id}-m-${field.label}`}>{fieldLabel(field)}</Label>
                <Input
                  id={`${product.id}-m-${field.label}`}
                  value={masterValues[field.label] ?? ""}
                  onChange={(event) =>
                    setMasterValues((current) => ({
                      ...current,
                      [field.label]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </section>
        </div>

        <section className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold">Imagem do produto</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={`${product.id}-alt`}>Descrição da imagem</Label>
              <Input
                id={`${product.id}-alt`}
                value={imageAlt}
                onChange={(event) => setImageAlt(event.target.value)}
              />
            </div>
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
            {imageUrl ? (
              <Button type="button" variant="ghost" onClick={() => setImageUrl("")}>
                Remover
              </Button>
            ) : null}
          </div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-32 w-auto rounded-md border bg-muted object-contain p-2"
            />
          ) : null}
        </section>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar ficha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
