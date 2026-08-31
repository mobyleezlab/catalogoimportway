import { createFileRoute } from "@tanstack/react-router";
import { ProductSheetCard } from "@/components/catalog/ProductSheetCard";
import { SheetEditorDialog } from "@/components/catalog/SheetEditorDialog";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Importway — Página de fichas técnicas" },
      {
        name: "description",
        content:
          "Página 220 × 307 mm do catálogo Importway com quatro fichas de produto: NCM, código de barras, dimensões, peso e dados master.",
      },
      { property: "og:title", content: "Catálogo Importway — Página de fichas técnicas" },
      {
        property: "og:description",
        content:
          "Quatro fichas de produto em página 220 × 307 mm, com NCM, código de barras, dimensões e dados master.",
      },
    ],
  }),
  component: CatalogSheetPage,
});

function CatalogSheetPage() {
  const { products, updateProduct, resetProducts } = useCatalogProducts();

  return (
    <div className="min-h-screen overflow-auto bg-muted p-[6mm] print:bg-card print:p-0">
      <h1 className="sr-only">Catálogo Importway — página de fichas técnicas</h1>

      <div className="mx-auto mb-[4mm] flex w-[220mm] items-center justify-between print:hidden">
        <p className="text-sm text-muted-foreground">
          Preencha os dados e a imagem de cada ficha. As alterações ficam salvas neste navegador.
        </p>
        <Button variant="ghost" size="sm" onClick={resetProducts}>
          Restaurar padrão
        </Button>
      </div>

      <div className="mx-auto flex h-[307mm] w-[220mm] flex-col items-center justify-center gap-[5.6mm] bg-card px-[21.5mm] py-[10mm] shadow-sm print:shadow-none">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductSheetCard product={product} />
            <div className="absolute -right-[19mm] top-1/2 -translate-y-1/2 print:hidden">
              <SheetEditorDialog
                product={product}
                onSave={(next) => updateProduct(product.id, next)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

