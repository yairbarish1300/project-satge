import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { API_BASE, authHeader, useAuth } from './AuthContext';

export type CategoryLeaf = {
  id: string;
  name: string;
};

export type CategoryBranch = {
  id: string;
  name: string;
  leaves: CategoryLeaf[];
};

type CategoryTreeContextType = {
  branches: CategoryBranch[];
  loading: boolean;
  error: string;
  addBranch: (name: string) => Promise<boolean>;
  removeBranch: (branchId: string) => Promise<void>;
  renameBranch: (branchId: string, nextName: string) => Promise<boolean>;
  addLeaf: (branchId: string, leafName: string) => Promise<boolean>;
  removeLeaf: (branchId: string, leafId: string) => Promise<void>;
  renameLeaf: (branchId: string, leafId: string, nextName: string) => Promise<boolean>;
};

const CategoryTreeContext = createContext<CategoryTreeContextType | null>(null);

async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.message === 'string' ? data.message : fallback;
  } catch {
    return fallback;
  }
}

export function CategoryTreeProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [branches, setBranches] = useState<CategoryBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error(await extractErrorMessage(res, 'טעינת הקטגוריות נכשלה'));
      const data = await res.json();
      setBranches(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'טעינת הקטגוריות נכשלה');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const jsonHeaders = useMemo(() => ({ 'Content-Type': 'application/json', ...authHeader(token) }), [token]);

  const addBranch = useCallback(
    async (name: string) => {
      if (!name.trim()) return false;
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'הוספת הענף נכשלה'));
        return false;
      }
      const data = await res.json();
      setBranches((prev) => [...prev, data.category]);
      setError('');
      return true;
    },
    [jsonHeaders],
  );

  const removeBranch = useCallback(
    async (branchId: string) => {
      const res = await fetch(`${API_BASE}/categories/${branchId}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'הסרת הענף נכשלה'));
        return;
      }
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
      setError('');
    },
    [token],
  );

  const renameBranch = useCallback(
    async (branchId: string, nextName: string) => {
      if (!nextName.trim()) return false;
      const res = await fetch(`${API_BASE}/categories/${branchId}`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ name: nextName }),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'שינוי שם הענף נכשל'));
        return false;
      }
      const data = await res.json();
      setBranches((prev) => prev.map((b) => (b.id === branchId ? data.category : b)));
      setError('');
      return true;
    },
    [jsonHeaders],
  );

  const addLeaf = useCallback(
    async (branchId: string, leafName: string) => {
      if (!leafName.trim()) return false;
      const res = await fetch(`${API_BASE}/categories/${branchId}/leaves`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: leafName }),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'הוספת העלה נכשלה'));
        return false;
      }
      const data = await res.json();
      setBranches((prev) => prev.map((b) => (b.id === branchId ? data.category : b)));
      setError('');
      return true;
    },
    [jsonHeaders],
  );

  const removeLeaf = useCallback(
    async (branchId: string, leafId: string) => {
      const res = await fetch(`${API_BASE}/categories/${branchId}/leaves/${leafId}`, {
        method: 'DELETE',
        headers: authHeader(token),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'הסרת העלה נכשלה'));
        return;
      }
      const data = await res.json();
      setBranches((prev) => prev.map((b) => (b.id === branchId ? data.category : b)));
      setError('');
    },
    [token],
  );

  const renameLeaf = useCallback(
    async (branchId: string, leafId: string, nextName: string) => {
      if (!nextName.trim()) return false;
      const res = await fetch(`${API_BASE}/categories/${branchId}/leaves/${leafId}`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ name: nextName }),
      });
      if (!res.ok) {
        setError(await extractErrorMessage(res, 'שינוי שם העלה נכשל'));
        return false;
      }
      const data = await res.json();
      setBranches((prev) => prev.map((b) => (b.id === branchId ? data.category : b)));
      setError('');
      return true;
    },
    [jsonHeaders],
  );

  const value = useMemo<CategoryTreeContextType>(
    () => ({ branches, loading, error, addBranch, removeBranch, renameBranch, addLeaf, removeLeaf, renameLeaf }),
    [branches, loading, error, addBranch, removeBranch, renameBranch, addLeaf, removeLeaf, renameLeaf],
  );

  return <CategoryTreeContext.Provider value={value}>{children}</CategoryTreeContext.Provider>;
}

export function useCategoryTree() {
  const context = useContext(CategoryTreeContext);
  if (!context) {
    throw new Error('useCategoryTree must be used within CategoryTreeProvider');
  }
  return context;
}
