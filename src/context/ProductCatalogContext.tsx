import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { makePlaceholderImage } from '../utils/placeholderImage';

const CATALOG_STORAGE_KEY = 'stage-product-catalog-v1';

export type CatalogProduct = {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  image: string;
  price: number;
  unit: string;
  inStock: boolean;
  stockAvailable: number;
  stockTotal: number;
  tags: string[];
};

type NewCatalogProductInput = {
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

type ProductCatalogContextType = {
  products: CatalogProduct[];
  addProduct: (input: NewCatalogProductInput) => void;
};

const ProductCatalogContext = createContext<ProductCatalogContextType | null>(null);

const INITIAL_PRODUCTS: CatalogProduct[] = [
  {
    id: 'shop-1',
    name: 'רמקול JBL V20 מקצועי',
    sku: 'AUDIO-01',
    description: 'מערכת Line Array עוצמתית לאירועים גדולים ופסטיבלים. איכות סאונד קריסטלית.',
    image: makePlaceholderImage('JBL V20', { accent: '#4be277', secondary: '#adc6ff' }),
    price: 350,
    unit: '/ יום',
    inStock: true,
    stockAvailable: 18,
    stockTotal: 24,
    category: 'Sound',
    tags: ['רמקול', 'Line Array'],
  },
  {
    id: 'shop-2',
    name: 'תאורת Beam 230W',
    sku: 'LIGHT-02',
    description: 'פנס חכם עם תנועה מהירה וצבעים עזים למופעי במה.',
    image: makePlaceholderImage('Beam 230W', { accent: '#f59e0b', secondary: '#fb7185' }),
    price: 180,
    unit: '/ יום',
    inStock: false,
    stockAvailable: 0,
    stockTotal: 12,
    category: 'Lighting',
    tags: ['תאורה', 'Beam'],
  },
  {
    id: 'shop-3',
    name: 'מיקרופון Shure QLXD אלחוטי',
    sku: 'MIC-03',
    description: 'סט אלחוטי דיגיטלי מקצועי לשידור נקי מהפרעות.',
    image: makePlaceholderImage('Shure QLXD', { accent: '#22c55e', secondary: '#60a5fa' }),
    price: 220,
    unit: '/ יום',
    inStock: true,
    stockAvailable: 9,
    stockTotal: 10,
    category: 'Audio',
    tags: ['מיקרופון', 'אלחוטי'],
  },
];

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    try {
      const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY);
      if (!raw) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(raw) as CatalogProduct[];
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PRODUCTS;
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const value = useMemo<ProductCatalogContextType>(() => {
    const addProduct = (input: NewCatalogProductInput) => {
      const total = Math.max(0, Math.floor(input.stockTotal));

      const product: CatalogProduct = {
        id: `added-${Date.now()}`,
        name: input.name.trim(),
        sku: input.sku.trim(),
        description: input.description.trim(),
        category: input.category.trim() || 'General',
        image: input.image || makePlaceholderImage(input.name.trim() || 'New Product'),
        price: input.price,
        unit: input.unit || '/ יום',
        inStock: total > 0,
        stockAvailable: total,
        stockTotal: total,
        tags: input.tags,
      };

      setProducts((prev) => [product, ...prev]);
    };

    return {
      products,
      addProduct,
    };
  }, [products]);

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within ProductCatalogProvider');
  }
  return context;
}
