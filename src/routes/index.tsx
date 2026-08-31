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
  return (
    <div className="min-h-screen overflow-auto bg-muted p-[6mm] print:bg-card print:p-0">
      <h1 className="sr-only">Catálogo Importway — página de fichas técnicas</h1>
      <div className="mx-auto flex h-[307mm] w-[220mm] flex-col items-center justify-center gap-[5.6mm] bg-card px-[21.5mm] py-[10mm] shadow-sm print:shadow-none">
        {sheetProducts.map((product) => (
          <ProductSheetCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
