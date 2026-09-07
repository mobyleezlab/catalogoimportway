import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Maximize2, Ruler } from "lucide-react";
import { ProductSheetCard } from "@/components/catalog/ProductSheetCard";
import { SheetEditorPanel } from "@/components/catalog/SheetEditorPanel";
import { Button } from "@/components/ui/button";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { cn } from "@/lib/utils";

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

/** Margens da página em milímetros. */
const MARGINS = { top: 22, bottom: 10, left: 21.5, right: 21.5 };
const PAGE = { width: 220, height: 307 };
const MM = 96 / 25.4;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

const clamp = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

function CatalogSheetPage() {
  const { products, updateProduct, resetProducts } = useCatalogProducts();
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [zoom, setZoom] = useState(1);
  const [autoFit, setAutoFit] = useState(true);
  const [showMargins, setShowMargins] = useState(true);
  const viewportRef = useRef<HTMLElement | null>(null);

  const fitToView = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const padding = 48;
    const scale = Math.min(
      (el.clientWidth - padding) / (PAGE.width * MM),
      (el.clientHeight - padding) / (PAGE.height * MM),
    );
    setZoom(clamp(scale));
    setAutoFit(true);
  }, []);

  const setManualZoom = useCallback((value: number | ((z: number) => number)) => {
    setAutoFit(false);
    setZoom((z) => clamp(typeof value === "function" ? value(z) : value));
  }, []);

  useEffect(() => {
    fitToView();
  }, [fitToView]);

  useEffect(() => {
    if (!autoFit) return;
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fitToView());
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoFit, fitToView]);

  return (
    <div className="flex min-h-screen bg-muted print:block print:bg-card">
      <SheetEditorPanel
        products={products}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onChange={updateProduct}
        onReset={resetProducts}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-4 py-2 print:hidden">
          <Button variant="outline" size="icon" onClick={() => setManualZoom((z) => z - 0.1)}>
            <Minus className="size-4" />
            <span className="sr-only">Diminuir zoom</span>
          </Button>
          <span className="w-14 text-center text-sm tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={() => setManualZoom((z) => z + 0.1)}>
            <Plus className="size-4" />
            <span className="sr-only">Aumentar zoom</span>
          </Button>
          <Button variant="outline" size="sm" onClick={fitToView}>
            <Maximize2 className="mr-2 size-4" />
            Página inteira
          </Button>
          <Button variant="outline" size="sm" onClick={() => setManualZoom(1)}>
            100%
          </Button>
          <Button
            variant={showMargins ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMargins((value) => !value)}
          >
            <Ruler className="mr-2 size-4" />
            Margens
          </Button>
        </div>

        <main ref={viewportRef} className="min-h-0 min-w-0 flex-1 overflow-auto p-6 print:p-0">
          <h1 className="sr-only">Catálogo Importway — página de fichas técnicas</h1>
          <div
            className="mx-auto print:!scale-100"
            style={{
              width: `${PAGE.width * MM * zoom}px`,
              height: `${PAGE.height * MM * zoom}px`,
            }}
          >
            <div
              className="relative bg-card shadow-sm print:shadow-none"
              style={{
                width: `${PAGE.width}mm`,
                height: `${PAGE.height}mm`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              {showMargins ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 print:hidden">
                  {/* Linhas horizontais (margens superior e inferior) atravessando a página */}
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-ring/60"
                    style={{ top: `${MARGINS.top}mm` }}
                  />
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-ring/60"
                    style={{ bottom: `${MARGINS.bottom}mm` }}
                  />
                  {/* Linhas verticais (margens esquerda e direita) atravessando a página */}
                  <div
                    className="absolute top-0 bottom-0 border-l border-dashed border-ring/60"
                    style={{ left: `${MARGINS.left}mm` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 border-l border-dashed border-ring/60"
                    style={{ right: `${MARGINS.right}mm` }}
                  />
                </div>
              ) : null}

              <div
                className="flex h-full flex-col items-center gap-[4mm]"
                style={{
                  paddingTop: `${MARGINS.top}mm`,
                  paddingBottom: `${MARGINS.bottom}mm`,
                  paddingLeft: `${MARGINS.left}mm`,
                  paddingRight: `${MARGINS.right}mm`,
                }}
              >
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedId(product.id)}
                    className={cn(
                      "rounded-[2.5mm] text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring print:pointer-events-none",
                    )}
                  >
                    <ProductSheetCard product={product} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
