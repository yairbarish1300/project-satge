import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { makePlaceholderImage } from '../utils/placeholderImage';
import { API_BASE, useAuth, authHeader } from './AuthContext';

export type CatalogProduct = {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  image: string;
  price: number; // per unit, per day
  unit: string;
  inStock: boolean; // the business owns at least one unit (stockTotal > 0)
  stockTotal: number; // total fleet size — real per-date availability is checked separately
  tags: string[];
};

export type NewCatalogProductInput = {
  name: string;
  sku: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  unit?: string;
  stockTotal: number;
  tags: string[];
};

export type UpdateCatalogProductInput = Partial<NewCatalogProductInput>;

export type AvailabilityResult = { stockTotal: number; availableUnits: number };

type ProductCatalogContextType = {
  products: CatalogProduct[];
  loading: boolean;
  error: string;
  addProduct: (input: NewCatalogProductInput) => Promise<void>;
  updateProduct: (id: string, input: UpdateCatalogProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  checkAvailability: (productId: string, startDate: string, endDate: string) => Promise<AvailabilityResult>;
  refresh: () => Promise<void>;
};

const ProductCatalogContext = createContext<ProductCatalogContextType | null>(null);

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'טעינת המוצרים נכשלה'));
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת המוצרים נכשלה');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProduct = useCallback(
    async (input: NewCatalogProductInput) => {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(token) },
        body: JSON.stringify({
          ...input,
          image: input.image || makePlaceholderImage(input.name.trim() || 'New Product'),
        }),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'הוספת המוצר נכשלה'));
      const data = await res.json();
      setProducts((prev) => [data.product, ...prev]);
    },
    [token],
  );

  const updateProduct = useCallback(
    async (id: string, input: UpdateCatalogProductInput) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(token) },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'עדכון המוצר נכשל'));
      const data = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
    },
    [token],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'מחיקת המוצר נכשלה'));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    [token],
  );

  const checkAvailability = useCallback(async (productId: string, startDate: string, endDate: string) => {
    const params = new URLSearchParams({ startDate, endDate });
    const res = await fetch(`${API_BASE}/products/${productId}/availability?${params.toString()}`);
    if (!res.ok) throw new Error(await extractErrorMessage(res, 'בדיקת הזמינות נכשלה'));
    return (await res.json()) as AvailabilityResult;
  }, []);

  const value = useMemo<ProductCatalogContextType>(
    () => ({ products, loading, error, addProduct, updateProduct, deleteProduct, checkAvailability, refresh }),
    [products, loading, error, addProduct, updateProduct, deleteProduct, checkAvailability, refresh],
  );

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within ProductCatalogProvider');
  }
  return context;
}
