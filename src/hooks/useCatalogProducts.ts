import { useCallback, useEffect, useState } from "react";
import { sheetProducts, type SheetProduct } from "@/data/sheet-products";

const STORAGE_KEY = "catalogo-importway:fichas";

/** Estado editável das fichas, persistido no navegador. */
export function useCatalogProducts() {
  const [products, setProducts] = useState<SheetProduct[]>(sheetProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProducts(JSON.parse(raw) as SheetProduct[]);
    } catch {
      /* dados inválidos: mantém o padrão */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      /* cota excedida (imagens grandes): segue apenas em memória */
    }
  }, [products, hydrated]);

  const updateProduct = useCallback((id: string, next: SheetProduct) => {
    setProducts((current) => current.map((item) => (item.id === id ? next : item)));
  }, []);

  const resetProducts = useCallback(() => setProducts(sheetProducts), []);

  return { products, updateProduct, resetProducts };
}
