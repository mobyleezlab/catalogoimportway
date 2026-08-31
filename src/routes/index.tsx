import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProductSheetCard } from "@/components/catalog/ProductSheetCard";
import { SheetEditorPanel } from "@/components/catalog/SheetEditorPanel";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

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
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");

  return (
    <div className="flex min-h-screen bg-muted print:block print:bg-card">
      <SheetEditorPanel
        products={products}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onChange={updateProduct}
        onReset={resetProducts}
      />

      <main className="min-w-0 flex-1 overflow-auto p-[6mm] print:p-0">
        <h1 className="sr-only">Catálogo Importway — página de fichas técnicas</h1>
        <div className="mx-auto flex h-[307mm] w-[220mm] flex-col items-center justify-center gap-[5.6mm] bg-card px-[21.5mm] py-[10mm] shadow-sm print:shadow-none">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedId(product.id)}
              className="rounded-[2.5mm] text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring print:pointer-events-none"
            >
              <ProductSheetCard product={product} />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
